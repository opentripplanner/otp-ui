export interface ModeOption {
  company?: string;
  image?: string;
  hidden?: boolean;
  label: string;
  mode: string;
  url?: string;
}

export interface Category {
  description?: string;
  image?: string;
  label: string;
  mode?: string;
  options: ModeOption[];
  type: string;
}

export interface Modes {
  categories: Category[];
  transitModes: ModeOption[];
}

export interface Company {
  id: string;
  label: string;
  modes: string;
}

// FIXME: Move this to @opentripplanner/types added in https://github.com/opentripplanner/otp-ui/pull/281
export interface QueryParams {
  /**
   * The mode string query param (e.g., TRANSIT,WALK).
   */
  mode?: string;
  /**
   * The company query param used to specify service providers for a rental or
   * hail mode type (e.g., UBER or HOPR).
   */
  company?: string;
  /**
   * FIXME: other query params exist but are not populated here.
   */
}

// FIXME: Move this to @opentripplanner/types added in https://github.com/opentripplanner/otp-ui/pull/281
export interface QueryProps {
  /**
   * Function to execute when query parameters change
   */
  onQueryParamChange(paramsToUpdate: QueryParams): void;
  /**
   * Query params currently set for the active trip plan query.
   */
  queryParams: QueryParams;
  /**
   * The available modes configured for the user to select.
   */
  supportedModes: Modes;
}
