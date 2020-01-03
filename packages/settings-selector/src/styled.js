import styled from "styled-components";

export const ModeIconWrap = styled.div`
  width: 100px;
  svg {
    width: 100%;
  }
`;

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
  text-align: center;
  > * {
    height: 48px;
  }
`;

/* This one must appear before the stuff in ModeButtonBtn (no-descending-specificity) */
export const SubmodeRow = styled(ModeRow)`
  > * {
    width: inherit;
    padding: 3px 5px 3px 0;
  }
  button {
    padding: 6px 12px;
  }
  svg {
    margin-left: 0px;
  }
`;

/**
    > * {
    width: inherit;
    padding: 3px 5px 3px 0;
  }
  button {
    padding: 6px 12px;
  }
  svg {
    margin-left: 0px;
  }

 */

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
    margin: 0 0.25em;
  }
  &.disabled {
    cursor: default;
  }
  &.disabled svg {
    fill: #ccc;
  }
`;
