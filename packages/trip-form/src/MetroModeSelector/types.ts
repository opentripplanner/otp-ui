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
