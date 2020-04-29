import React from "react";

import * as Companies from "./companies";
import * as TriMet from "./trimet";

/**
 * Icons for all TriMet mode choices.
 */
const triMetModeIcons = {
  BICYCLE: <TriMet.Bike />,
  BICYCLE_RENT: <Companies.Biketown />,
  BUS: <TriMet.Bus />,
  CAR: <TriMet.Car />,
  CAR_HAIL_LYFT: <Companies.Lyft />,
  CAR_HAIL_UBER: <Companies.Uber />,
  CAR_PARK: <TriMet.Car />,
  CAR_RENT_CAR2GO: <Companies.Car2go />,
  CAR_RENT_REACHNOW: <Companies.Reachnow />,
  GONDOLA: <TriMet.AerialTram />,
  MICROMOBILITY: <TriMet.Micromobility />,
  MICROMOBILITY_RENT: <TriMet.Micromobility />,
  RAIL: <TriMet.Wes />,
  STREETCAR: <TriMet.Streetcar />,
  TRAM: <TriMet.Max />,
  TRANSIT: <TriMet.TriMet />,
  WALK: <TriMet.Walk />
};

export default triMetModeIcons;
