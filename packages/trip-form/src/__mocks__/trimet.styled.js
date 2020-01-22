import styled, { css } from "styled-components";
import * as Core from "..";
import * as TripFormClasses from "../styled";

import "./trimet-mock.css"; // For the font.

export const Ambient = styled.div`
  font-family: Hind, sans-serif;
  font-size: 14px;
`;

export const SettingsHeader = styled.div`
  color: #333333;
  font-size: 18px;
  margin: 16px 0px;
`;

export const SettingsSection = styled.div`
  margin-bottom: 16px;
`;

const settingLabelCss = css`
  label {
    padding-top: 8px;
    color: #808080;
    font-weight: 100;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

/*
export const SettingLabel = styled.label`
  ${settingLabelCss}
`;

export const FloatingSettingLabel = styled(SettingLabel)`
  float: left;
  padding-top: 9px;
`;
*/

const modeButtonCss = css`
  ${TripFormClasses.ModeButtonButton} {
    border: 1px solid rgb(187, 187, 187);
    padding: 3px;
    border-radius: 3px;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    background: none;
    outline: none;

    &.active {
      border: 2px solid rgb(0, 0, 0);
      background-color: rgb(173, 216, 230);
      font-weight: 600;
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    }
  }
  ${TripFormClasses.ModeButtonTitle} {
    padding: 4px 0px 0px;
    font-size: 10px;
    line-height: 12px;
  }
`;

export const ModeButton = styled(Core.ModeButton)`
  ${modeButtonCss}
`;

export const DateTimeSelector = styled(Core.DateTimeSelector)`
  ${modeButtonCss}
  ${TripFormClasses.DateTimeRow} {
    margin: 15px 0px;
    input {
      padding: 6px 12px;
      text-align: center;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      border: 0;
      border-bottom: 1px solid #000;
    }
  }
`;

export const DropdownSelector = styled(Core.DropdownSelector)`
  > div {
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
  ${settingLabelCss}
  select {
    -webkit-appearance: none;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    margin-bottom: 15px;
    background: none;
    border-radius: 3px;
    padding: 6px 12px;
    border: 1px solid #ccc;
    height: 34px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    line-height: 1.42857;
    color: #555;
  }
`;

export const GeneralSettingsPanel = styled(Core.GeneralSettingsPanel)`
  ${settingLabelCss}
`;
