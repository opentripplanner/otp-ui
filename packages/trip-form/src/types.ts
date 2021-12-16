import { ReactNode } from "react";
import { StyledComponent } from "styled-components";

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
 * Describes full details of a configured/supported travel mode provider.
 */
// FIXME: merge with TripOptions ModeOption.
export interface FullModeOption {
  company?: string;
  image?: string;
  hidden?: boolean;
  label: string;
  mode: string;
  url?: string;
}

/**
 * Describes a configured/supported travel mode provider.
 */
// FIXME: merge with TripOptions ModeOption.
export type ModeOption = string | FullModeOption;

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
 * Describes a supported transportation company.
 */
export interface ConfiguredCompany {
  /**
   * The id of the company. This is typically in all-caps.
   */
  id: string;
  /**
   * A human readable text value that can be displayed to users.
   */
  label: string;
  /**
   * A comma-separated list of applicable modes of travel that the company
   * offers.
   */
  modes: string;
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

/**
 * Describes the set of options passed to the ModeSelector component.
 */
export interface ModeSelectorOptionSet {
  primary?: ModeSelectorOption;
  secondary?: ModeSelectorOption[];
  tertiary?: ModeSelectorOption[];
}

type SimpleStyledDiv = StyledComponent<"div", any>;

export type DateTimeSelectorAndSubComponents = SimpleStyledDiv & {
  DateTimeRow?: SimpleStyledDiv;
  DepartureRow?: SimpleStyledDiv;
};

export type ModeSelectorAndSubComponents = SimpleStyledDiv & {
  MainRow?: SimpleStyledDiv;
  SecondaryRow?: SimpleStyledDiv;
  TertiaryRow?: SimpleStyledDiv;
};

export type SubmodeSelectorAndSubComponents = SimpleStyledDiv & {
  InlineRow?: SimpleStyledDiv;
  Row?: SimpleStyledDiv;
};

export type ModeButtonAndSubComponents = SimpleStyledDiv & {
  Button?: StyledComponent<"button", any>;
  Title?: SimpleStyledDiv;
};
