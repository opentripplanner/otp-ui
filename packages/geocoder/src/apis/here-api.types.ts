export interface HereResponse {
  items: Item[];
}

export interface Item {
  title: string;
  id: string;
  resultType: string;
  address: Address;
  position: Position;
  access: Position[];
  distance: number;
  categories: Category[];
  foodTypes: Category[];
  scoring: Scoring;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface Address {
  label: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  state: string;
  county: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  houseNumber: string;
}

export interface Category {
  id: string;
  name: string;
  primary?: boolean;
}

export interface Scoring {
  queryScore: number;
  fieldScore: FieldScore;
}

export interface FieldScore {
  district: number;
  placeName: number;
}
