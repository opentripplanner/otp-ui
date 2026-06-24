import React, { useMemo } from "react";
import { IntlShape } from "react-intl";
import styled from "styled-components";
import toposort from "toposort";

const COLUMN_WIDTH = "85px";

const Table = styled.table`
  display: block;
  overflow: auto;
  width: 100%;
`;

const TBody = styled.tbody`
  white-space: nowrap;
`;

const TH = styled.th<{ closed?: boolean }>`
  min-width: ${COLUMN_WIDTH};
  padding: 1rem;
  text-decoration: ${props => (props.closed ? "line-through" : "")};
`;

const TR = styled.tr`
  text-align: center;
  vertical-align: middle;
`;

const TD = styled.td<{ closed?: boolean }>`
  padding: 1rem;
  text-decoration: ${props => (props.closed ? "line-through" : "")};
`;

interface PatternStop {
  id: string;
  name: string;
}

interface TimetableTrip {
  blockId: string;
  /** The first stoptime of the trip, in seconds past midnight of the service
   * day. Used for sorting trips by first stop time
   */
  firstStopTime: number;
  /** A map of stop GTFS ID to stop detail */
  stops: Map<string, StopDetail>;
}

interface StopDetail {
  time: Date;
  timepoint: boolean;
}

interface Route {
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

const createDwellStops = (trips: Trip[], timepoints: Set<string>): Trip[] => {
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
  return withDwellStops;
};

const determineTimepoints = (trips: Trip[]): Set<string> => {
  const timepoints = new Set<string>();

  // Timepoints are tied to stops on individual trips, so we need
  // to loop through all trip stops to find all timepoints
  trips
    .flatMap(trip => trip.stoptimesForDate)
    .forEach(st => {
      if (st.timepoint) timepoints.add(st.stop.gtfsId);
    });

  return timepoints;
};

// Create a Directed Acyclic Graph (DAG) of all the trips, of the format [stop, nextStop].
const createStopGraph = (
  trips: Trip[],
  stopIdToNameMap: Map<string, string>,
  tripStopSets: Set<string>[]
): [string, string][] => {
  const stopGraph: [string, string][] = [];
  trips.forEach(trip => {
    const stopIds: string[] = [];
    const set = new Set<string>();
    trip.stoptimesForDate.forEach(st => {
      stopIdToNameMap.set(st.stop.gtfsId, st.stop.name);
      stopIds.push(st.stop.gtfsId);
      set.add(st.stop.gtfsId);
    });
    tripStopSets.push(set);
    stopIds.forEach((stopId, index) => {
      if (index !== stopIds.length - 1)
        stopGraph.push([stopId, stopIds[index + 1]]);
    });
  });
  return stopGraph;
};

const naiveSortStops = (patterns: Pattern[], directionId: number): string[] => {
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

  return [...naiveStops];
};

interface TimeTableProps {
  /** Direction of the route to show. Follows the format of the `direction_id` field of
   * the `trips.txt` GTFS file: `0` for one direction, `1` for the opposite direction
   */
  directionId: number;
  route: Route;
  /** Whether to show only timepoint stops in the timetable */
  timepointsOnly: boolean;
  /** A set of gtfsId values for stops that are closed and should be shown with strikethrough */
  closedStops?: Set<string>;
  /** If the topological sort of the stop IDs fails for any reason, a `false` value here
   * will cause the timetable to use a fallback "naive" stop sorting
   */
  errorOnStopSorting?: boolean;
  /** Whether to include separate stops for entries in `stop_times.txt` that have different
   * values for `arrival_time` and `departure_time`
   */
  includeDwellStops?: boolean;
  /** A react-intl object to use for time formatting */
  intl?: IntlShape;
  /** Whether each trip/row entry in the timetable should show the block ID of the trip */
  showBlockId?: boolean;
  /** Time zone in which to display stop times if no intl object is provided */
  timeZone?: string;
}

const TimeTable = (props: TimeTableProps): JSX.Element => {
  const {
    closedStops,
    directionId,
    errorOnStopSorting,
    includeDwellStops,
    intl,
    route,
    showBlockId,
    timepointsOnly,
    timeZone
  } = props;

  const { patterns } = route;

  const [allTrips, timepointStopIds] = useMemo(() => {
    const trips = patterns
      .filter(p => p.directionId === directionId)
      .flatMap(p => p.tripsForDate);

    const timepoints = determineTimepoints(trips);

    if (!includeDwellStops) return [trips, timepoints];

    const withDwellStops = createDwellStops(trips, timepoints);

    return [withDwellStops, timepoints];
  }, [patterns, directionId, includeDwellStops]);

  const { patternStops, tripStopSets } = useMemo(() => {
    // Array of sets; each set contains all of the stop IDs that are visited in a trip.
    // This allows us to find a common stop to use for sorting trips without needing
    // to iterate through all of the stoptimes again later on.
    const sets: Set<string>[] = [];

    // Used to extract stop names more efficiently later
    const stopIdToNameMap = new Map<string, string>();

    const stopGraph = createStopGraph(allTrips, stopIdToNameMap, sets);

    let sorted: string[] = [];
    try {
      // Topologically sort the stop graph to determine a valid order of stops for the entire timetable
      sorted = toposort(stopGraph);
    } catch (error) {
      console.warn("error topologically sorting stop graph", error);
      if (!errorOnStopSorting) {
        // If sorting fails, just create an array of all the unique stops visited
        // across all trips
        sorted = naiveSortStops(patterns, directionId);
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
      patternStops.filter(s =>
        timepointsOnly ? timepointStopIds.has(s.id) : true
      ),
    [timepointsOnly, patternStops, timepointStopIds]
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

  return (
    <Table className="timetable-table" tabIndex={0}>
      <thead className="timetable-thead">
        <tr>
          {(showBlockId ? [{ id: "blockIdHeader", name: "Block ID" }] : [])
            .concat(filteredPatternStops)
            .map((s, index) => {
              return (
                <TH
                  className="timetable-th"
                  key={index}
                  scope="col"
                  closed={closedStops && closedStops.has(s.id)}
                >
                  {s.name}
                </TH>
              );
            })}
        </tr>
      </thead>
      <TBody className="timetable-tbody">
        {timetableTrips.map((t, index) => {
          const rowValues: { closed: boolean; value: string }[] = showBlockId
            ? [{ closed: false, value: t.blockId }]
            : [];
          filteredPatternStops.forEach(patternStop => {
            const stopDetail = t.stops.get(patternStop.id);
            rowValues.push({
              closed: closedStops?.has(patternStop.id) || false,
              value: stopDetail
                ? intl
                  ? intl.formatTime(stopDetail.time)
                  : stopDetail.time.toLocaleTimeString("en-us", {
                      timeZone,
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                : "-"
            });
          });

          return (
            <TR className="timetable-tr" key={index}>
              {rowValues.map((r, rowIndex) => (
                <TD className="timetable-td" key={rowIndex} closed={r.closed}>
                  {r.value}
                </TD>
              ))}
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
};

export default TimeTable;
