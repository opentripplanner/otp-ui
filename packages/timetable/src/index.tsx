import React, { ReactElement, useCallback, useMemo, useState } from "react";
import styled from "styled-components";

const COLUMN_WIDTH = "4rem";

interface TimeTableRowProps {
  values: string[];
}

export interface Stop {
  id?: string;
  name?: string;
  sequence: number;
  time?: string;
  timepoint?: boolean;
}

export interface Trip {
  id: string;
  sequence: number;
  stops: Stop[];
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
  stops: Stop[];
  trips: Trip[];
}

const TimeTable = (props: TimeTableProps): ReactElement => {
  const { stops, trips } = props;

  const [expanded, setExpanded] = useState(false);

  const timepointStopIds: Set<string> = useMemo(() => {
    const ids = new Set<string>();
    stops.forEach(s => {
      if (s.id && s.timepoint) ids.add(s.id);
    });
    return ids;
  }, [stops]);

  const filterAndSortStops = useCallback(
    (stopArray: Stop[]) =>
      stopArray
        .filter(s => (expanded ? true : s.id && timepointStopIds.has(s.id)))
        .sort((a, b) => a.sequence - b.sequence),
    [expanded, timepointStopIds]
  );

  return (
    <>
      <button type="button" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show Timepoints Only" : "Show All Stops"}
      </button>
      <RowContainer>
        {filterAndSortStops(stops).map(s => (
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
          .map(t => (
            <TimeTableRow
              key={t.id}
              values={filterAndSortStops(t.stops).map(s => s.time ?? "-")}
            />
          ))}
      </div>
    </>
  );
};

export { TimeTable, TimeTableRow };
