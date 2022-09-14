import { StyledIcon } from "@styled-icons/styled-icon";

export enum ModeSettingTypes {
  SLIDER,
  CHECKBOX,
  DROPDOWN
}

export interface DropdownOptions {
  label: string;
  options: Array<{
    text: string;
    value: number;
  }>;
}

export interface SliderOptions {
  low: number;
  high: number;
  step: number;
  label: string;
  labelLow: string;
  labelHigh: string;
}

export interface CheckboxOptions {
  label: string;
  icon: JSX.Element;
}

export type ModeSetting = {
  type: ModeSettingTypes;
  configuration: SliderOptions | CheckboxOptions | DropdownOptions;
};

export interface OTPMode {
  mode: string;
  settings: ModeSetting[];
}

export interface Combination {
  modes: OTPMode[];
  label: string;
  Icon: StyledIcon;
  modeSettings?: ModeSetting[];
}
