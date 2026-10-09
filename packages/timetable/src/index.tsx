import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import styled from "styled-components";
import toposort from "toposort";

import defaultEnglishMessages from "../i18n/en-US.yml";
import Notice from "./notice";

const COLUMN_WIDTH = "85px";

const Table = styled.table`
  display: block;
  overflow: auto;
  width: 100%;

  th.notices-column {
    min-width: 0;
  }
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

const InvisibleText = styled.div`
  clip: rect(0, 0, 0, 0);
  height: 0;
  overflow: hidden;
  width: 0;
`;

interface PatternStop {
  id: string;
  name: string;
  /** If a stop occurs multiple times within a trip, this index marks which occurrence this stop is */
  occurrenceIndex: number;
}

/** All of the information needed to display an individual trip in the timetable */
interface TimetableTrip {
  blockId: string;
  /** The first stoptime of the trip, in seconds past midnight of the service
   * day. Used for sorting trips by first stop time
   */
  firstStopTime: number;
  gtfsId: string;
  stops: Map<string, Stoptime[]>;
  notices?: string[];
  tripHeadsign?: string;
  tripShortName?: string;
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
  gtfsId: string;
  stoptimesForDate: Stoptime[];
  notices?: { text: string }[];
  tripHeadsign?: string;
  tripShortName?: string;
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

interface RowValue {
  closed?: boolean;
  value: string | JSX.Element;
}

/**
 * BLOCK_ID: Shows the block ID of the trip
 *
 * NOTICES: Enables notices to be shown as an info icon on each individual trip in the timetable. When
 * clicked, the notice is shown in a modal popup. Requires
 * notices field on each trip record. See https://github.com/google/transit/pull/638 for more information
 *
 * TRIP_HEADSIGN: Shows the value for tripHeadsign for the trip
 *
 * TRIP_ID: Shows the value for gtfsId for the trip
 *
 * TRIP_SHORT_NAME: Shows the value for tripShortName for the trip
 */
export type AdditionalColumn =
  | "BLOCK_ID"
  | "NOTICES"
  | "TRIP_HEADSIGN"
  | "TRIP_ID"
  | "TRIP_SHORT_NAME";

/** Describes the content of the header for a leading column. Leading
 * columns are optional columns that are appended to the beginning of
 * the timetable.
 */
interface LeadingColumnHeader {
  /** ARIA label to use for leading columns that don't have header text */
  ariaLabel?: string;
  className?: string;
  id: string;
  name: string;
}

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

/** Takes a trip and returns an array of "unique stop IDs" in the order they are visited
 * in the trip. The unique stop ID is formed by combining the stop GTFS ID with the occurrence
 * of that stop, for stops that are visited multiple times in the same trip. Also updates a map
 * that tracks the linkage of unique stop IDs to pattern stop objects.
 *
 * @param trip The trip to be converted
 * @param uniqueStopIdMap The map that tracks how unique stop IDs are linked to pattern stop objects
 */
const convertTripToUniqueStopIds = (
  trip: Trip,
  uniqueStopIdMap: Map<string, PatternStop>
): string[] => {
  const patternStopIds: string[] = [];
  const stopOccurrenceCounter: Map<string, number> = new Map();
  trip.stoptimesForDate.forEach(st => {
    const stopId = st.stop.gtfsId;
    const occurrenceIndex = stopOccurrenceCounter.get(stopId) || 0;
    stopOccurrenceCounter.set(stopId, occurrenceIndex + 1);
    const patternStop = {
      id: stopId,
      name: st.stop.name,
      occurrenceIndex
    };
    const uniqueStopId = `${stopId}-${occurrenceIndex}`;
    uniqueStopIdMap.set(uniqueStopId, patternStop);
    patternStopIds.push(uniqueStopId);
  });

  return patternStopIds;
};

/** Creates a Directed Acyclic Graph (DAG) of all the trips, with each stop in a trip linked to
 * the stop that follows it: [stop, nextStop][]. Each stop is represented as a unique ID, which
 * combines the stop's GTFS ID and the stop occurrence (for stops that are repeated in a trip).
 *
 * Also returns an array of sets; each set contains all of the unique stop GTFS IDs visited by each trip
 *
 * Also returns a map that links each "unique stop ID" to the actual stop object that it represents
 */
const createStopGraph = (
  trips: Trip[]
): [[string, string][], Set<string>[], Map<string, PatternStop>] => {
  const stopGraph: [string, string][] = [];
  const tripStopSets: Set<string>[] = [];
  const uniqueStopIdMap = new Map<string, PatternStop>();
  trips.forEach(trip => {
    const uniqueStopIds = convertTripToUniqueStopIds(trip, uniqueStopIdMap);
    // Create a set to keep track of all the unique stop IDs visited in this trip
    const tripStopSet = new Set<string>();
    uniqueStopIds.forEach((uniqueId, index) => {
      const originalStopId = uniqueStopIdMap.get(uniqueId)?.id;
      if (originalStopId) tripStopSet.add(originalStopId);
      if (index !== uniqueStopIds.length - 1)
        stopGraph.push([uniqueId, uniqueStopIds[index + 1]]);
    });
    tripStopSets.push(tripStopSet);
  });
  return [stopGraph, tripStopSets, uniqueStopIdMap];
};

/** Creates a master stop order using a "naive" method. While all stops are guaranteed to be
 * represented, the order of stops is not guaranteed to be valid for all trips. This can result
 * in a timetable row with non-chronological stoptimes, and should only be used as a last resort
 * if the topological sort fails.
 */
const naiveSortStops = (trips: Trip[]): PatternStop[] => {
  const allStopIdsVisited = new Set<string>();
  const uniqueStopIdMap = new Map<string, PatternStop>();
  const sorted: PatternStop[] = [];
  trips.forEach(t => {
    const uniqueStopIds = convertTripToUniqueStopIds(t, uniqueStopIdMap);
    uniqueStopIds.forEach(id => allStopIdsVisited.add(id));
  });

  allStopIdsVisited.forEach(stopId => {
    const patternStop = uniqueStopIdMap.get(stopId);
    if (patternStop) sorted.push(patternStop);
  });

  return sorted;
};

const formatStoptimeForDisplay = (
  intl: IntlShape,
  stoptime?: Stoptime,
  dwellStop?: boolean
): string | JSX.Element => {
  if (!stoptime) return "-";
  const arrivalTimeMs =
    (stoptime.serviceDay + stoptime.scheduledArrival) * 1000;

  let arrivalString = intl.formatTime(arrivalTimeMs);

  let departureString = "";

  if (dwellStop) {
    arrivalString = intl.formatMessage(
      {
        defaultMessage: defaultEnglishMessages["otpUi.DwellStop.arrivalTime"],
        description: "Arrival time for dwell stop",
        id: "otpUi.DwellStop.arrivalTime"
      },
      { time: arrivalString }
    );
    const departureTimeMs =
      (stoptime.serviceDay + stoptime.scheduledDeparture) * 1000;
    departureString = intl.formatMessage(
      {
        defaultMessage: defaultEnglishMessages["otpUi.DwellStop.departureTime"],
        description: "Departure time for dwell stop",
        id: "otpUi.DwellStop.departureTime"
      },
      { time: intl.formatTime(departureTimeMs) }
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>{arrivalString}</span>
      {dwellStop && <span>{departureString}</span>}
    </div>
  );
};

const createAdditionalColumnHeader = (
  additionalColumn: AdditionalColumn
): LeadingColumnHeader => {
  switch (additionalColumn) {
    case "NOTICES":
      return {
        ariaLabel: "Notices",
        className: "notices-column",
        id: "tripNotesHeader",
        name: ""
      };
    case "BLOCK_ID":
      return {
        id: "blockIdHeader",
        name: "Block ID"
      };
    case "TRIP_HEADSIGN":
      return {
        id: "tripHeadsignHeader",
        name: "Headsign"
      };
    case "TRIP_ID":
      return {
        id: "tripIdHeader",
        name: "Trip ID"
      };
    case "TRIP_SHORT_NAME":
    default:
      return {
        id: "tripShortNameHeader",
        name: "Trip Short Name"
      };
  }
};

const createAdditionalColumnRowValue = (
  additionalColumn: AdditionalColumn,
  trip: TimetableTrip
): RowValue => {
  switch (additionalColumn) {
    case "NOTICES":
      return {
        value: trip.notices ? <Notice content={trip.notices} /> : ""
      };
    case "BLOCK_ID":
      return {
        value: trip.blockId
      };
    case "TRIP_HEADSIGN":
      return {
        value: trip.tripHeadsign ?? ""
      };
    case "TRIP_ID":
      return {
        value: trip.gtfsId
      };
    case "TRIP_SHORT_NAME":
    default:
      return {
        value: trip.tripShortName ?? ""
      };
  }
};

interface TimeTableProps {
  /** Direction of the route to show. Follows the format of the `direction_id` field of
   * the `trips.txt` GTFS file: `0` for one direction, `1` for the opposite direction
   */
  directionId: number;
  route: Route;
  /** Whether to show only timepoint stops in the timetable */
  timepointsOnly: boolean;
  /** An array of optional additional columns to be added at the beginning of each trip row. The
   * columns will be added in the order they are presented in the array
   */
  additionalColumns?: AdditionalColumn[];
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
}

const TimeTable = (props: TimeTableProps): JSX.Element => {
  const {
    additionalColumns,
    closedStops,
    directionId,
    errorOnStopSorting,
    includeDwellStops,
    route,
    timepointsOnly
  } = props;

  const { patterns } = route;

  let intl: IntlShape;

  try {
    intl = useIntl();
  } catch (error) {
    console.error(
      "Unable to localize time with useIntl. Wrap timetable component in an IntlProvider to control time localization."
    );
    return <span>Unable to localize time</span>;
  }

  const [allTrips, timepointStopIds] = useMemo(() => {
    const trips = patterns
      .filter(p => p.directionId === directionId)
      .flatMap(p => p.tripsForDate);

    const timepoints = determineTimepoints(trips);

    return [trips, timepoints];
  }, [patterns, directionId]);

  // Generate the master stop list to use for the header of the timetable
  // Also determine the first stop ID that is used by every trip, for trip sorting later
  // TODO: Build the graph once and memoize it, then filter final results for each option change
  const [masterStopList, commonStopId] = useMemo(() => {
    // TODO: investigate alternative data structures and architecture to simplify overall logic
    const [stopGraph, tripStopSets, uniqueStopIdMap] = createStopGraph(
      allTrips
    );

    let sortedPatternStops: PatternStop[] = [];
    try {
      // Topologically sort the stop graph to determine a valid order of stops for the entire timetable
      // The toposort function is technically able to take objects as nodes in the graph, but it treats "identical"
      // objects (ones with the same keys and values) as not identical, so we need to use a map that links unique
      // stop ID strings to the actual stop objects they represent
      const sortedStopIds = toposort(stopGraph);
      sortedPatternStops = sortedStopIds.map(
        stopId =>
          uniqueStopIdMap.get(stopId) ?? {
            id: "",
            name: "",
            occurrenceIndex: 0
          }
      );
    } catch (error) {
      console.warn("error topologically sorting stop graph", error);
      if (!errorOnStopSorting) {
        sortedPatternStops = naiveSortStops(allTrips);
      }
    }

    let stopIdUsedInEveryTrip: string | undefined;

    for (let i = 0; i < sortedPatternStops.length; i++) {
      const stopId = sortedPatternStops[i].id;
      const inAllTrips = tripStopSets.every(trip => trip.has(stopId));
      if (inAllTrips) {
        stopIdUsedInEveryTrip = stopId;
        break;
      }
    }

    return [sortedPatternStops, stopIdUsedInEveryTrip];
  }, [allTrips]);

  const comparator = useMemo(() => {
    if (commonStopId) {
      // Sort by arrival time at common stop
      return (a: TimetableTrip, b: TimetableTrip) => {
        const timeA =
          a.stops.get(commonStopId)?.[0].scheduledArrival || new Date();
        const timeB =
          b.stops.get(commonStopId)?.[0].scheduledArrival || new Date();
        return timeA.valueOf() - timeB.valueOf();
      };
    }
    // Sort by first stop time in trip
    // TODO: add other sort methods
    return (a: TimetableTrip, b: TimetableTrip) =>
      a.firstStopTime - b.firstStopTime;
  }, [commonStopId]);

  const filteredMasterStopList = useMemo(
    () =>
      masterStopList.filter(s =>
        timepointsOnly ? timepointStopIds.has(s.id) : true
      ),
    [timepointsOnly, masterStopList, timepointStopIds]
  );

  const timetableTrips: TimetableTrip[] = useMemo<TimetableTrip[]>(() => {
    return allTrips
      .map<TimetableTrip>(t => {
        const firstStop = t.stoptimesForDate[0];
        const stopsMap = new Map<string, Stoptime[]>();
        t.stoptimesForDate.forEach(st => {
          const stopId = st.stop.gtfsId;
          stopsMap.set(stopId, (stopsMap.get(stopId) || []).concat(st));
        });
        return {
          blockId: t.blockId,
          firstStopTime: firstStop.serviceDay + firstStop.scheduledArrival,
          gtfsId: t.gtfsId,
          stops: stopsMap,
          notices: t.notices?.length ? t.notices.map(n => n.text) : undefined,
          tripHeadsign: t.tripHeadsign,
          tripShortName: t.tripShortName
        };
      })
      .sort(comparator);
  }, [allTrips, comparator]);

  const leadingColumns: LeadingColumnHeader[] = useMemo(() => {
    return (additionalColumns || []).map(createAdditionalColumnHeader);
  }, [additionalColumns]);

  return (
    <Table className="timetable-table" tabIndex={0}>
      <thead className="timetable-thead">
        <tr>
          {leadingColumns.concat(filteredMasterStopList).map((s, index) => {
            return (
              <TH
                className={`timetable-th${
                  s.className ? ` ${s.className}` : ""
                }`}
                key={`${s.id}-${index}`}
                scope="col"
                closed={closedStops && closedStops.has(s.id)}
              >
                <InvisibleText>{s.ariaLabel}</InvisibleText>
                {s.name}
              </TH>
            );
          })}
        </tr>
      </thead>
      <TBody className="timetable-tbody">
        {timetableTrips.map((t, index) => {
          // TODO: row values can be built outside of the render cycle and memoized
          const rowValues: RowValue[] = (additionalColumns || []).map(ac =>
            createAdditionalColumnRowValue(ac, t)
          );

          filteredMasterStopList.forEach(stop => {
            const stoptimes = t.stops.get(stop.id);
            // If this stop is visited multiple times in this trip, grab
            // the relevant stoptime value for this occurrence
            const stoptime = stoptimes?.[stop.occurrenceIndex];
            const dwellStop =
              includeDwellStops &&
              stoptime &&
              stoptime.scheduledArrival !== stoptime.scheduledDeparture;
            rowValues.push({
              closed: closedStops?.has(stop.id) || false,
              value: formatStoptimeForDisplay(intl, stoptime, dwellStop)
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
