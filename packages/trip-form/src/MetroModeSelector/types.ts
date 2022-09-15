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
  configuration: SliderOptions | CheckboxOptions | DropdownOptions;
  value?: string | number;
  key: string;
  type: ModeSettingTypes;
};

export type ModeSettingValues = Record<string, number | string>;

/**
 * Transportation mode is usually an OTP mode string,
 * but it can be anything for more flexibility.
 */
export interface TransportationMode {
  mode: string;
  settings?: ModeSetting[];
}

/**
 * This is a combination of transportation modes,
 * with a label to describe them. These are designed
 * to appear in the mode selector as discrete options.
 */
export interface Combination {
  modes: TransportationMode[];
  enabled?: boolean;
  label: string;
  key: string;
  Icon: StyledIcon;
  modeSettings?: ModeSetting[];
}
