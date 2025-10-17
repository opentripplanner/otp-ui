import styled from "styled-components";

/* eslint-disable-next-line import/prefer-default-export */
export const ViewStopButton = styled.button<{ stopId?: string }>`
  background: none;
  border-bottom: none;
  ${props =>
    props.stopId
      ? "border-left: 1px solid #000; margin-left: 5px;"
      : "border-left: none; padding-left: 0;"};
  border-right: none;
  border-top: none;
  color: #008;
  font-family: inherit;
  padding-top: 0;
`;
