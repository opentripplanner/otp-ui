import styled from "styled-components";
// eslint-disable-next-line prettier/prettier
import type {
  DateTimeSelectorAndSubComponents,
  ModeButtonAndSubComponents,
  ModeSelectorAndSubComponents,
  SubmodeSelectorAndSubComponents
} from "./types";

export const baseColor = () => getComputedStyle(document.documentElement).getPropertyValue(
  "--main-base-color"
)
export const SettingsHeader = styled.div``;

export const SettingsSection = styled.div``;

export const SettingLabel = styled.label`
  font-weight: normal;
  padding-left: 6px;
`;

export const FloatingSettingLabel = styled(SettingLabel)`
  float: left;
`;

export const DateTimeSelector: DateTimeSelectorAndSubComponents = styled.div<{ baseColor: string }>`
  border-radius: 5px;
  background: ${props => props.baseColor}1a;
  color: inherit;
  height: 45px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  input {
    border: 0px;
    height: 100%;
    width: 100%;
    background: transparent;
  }
`;

export const DepartArriveContainer = styled.div`
    span {
      float: none;
    }
`;

export const ModeSelector: ModeSelectorAndSubComponents = styled.div``;

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

export const SubmodeSelector: SubmodeSelectorAndSubComponents = styled(SettingsSection)``;

const submodeRow = styled.div``;
SubmodeSelector.Row = submodeRow;

SubmodeSelector.InlineRow = styled(submodeRow)`
  text-align: right;
`;

export const ModeButton: ModeButtonAndSubComponents = styled.div`
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

export const SliderSelector = styled.div`
  > div {
    align-items: center;
    box-sizing: border-box;
    display: inline-flex;
    gap: 10px;
    position: relative;
    width: 100%;

    > label {
      display: block;
      white-space: pre;
    }
  }
  input {
    box-sizing: border-box;
    cursor: pointer;
    width: 100%;
  }
`;

export const GeneralSettingsPanel = styled.div``;

export const SettingsSelectorPanel = styled.div``;