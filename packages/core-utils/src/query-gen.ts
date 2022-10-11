import gql from "graphql-tag";
import { DocumentNode } from "graphql/language/ast";

type LonLat = {
  lon: number;
  lat: number;
};

type OTPQueryParams = {
  to: LonLat;
  from: LonLat;
  combinations: Array<unknown>;
  walkReluctance: number;
  bikeReluctance: number;
  walkSpeed: number;
  bikeSpeed: number;
  optimize: string;
  allowBikeRental: number;
  maxTransfers: number;
  minTransferTime: number;
};

// eslint-disable-next-line import/prefer-default-export, @typescript-eslint/no-unused-vars
export function generateOtpQueries(params: OTPQueryParams): DocumentNode[] {
  // const allCombinations = params.combinations.reduce(
  //   (prev, cur) => [...prev],
  //   []
  // );
  const query = gql`
    fasdf
  `;
  return [query];
}
