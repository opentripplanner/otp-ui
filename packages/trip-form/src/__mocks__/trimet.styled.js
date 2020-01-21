import styled from "styled-components";
import ModeButton from "../ModeButton";
import DateTimeSelector from "../DateTimeSelector";
import * as TripFormClasses from "../styled";

import "./trimet-mock.css"; // For the font.

export const Ambient = styled.div`
  font-family: Hind, sans-serif;
  font-size: 14px;
`;

export const ModeButtonControl = styled(ModeButton)`
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

export const DateTimeSelectorControl = styled(DateTimeSelector)`
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
