import styled from "styled-components";

export const ModeButtonContainer = styled.div`
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
`;

export const ModeButtonTitle = styled.div`
  font-size: 10px;
  padding: 4px;

  &.disabled {
    color: #ccc;
  }
`;

export const ModeButtonBtn = styled.button`
  border: 1px solid rgb(187, 187, 187);
  padding: 3px;
  border-radius: 3px;
  width: 100%;
  height: 100%;
  font-size: inherit;
  font-family: inherit;
  background: none;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;

  :hover {
    background-color: rgb(173, 216, 230);
  }

  &.active {
    border: 2px solid rgb(0, 0, 0);
    background-color: rgb(173, 216, 230);
  }
  svg,
  img {
    vertical-align: middle;
    max-width: 1.25em;
    margin: 0 0.25em;
    height: 1.25em;
  }
  &.disabled {
    cursor: default;
  }
  &.disabled svg {
    fill: #ccc;
  }
`;
