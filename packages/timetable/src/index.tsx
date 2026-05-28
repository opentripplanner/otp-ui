import React, { ChangeEvent, ReactElement, useMemo, useState } from "react";
import styled from "styled-components";
import toposort from "toposort";

const COLUMN_WIDTH = "85px";

interface TimeTableRowProps {
  values: string[];
}

export interface PatternStop {
  id: string;
  name: string;
}

export interface TimetableTrip {
  blockId: string;
  firstStopTime: number; // pure seconds
  stops: Map<string, StopDetail>; // stop ID, stop detail
}

export interface StopDetail {
  time: Date;
  timepoint: boolean;
}

const CellContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: ${COLUMN_WIDTH};
`;

// TODO: make highlight color customizable
// TODO: deal with "active" and "focus" states?
const RowContainer = styled.div`
  display: flex;

  &:hover {
    background: hsla(163, 100%, 74%, 1);
  }
`;

const TimeTableRow = (props: TimeTableRowProps): ReactElement => {
  const { values } = props;

  return (
    <RowContainer>
      {values.map((v, i) => (
        <CellContainer key={i}>
          <span>{v}</span>
        </CellContainer>
      ))}
    </RowContainer>
  );
};

export interface Route {
  patterns: Pattern[];
}

interface Pattern {
  id: string; // needed?
  directionId: number;
  name: string; // needed?
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
}

const TimeTable = (props: TimeTableProps): ReactElement => {
  const { route, includeDwellStops, showBlockId } = props;

  const { patterns } = route;

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
        updatedStopTimes.push(arrivalStopTime);
        updatedStopTimes.push(departureStopTime);
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
      // sort by arrival time at common stop
      return (a: TimetableTrip, b: TimetableTrip) => {
        const timeA = a.stops.get(commonStopId)?.time || new Date(); // TODO: inspect
        const timeB = b.stops.get(commonStopId)?.time || new Date();
        return timeA.valueOf() - timeB.valueOf();
      };
    }
    // sort by first stop time in trip
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
      <RowContainer>
        {showBlockId ? <CellContainer>Block ID</CellContainer> : <div />}
        {filteredPatternStops.map((s, index) => (
          <CellContainer key={index}>
            <span
              style={{
                fontWeight: timepointStopIds.has(s.id) ? "bold" : "normal"
              }}
            >
              {s.name}
            </span>
          </CellContainer>
        ))}
      </RowContainer>
      <div>
        {timetableTrips.map((t, index) => {
          const rowValues = showBlockId ? [t.blockId] : [];
          filteredPatternStops.forEach(patternStop => {
            const stopDetail = t.stops.get(patternStop.id);
            rowValues.push(
              stopDetail
                ? stopDetail.time.toLocaleTimeString("en-us", {
                    timeZone: "America/Chicago",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit" // need to deal with rounding here
                  })
                : "-"
            );
          });

          return (
            <TimeTableRow key={`${t.blockId}-${index}`} values={rowValues} />
          );
        })}
      </div>
    </>
  );
};

export { TimeTable, TimeTableRow };
