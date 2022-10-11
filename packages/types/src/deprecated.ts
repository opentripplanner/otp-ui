export type ModeOption = {
  id: string;
  selected?: boolean;
  showTitle?: boolean;
  text: JSX.Element;
  title?: string;
};

export type ModeSelectorOptions = {
  primary: ModeOption;
  secondary?: ModeOption[];
  tertiary?: ModeOption[];
};

export type ConfiguredMode =
  | string
  | {
      mode: string;
      label: string;
      company?: string;
    };

export type ConfiguredModes = {
  transitModes: ConfiguredMode[];
  accessModes: ConfiguredMode[];
  exlcusiveModes: ConfiguredMode[];
  bicycleModes: ConfiguredMode[];
  micromobilityModes: ConfiguredMode[];
};

export type ConfiguredCompany = {
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
};
