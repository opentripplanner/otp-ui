import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import styled from "styled-components";
import toposort from "toposort";

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

const convertTripToPatternStops = (trip: Trip): PatternStop[] => {
  const patternStops: PatternStop[] = [];
  const stopOccurrenceCounter: Map<string, number> = new Map();
  trip.stoptimesForDate.forEach(st => {
    const stopId = st.stop.gtfsId;
    const occurrenceIndex = stopOccurrenceCounter.get(stopId) || 0;
    stopOccurrenceCounter.set(stopId, occurrenceIndex + 1);
    patternStops.push({
      id: stopId,
      name: st.stop.name,
      occurrenceIndex
    });
  });

  return patternStops;
};

/** Creates a Directed Acyclic Graph (DAG) of all the trips, of the format [stop, nextStop]. Also
 * returns an array of sets; each set contains all of the unique stop IDs visited by each trip
 */
const createStopGraph = (
  trips: Trip[]
): [[PatternStop, PatternStop][], Set<string>[]] => {
  const stopGraph: [PatternStop, PatternStop][] = [];
  const tripStopSets: Set<string>[] = [];
  trips.forEach(trip => {
    const patternStops = convertTripToPatternStops(trip);
    // Create a set to keep track of all the unique stop IDs visited in this trip
    const tripStopSet = new Set<string>();
    patternStops.forEach((patternStop, index) => {
      tripStopSet.add(patternStop.id);
      if (index !== patternStops.length - 1)
        stopGraph.push([patternStop, patternStops[index + 1]]);
    });
    tripStopSets.push(tripStopSet);
  });
  return [stopGraph, tripStopSets];
};

/** Creates a master stop order using a "naive" method. While all stops are guaranteed to be
 * represented, the order of stops is not guaranteed to be valid for all trips. This can result
 * in a timetable row with non-chronological stoptimes, and should only be used as a last resort
 * if the topological sort fails.
 */
const naiveSortStops = (trips: Trip[]): PatternStop[] => {
  const uniquePatternStops = new Set<string>();
  const sorted: PatternStop[] = [];
  trips.forEach(t => {
    const patternStops = convertTripToPatternStops(t);
    patternStops.forEach(pt => uniquePatternStops.add(JSON.stringify(pt)));
  });

  uniquePatternStops.forEach(patternStop =>
    sorted.push(JSON.parse(patternStop))
  );

  return sorted;
};

const localizeMsTime = (time: number, timeZone?: string) => {
  return new Date(time).toLocaleTimeString("en-us", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatStoptimeForDisplay = (
  stoptime?: Stoptime,
  intl?: IntlShape,
  dwellStop?: boolean,
  timeZone?: string
): string | JSX.Element => {
  if (!stoptime) return "-";
  const arrivalTimeMs =
    (stoptime.serviceDay + stoptime.scheduledArrival) * 1000;

  let arrivalString = intl
    ? intl.formatTime(arrivalTimeMs)
    : localizeMsTime(arrivalTimeMs, timeZone);

  let departureString = "";

  if (dwellStop) {
    arrivalString = `A: ${arrivalString}`;
    const departureTimeMs =
      (stoptime.serviceDay + stoptime.scheduledDeparture) * 1000;
    departureString = intl
      ? intl.formatTime(departureTimeMs)
      : localizeMsTime(departureTimeMs, timeZone);
    departureString = `D: ${departureString}`;
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
  /** Time zone in which to display stop times if component is not wrapped in an IntlProvider */
  timeZone?: string;
}

const TimeTable = (props: TimeTableProps): JSX.Element => {
  const {
    additionalColumns,
    closedStops,
    directionId,
    errorOnStopSorting,
    includeDwellStops,
    route,
    timepointsOnly,
    timeZone
  } = props;

  const { patterns } = route;

  let intl: IntlShape | undefined;

  try {
    intl = useIntl();
  } catch (error) {
    console.warn(
      "Unable to localize time with useIntl. Wrap timetable component in an IntlProvider to control time localization. Falling back to provided timeZone prop if provided, or locale time zone on this machine"
    );
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
  const [masterStopList, commonStopId] = useMemo(() => {
    const [stopGraph, tripStopSets] = createStopGraph(allTrips);

    let sorted: PatternStop[] = [];
    try {
      // Topologically sort the stop graph to determine a valid order of stops for the entire timetable
      // The toposort function is technically able to take objects as nodes in the graph, but it treats "identical"
      // objects (ones with the same keys and values) as not identical, so we need to stringify the node objects pre-sort
      const sortedStrings = toposort(
        stopGraph.map(s => [JSON.stringify(s[0]), JSON.stringify(s[1])])
      );
      sorted = sortedStrings.map(s => JSON.parse(s));
    } catch (error) {
      console.warn("error topologically sorting stop graph", error);
      if (!errorOnStopSorting) {
        sorted = naiveSortStops(allTrips);
      }
    }

    let stopIdUsedInEveryTrip: string | undefined;

    for (let i = 0; i < sorted.length; i++) {
      const stopId = sorted[i].id;
      const inAllTrips = tripStopSets.every(trip => trip.has(stopId));
      if (inAllTrips) {
        stopIdUsedInEveryTrip = stopId;
        break;
      }
    }

    return [sorted, stopIdUsedInEveryTrip];
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
                key={s.id + index}
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
              value: formatStoptimeForDisplay(
                stoptime,
                intl,
                dwellStop,
                timeZone
              )
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
