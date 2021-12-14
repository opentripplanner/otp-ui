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
export type ConfiguredMode =
  | string
  | {
      company: string;
      label: string;
      mode: string;
    };

/**
 * Describes the travel modes available for the GeneralSettings component.
 */
export interface ConfiguredModes {
  transitModes?: ConfiguredMode[];
  accessModes?: ConfiguredMode[];
  exclusiveModes?: ConfiguredMode[];
  bicycleModes?: ConfiguredMode[];
  micromobilityModes?: ConfiguredMode[];
}
