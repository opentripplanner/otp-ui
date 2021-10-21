import styled from "styled-components";

export const SettingsHeader = styled.div``;

export const SettingsSection = styled.div``;

export const SettingLabel = styled.label``;

export const FloatingSettingLabel = styled(SettingLabel)`
  float: left;
`;

export const DateTimeSelector = styled.div``;

DateTimeSelector.DepartureRow = styled.div`
  box-sizing: border-box;
  > * {
    box-sizing: border-box;
    width: 33.333333%;
    padding: 0px 5px;
  }
`;

DateTimeSelector.DateTimeRow = styled.div`
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

export const ModeSelector = styled.div``;

ModeSelector.MainRow = styled.div`
  padding: 0px 5px;
  box-sizing: border-box;
  > * {
    width: 100%;
  }
`;

ModeSelector.SecondaryRow = styled.div`
  > * {
    width: 33.333333%;
    padding: 0px 5px;
  }
`;

ModeSelector.TertiaryRow = styled.div`
  > * {
    width: 33.333333%;
    padding: 0px 5px;
  }
`;

export const SubmodeSelector = styled(SettingsSection)``;

SubmodeSelector.Row = styled.div``;

SubmodeSelector.InlineRow = styled(SubmodeSelector.Row)`
  text-align: right;
`;

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

ModeButton.Title = styled.div`
  font-size: 70%;
  &.disabled {
    color: #686868;
  }
`;

ModeButton.Button = styled.button`
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
  &.active {
    font-weight: 600;
    box-shadow: 0 0 2px 2px rgba(0, 64, 255, 0.5);
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
    cursor: pointer;
  }
`;

export const GeneralSettingsPanel = styled.div``;

export const SettingsSelectorPanel = styled.div``;
