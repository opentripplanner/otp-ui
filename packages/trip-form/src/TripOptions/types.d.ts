export interface ModeOption {
  company?: string;
  image?: string;
  hidden?: boolean;
  label: string;
  mode: string;
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
  mode?: string;
  company?: string;
}

// FIXME: Move this to @opentripplanner/types added in https://github.com/opentripplanner/otp-ui/pull/281
export interface QueryProps {
  onQueryParamChange(paramsToUpdate: QueryParams): void;
  queryParams: QueryParams;
  supportedModes: Modes;
}
