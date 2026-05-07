import React, { ReactElement } from "react";
import styled from "styled-components";

interface TimeTableRowProps {
  trip: Trip;
}

export interface Stop {
  id: string;
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
  width: 3rem;
`;

// TODO: make highlight color customizable
// TODO: deal with "active" and "focus" states?
const RowContainer = styled.div`
  display: flex;

  &:hover {
    background: hsla(163, 100%, 74%, 1);
  }
`;

const TimeTableCell = (props: { text?: string }): ReactElement => {
  const { text } = props;

  return (
    <CellContainer>
      <span>{text ?? "-"}</span>
    </CellContainer>
  );
};

const TimeTableRow = (props: TimeTableRowProps): ReactElement => {
  const { trip } = props;

  return (
    <div>
      <RowContainer>
        {trip.stops
          .sort((a, b) => a.sequence - b.sequence)
          .map(s => (
            <TimeTableCell key={s.id} text={s.time} />
          ))}
      </RowContainer>
    </div>
  );
};

export default TimeTableRow;
