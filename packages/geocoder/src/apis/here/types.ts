export interface HereResponse {
  items: Item[];
}

export type Rect = {
  maxLat: number;
  maxLon: number;
  minLat: number;
  minLon: number;
};

export type Boundary = {
  country: string;
  rect: Rect;
};

export interface Item {
  access: Position[];
  address: Address;
  categories: Category[];
  distance: number;
  foodTypes: Category[];
  id: string;
  position: Position;
  resultType: string;
  scoring: Scoring;
  title: string;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface Address {
  city: string;
  countryCode: string;
  countryName: string;
  county: string;
  district: string;
  houseNumber: string;
  label: string;
  postalCode: string;
  state: string;
  stateCode: string;
  street: string;
}

export interface Category {
  id: string;
  name: string;
  primary?: boolean;
}

export interface Scoring {
  fieldScore: FieldScore;
  queryScore: number;
}

export interface FieldScore {
  district: number;
  placeName: number;
}
