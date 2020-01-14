import styled from "styled-components";

export const SubmodeRow = styled.div`
  font-size: 12px;
  > * {
    width: inherit;
    padding: 3px 5px 3px 0px;
  }
  > :last-child {
    padding-right: 0px;
  }
  button {
    padding: 6px 12px;
  }
  svg,
  img {
    margin-left: 0px;
  }
`;

export const InlineSubmodeRow = styled(SubmodeRow)`
  text-align: right;
  margin: -3px 0px;
`;
