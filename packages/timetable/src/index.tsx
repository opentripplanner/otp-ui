import React, { ReactElement, useMemo, useState } from "react";
import styled from "styled-components";

const COLUMN_WIDTH = "4rem";

interface TimeTableRowProps {
  values: string[];
}

interface FilterableSequenceable {
  id: string;
  sequence: number;
}

export interface PatternStop extends FilterableSequenceable {
  name: string;
  timepoint: boolean;
}

export interface Trip extends FilterableSequenceable {
  blockId: string;
  stops: Map<string, Date>; // stop ID, stop time
}

const CellContainer = styled.div`
  display: flex;
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
    patternStops.forEach(s => {
      if (s.timepoint) ids.add(s.id);
    });
    return ids;
  }, [patternStops]);

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
            <span style={{ fontWeight: s.timepoint ? "bold" : "normal" }}>
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
              const time = t.stops.get(patternStop.id);
              rowValues.push(
                time
                  ? time.toLocaleTimeString("en-us", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit"
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
