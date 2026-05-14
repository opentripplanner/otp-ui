import React, { ReactElement, useMemo, useState } from "react";
import styled from "styled-components";

const COLUMN_WIDTH = "85px";

interface TimeTableRowProps {
  values: string[];
}

interface FilterableSequenceable {
  id: string;
  sequence: number;
}

export interface PatternStop extends FilterableSequenceable {
  name: string;
}

export interface Trip extends FilterableSequenceable {
  blockId: string;
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

export interface TimeTableProps {
  patternStops: PatternStop[];
  trips: Trip[];
  showBlockId?: boolean;
}

const TimeTable = (props: TimeTableProps): ReactElement => {
  const { patternStops, trips, showBlockId } = props;

  const [expanded, setExpanded] = useState(false);

  const timepointStopIds: Set<string> = useMemo(() => {
    const ids = new Set<string>();
    // timepoints are tied to stops on individual trips, so we need to
    // loop through all trip stops to find all timepoints
    trips.forEach(trip => {
      trip.stops.forEach((stopDetail, stopId) => {
        if (stopDetail.timepoint) ids.add(stopId);
      });
    });
    return ids;
  }, [trips]);

  const filteredAndSortedPatternStops = useMemo(
    () =>
      patternStops
        .filter(s => (expanded ? true : timepointStopIds.has(s.id)))
        .sort((a, b) => a.sequence - b.sequence),
    [expanded, patternStops, timepointStopIds]
  );

  return (
    <>
      <button type="button" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show Timepoints Only" : "Show All Stops"}
      </button>
      <RowContainer>
        {showBlockId ? <CellContainer>Block ID</CellContainer> : <div />}
        {filteredAndSortedPatternStops.map(s => (
          <CellContainer key={s.sequence}>
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
        {trips
          .sort((a, b) => a.sequence - b.sequence)
          .map(t => {
            const rowValues = showBlockId ? [t.blockId] : [];
            filteredAndSortedPatternStops.forEach(patternStop => {
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

            return <TimeTableRow key={t.id} values={rowValues} />;
          })}
      </div>
    </>
  );
};

export { TimeTable, TimeTableRow };
