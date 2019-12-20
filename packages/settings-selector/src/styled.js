import styled from "styled-components";

export const ModeButtonContainer = styled.div`
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
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
  svg {
    vertical-align: middle;
    width: 1.25em;
    margin: 0 5px;
  }
  &.disabled {
    cursor: default;
  }
  &.disabled svg {
    fill: #ccc;
  }
`;

export const ModeButtonTitle = styled.div`
  font-size: 10px;
  padding: 4px;

  &.disabled {
    color: #ccc;
  }
`;

const ModeRow = styled.div`
  margin-bottom: 10px;
  > * {
    width: 33.333333%;
    padding: 5px;
    box-sizing: border-box;
  }
`;

export const MainModeRow = styled.div`
  padding: 5px;
  font-size: 200%;
  margin-bottom: 10px;
  box-sizing: border-box;
  > * {
    width: 100%;
    height: 55px;
  }
`;

export const SecondaryModeRow = styled(ModeRow)`
  font-size: 150%;
  > * {
    height: 58px;
  }
`;

export const TertiaryModeRow = styled(ModeRow)`
  font-size: 90%;
  > * {
    height: 48px;
  }
`;
