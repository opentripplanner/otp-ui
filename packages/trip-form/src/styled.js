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

export const ModeRow = styled.div`
  > * {
    width: 33.333333%;
    padding: 0px 5px;
  }
`;

export const MainModeRow = styled.div`
  padding: 0px 5px;
  box-sizing: border-box;
  > * {
    width: 100%;
  }
`;

export const SecondaryModeRow = styled(ModeRow)``;

export const TertiaryModeRow = styled(ModeRow)``;

export const SubmodeRow = styled.div``;

export const InlineSubmodeRow = styled(SubmodeRow)`
  text-align: right;
`;

// ////////////////////////////////////////////////
// ///////////// Generic components ///////////////
// ////////////////////////////////////////////////

export const ModeButton = styled.div`
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

export const DropdownSelector = styled.div`
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
