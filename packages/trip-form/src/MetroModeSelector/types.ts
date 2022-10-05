import { StyledIcon } from "@styled-icons/styled-icon";

export enum ModeSettingTypes {
  SLIDER = "SLIDER",
  CHECKBOX = "CHECKBOX",
  DROPDOWN = "DROPDOWN"
}

export interface DropdownOptions {
  label: string;
  options: Array<{
    text: string;
    value: number;
  }>;
  type: ModeSettingTypes.DROPDOWN;
  value?: string;
  default?: string;
}

export interface SliderOptions {
  low: number;
  high: number;
  step: number;
  label: string;
  labelLow: string;
  labelHigh: string;
  type: ModeSettingTypes.SLIDER;
  value?: number;
  default?: number;
}

export interface CheckboxOptions {
  label: string;
  icon: JSX.Element;
  type: ModeSettingTypes.CHECKBOX;
  value?: boolean;
  default?: boolean;
}

export interface ModeSettingBase {
  applicableMode: string;
  key: string;
}

export type ModeSetting = (CheckboxOptions | SliderOptions | DropdownOptions) &
  ModeSettingBase;
export type ModeSettingValues = Record<string, number | string | boolean>;

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
