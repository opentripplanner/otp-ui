import styled from "styled-components";

// ////////////////////////////////////////////////
// /////////////// App components /////////////////
// ////////////////////////////////////////////////

export const SettingsHeader = styled.div`
  color: #333333;
  font-size: 18px;
  margin: 16px 0px;
`;

export const SettingsSection = styled.div`
  margin-bottom: 16px;
`;

export const SettingLabel = styled.label`
  padding-top: 8px;
  color: #808080;
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const FloatingSettingLabel = styled(SettingLabel)`
  float: left;
  padding-top: 9px;
`;

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

const ModeRow = styled.div`
  margin-bottom: 10px;
  > * {
    width: 33.333333%;
    padding: 0px 5px;
  }
`;

export const MainModeRow = styled.div`
  padding: 0px 5px;
  font-size: 200%;
  margin-bottom: 18px;
  box-sizing: border-box;
  > * {
    width: 100%;
    height: 55px;
  }
`;

export const SecondaryModeRow = styled(ModeRow)`
  > * {
    font-size: 150%;
    height: 46px;
  }
`;

export const TertiaryModeRow = styled(ModeRow)`
  font-size: 90%;
  text-align: center;
  > * {
    height: 36px;
  }
`;

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

// ////////////////////////////////////////////////
// ///////////// Generic components ///////////////
// ////////////////////////////////////////////////

export const ModeButtonContainer = styled.div`
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  > * {
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const ModeButtonTitle = styled.div`
  font-size: 10px;
  line-height: 12px;
  padding: 4px 0px 0px;

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
  font-weight: inherit;
  background: none;
  outline: none;
  cursor: pointer;

  &.active {
    border: 2px solid rgb(0, 0, 0);
    background-color: rgb(173, 216, 230);
    font-weight: 600;
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
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

export const DropdownSelectorWrap = styled.div`
  > div {
    width: 50%;
    display: inline-block;
    box-sizing: border-box;
    position: relative;

    :last-child::after {
      content: "▼";
      font-size: 75%;
      color: #000;
      right: 8px;
      top: 10px;
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
    }
  }
  select {
    width: 100%;
    box-sizing: border-box;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    margin-bottom: 15px;
  }
`;

export const SelectCtrl = styled.select`
  -webkit-appearance: none;
  background: none;
  border-radius: 3px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  height: 34px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.42857;
  color: #555;
`;
