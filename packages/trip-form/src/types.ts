import { ReactNode } from "react";

/**
 * Describes the parameters for the onQueryParamChange event.
 */
export interface QueryParamChangeEvent {
  [key: string]: string | number | boolean;
}

/**
 * Describes the text/value pair for each query parameter option.
 */
export interface QueryParamOptions {
  text: string;
  value: SVGForeignObjectElement;
}

/**
 * Describes a configured/supported travel mode provider.
 */
// FIXME: merge with TripOptions ModeOption.
export type ModeOption =
  | string
  | {
      company?: string;
      image?: string;
      hidden?: boolean;
      label: string;
      mode: string;
      url?: string;
    };

/**
 * Describes the travel modes available for the GeneralSettings component.
 */
export interface ConfiguredModes {
  accessModes?: ModeOption[];
  bicycleModes?: ModeOption[];
  exclusiveModes?: ModeOption[];
  micromobilityModes?: ModeOption[];
  transitModes?: ModeOption[];
}

/**
 * Mode/SubmodeSelector options
 */
// FIXME: merge with TripOptions ModeOption.
export interface ModeSelectorOption {
  id: string;
  selected?: boolean;
  showTitle?: boolean;
  text: ReactNode;
  title?: string;
}
