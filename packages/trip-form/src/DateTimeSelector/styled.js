import styled from "styled-components";

export const DepartureRow = styled.div`
  box-sizing: border-box;
  > * {
    box-sizing: border-box;
    width: 33.333333%;
    padding: 0px 5px;
  }
`;

export const DateTimeRow = styled.div`
  box-sizing: border-box;
  margin: 15px 0px;
  > * {
    box-sizing: border-box;
    width: 50%;
    padding: 0px 5px;
    display: inline-block;
  }
  input {
    box-sizing: border-box;
    padding: 6px 12px;
    width: 100%;
    text-align: center;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    border: 0;
    border-bottom: 1px solid #000;
  }
`;
