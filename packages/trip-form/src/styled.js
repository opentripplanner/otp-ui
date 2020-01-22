import styled from "styled-components";

// ////////////////////////////////////////////////
// /////////////// App components /////////////////
// ////////////////////////////////////////////////

export const SettingsHeader = styled.div``;

export const SettingsSection = styled.div``;

export const SettingLabel = styled.label``;

export const FloatingSettingLabel = styled(SettingLabel)`
  float: left;
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
  > * {
    box-sizing: border-box;
    width: 50%;
    padding: 0px 5px;
    display: inline-block;
  }
  input {
    box-sizing: border-box;
    width: 100%;
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
  font-size: 65%;

  &.disabled {
    color: #ccc;
  }
`;

export const ModeButtonButton = styled.button`
  cursor: pointer;
  width: 100%;
  height: 100%;

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
  }
  select {
    width: 100%;
    box-sizing: border-box;
  }
`;
