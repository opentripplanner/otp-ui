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

  // used to extract stop names more efficiently later
  const separator = "***";

  // can probably combine into one big memoized value:

  const allTrips = useMemo(() => {
    const trips = patterns
      .filter(p => p.directionId === directionId)
      .flatMap(p => p.tripsForDate);

    if (!includeDwellStops) return trips;

    const result: Trip[] = [];
    trips.forEach(trip => {
      const updatedStopTimes: Stoptime[] = [];
      trip.stoptimesForDate.forEach(st => {
        if (st.scheduledArrival === st.scheduledDeparture) {
          updatedStopTimes.push(st);
          return;
        }
        const arrivalStopTime: Stoptime = {
          ...st,
          scheduledDeparture: st.scheduledArrival
        };
        const departureStopTime: Stoptime = {
          ...st,
          scheduledArrival: st.scheduledDeparture,
          stop: {
            ...st.stop,
            gtfsId: `${st.stop.gtfsId}:dwell`
          }
        };
        updatedStopTimes.push(arrivalStopTime);
        updatedStopTimes.push(departureStopTime);
      });
      result.push({
        blockId: trip.blockId,
        stoptimesForDate: updatedStopTimes
      });
    });
    return result;
  }, [patterns, directionId, includeDwellStops]);

  const { patternStops, tripStopSets } = useMemo(() => {
    // array of sets; each set contains all of the stop IDs that are visited in a trip
    // used for determining a common stop to use for sorting trips
    const sets: Set<string>[] = [];
    const stopGraph: [string, string][] = [];
    allTrips.forEach(trip => {
      const stopIds = trip.stoptimesForDate.map(
        st => `${st.stop.gtfsId}${separator}${st.stop.name}`
      );
      sets.push(
        // got to be a way to not reiterate through...separator is suspect
        new Set(trip.stoptimesForDate.map(st => st.stop.gtfsId))
      );
      stopIds.forEach((stopId, index) => {
        if (index !== stopIds.length - 1)
          stopGraph.push([stopId, stopIds[index + 1]]);
      });
    });

    // handle sorting failure
    const sorted = toposort(stopGraph);

    const patternStopsFromSorted: PatternStop[] = sorted.map(stop => {
      const [gtfsId, name] = stop.split(separator);
      return {
        id: gtfsId,
        name
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

  const [expanded, setExpanded] = useState(false);

  const timepointStopIds: Set<string> = useMemo(() => {
    const ids = new Set<string>();
    // timepoints are tied to stops on individual trips, so we need to
    // loop through all trip stops to find all timepoints
    allTrips.forEach(trip => {
      trip.stoptimesForDate.forEach(st => {
        if (st.timepoint) ids.add(st.stop.gtfsId);
      });
    });
    return ids;
  }, [allTrips]);

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
