import React, { ChangeEvent, ReactElement, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import toposort from "toposort";

const COLUMN_WIDTH = "85px";

const Table = styled.table`
  display: block;
  overflow: auto;
  table-layout: fixed;
  width: 100%;
`;

const TBody = styled.tbody`
  white-space: nowrap;
`;

const TH = styled.th`
  min-width: ${COLUMN_WIDTH};
  padding: 1rem;
`;

const TR = styled.tr`
  text-align: center;
  vertical-align: middle;
  width: ${COLUMN_WIDTH};
`;

const TD = styled.td`
  padding: 1rem 0;
`;

export interface PatternStop {
  id: string;
  name: string;
}

export interface TimetableTrip {
  blockId: string;
  /** The first stoptime of the trip, in seconds past midnight of the service
   * day. Used for sorting trips by first stop time
   */
  firstStopTime: number;
  /** A map of stop GTFS ID to stop detail */
  stops: Map<string, StopDetail>;
}

export interface StopDetail {
  time: Date;
  timepoint: boolean;
}

export interface Route {
  patterns: Pattern[];
}

interface Pattern {
  directionId: number;
  name: string;
  tripsForDate: Trip[];
}

interface Trip {
  blockId: string;
  stoptimesForDate: Stoptime[];
}

interface Stoptime {
  serviceDay: number;
  scheduledArrival: number;
  scheduledDeparture: number;
  pickupType: string;
  dropoffType: string;
  timepoint: boolean;
  stop: Stop;
}

interface Stop {
  gtfsId: string;
  name: string;
}

export interface TimeTableProps {
  route: Route;
  includeDwellStops?: boolean;
  showBlockId?: boolean;
  errorOnStopSorting?: boolean;
  timeZone?: string;
}

const TimeTable = (props: TimeTableProps): ReactElement => {
  const { route, includeDwellStops, showBlockId, errorOnStopSorting } = props;

  const { patterns } = route;

  const intl = useIntl();

  const [directionId, setDirectionId] = useState<number>(0);
  const [expanded, setExpanded] = useState(false);

  // Used to extract stop names more efficiently later
  const stopIdToNameMap = new Map<string, string>();

  const [allTrips, timepointStopIds] = useMemo(() => {
    const trips = patterns
      .filter(p => p.directionId === directionId)
      .flatMap(p => p.tripsForDate);

    const timepoints = new Set<string>();

    // Timepoints are tied to stops on individual trips, so we need to
    // loop through all trip stops to find all timepoints
    trips
      .flatMap(trip => trip.stoptimesForDate)
      .forEach(st => {
        if (st.timepoint) timepoints.add(st.stop.gtfsId);
      });

    if (!includeDwellStops) return [trips, timepoints];

    // To accommodate "dwell stops" where arrival and departure time are different,
    // we need to look for such stops and create an additional "dwell stop" within
    // the trip
    const withDwellStops: Trip[] = [];
    trips.forEach(trip => {
      const updatedStopTimes: Stoptime[] = [];
      trip.stoptimesForDate.forEach(st => {
        if (st.scheduledArrival === st.scheduledDeparture) {
          updatedStopTimes.push(st);
          return;
        }
        const dwellStopId = `${st.stop.gtfsId}:dwell`;
        const arrivalStopTime: Stoptime = {
          ...st,
          scheduledDeparture: st.scheduledArrival
        };
        const departureStopTime: Stoptime = {
          ...st,
          scheduledArrival: st.scheduledDeparture,
          stop: {
            ...st.stop,
            gtfsId: dwellStopId
          }
        };
        updatedStopTimes.push(arrivalStopTime, departureStopTime);
        if (st.timepoint) timepoints.add(dwellStopId);
      });
      withDwellStops.push({
        blockId: trip.blockId,
        stoptimesForDate: updatedStopTimes
      });
    });
    return [withDwellStops, timepoints];
  }, [patterns, directionId, includeDwellStops]);

  const { patternStops, tripStopSets } = useMemo(() => {
    // Array of sets; each set contains all of the stop IDs that are visited in a trip.
    // This allows us to find a common stop to use for sorting trips without needing
    // to iterate through all of the stoptimes again later on.
    const sets: Set<string>[] = [];

    // Create a Directed Acyclic Graph (DAG) of all the trips, of the format [stop, nextStop].
    // This DAG will then be topologically sorted to determine a valid order of stops for the
    // entire timetable
    const stopGraph: [string, string][] = [];
    allTrips.forEach(trip => {
      const stopIds: string[] = [];
      const set = new Set<string>();
      trip.stoptimesForDate.forEach(st => {
        stopIdToNameMap.set(st.stop.gtfsId, st.stop.name);
        stopIds.push(st.stop.gtfsId);
        set.add(st.stop.gtfsId);
      });
      sets.push(set);
      stopIds.forEach((stopId, index) => {
        if (index !== stopIds.length - 1)
          stopGraph.push([stopId, stopIds[index + 1]]);
      });
    });

    let sorted: string[] = [];
    try {
      sorted = toposort(stopGraph);
    } catch (error) {
      console.warn("error topologically sorting stop graph", error);
      if (!errorOnStopSorting) {
        // If sorting fails, just create an array of all the unique stops visited
        // across all trips
        const naiveStops = new Set<string>();
        patterns
          .filter(p => p.directionId === directionId)
          .forEach(p => {
            p.tripsForDate.forEach(trip =>
              trip.stoptimesForDate.forEach(st => {
                naiveStops.add(st.stop.gtfsId);
              })
            );
          });
        sorted = [...naiveStops];
      }
    }

    const patternStopsFromSorted: PatternStop[] = sorted.map(stopId => {
      return {
        id: stopId,
        name: stopIdToNameMap.get(stopId) ?? ""
      };
    });

    return { patternStops: patternStopsFromSorted, tripStopSets: sets };
  }, [allTrips]);

  const commonStopId = useMemo(() => {
    let result;
    for (let i = 0; i < patternStops.length; i++) {
      const stopId = patternStops[i].id;
      const inAllTrips = tripStopSets.every(trip => trip.has(stopId));
      if (inAllTrips) {
        result = stopId;
        break;
      }
    }
    return result;
  }, [patternStops, tripStopSets]);

  const comparator = useMemo(() => {
    if (commonStopId) {
      // Sort by arrival time at common stop
      return (a: TimetableTrip, b: TimetableTrip) => {
        const timeA = a.stops.get(commonStopId)?.time || new Date();
        const timeB = b.stops.get(commonStopId)?.time || new Date();
        return timeA.valueOf() - timeB.valueOf();
      };
    }
    // Sort by first stop time in trip
    // TODO: add other sort methods
    return (a: TimetableTrip, b: TimetableTrip) =>
      a.firstStopTime - b.firstStopTime;
  }, [commonStopId]);

  const filteredPatternStops = useMemo(
    () =>
      patternStops.filter(s => (expanded ? true : timepointStopIds.has(s.id))),
    [expanded, patternStops, timepointStopIds]
  );

  const timetableTrips: TimetableTrip[] = useMemo<TimetableTrip[]>(() => {
    return allTrips
      .map(t => {
        const firstStop = t.stoptimesForDate[0];
        return {
          blockId: t.blockId,
          firstStopTime: firstStop.serviceDay + firstStop.scheduledArrival,
          stops: new Map(
            t.stoptimesForDate.map(st => {
              return [
                st.stop.gtfsId,
                {
                  time: new Date((st.serviceDay + st.scheduledArrival) * 1000),
                  timepoint: st.timepoint
                }
              ];
            })
          )
        };
      })
      .sort(comparator);
  }, [allTrips, comparator]);

  const handleDirectionSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const numVal = Number(val);
    setDirectionId(numVal);
  };

  return (
    <>
      <button type="button" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show Timepoints Only" : "Show All Stops"}
      </button>
      <select id="direction-select" onChange={handleDirectionSelection}>
        <option value={0}>One Direction</option>
        <option value={1}>Other Direction</option>
      </select>
      <Table>
        <thead>
          <tr>
            {(showBlockId ? [{ id: "blockIdHeader", name: "Block ID" }] : [])
              .concat(filteredPatternStops)
              .map((s, index) => {
                return (
                  <TH key={index} scope="col">
                    {s.name}
                  </TH>
                );
              })}
          </tr>
        </thead>
        <TBody>
          {timetableTrips.map((t, index) => {
            const rowValues: string[] = showBlockId ? [t.blockId] : [];
            filteredPatternStops.forEach(patternStop => {
              const stopDetail = t.stops.get(patternStop.id);
              rowValues.push(
                stopDetail
                  ? intl.formatTime(stopDetail.time, {
                      timeStyle: "short",
                      hourCycle: "h24"
                    })
                  : "-"
              );
            });

            return (
              <TR key={index}>
                {rowValues.map((r, rowIndex) => (
                  <TD key={rowIndex}>{r}</TD>
                ))}
              </TR>
            );
          })}
        </TBody>
      </Table>
    </>
  );
};

export { TimeTable };
