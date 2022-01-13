import styled from "styled-components";

export const LocationPickerSpan = styled.span`
  :first-of-type {
    border-left: none;
  }
`;

export const FromToPickerSpan = styled.span`
  > * {
    padding-left: 0.4em;
    border-left: 1px solid black;
  }
`;

export const Button = styled.button`
  background: none;
  border: none;
  color: navy;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding-left: 0.2em;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
