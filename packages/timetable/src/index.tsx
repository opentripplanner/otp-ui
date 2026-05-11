import React, { ReactElement } from "react";
import styled from "styled-components";

const COLUMN_WIDTH = "3rem";

interface TimeTableRowProps {
  values: string[];
}

export interface Stop {
  id?: string;
  name?: string;
  sequence: number;
  time?: string;
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

  return (
    <>
      <RowContainer>
        {stops
          .sort((a, b) => a.sequence - b.sequence)
          .map(s => (
            <CellContainer key={s.sequence}>
              <span style={{ fontWeight: "bold" }}>{s.name}</span>
            </CellContainer>
          ))}
      </RowContainer>
      <div>
        {trips
          .sort((a, b) => a.sequence - b.sequence)
          .map(t => (
            <TimeTableRow
              key={t.id}
              values={t.stops
                .sort((a, b) => a.sequence - b.sequence)
                .map(s => s.time ?? "-")}
            />
          ))}
      </div>
    </>
  );
};

export { TimeTable, TimeTableRow };
