import React from "react";

import * as TriMet from "./trimet";

/**
 * Icons for all TriMet modes.
 * Any hail and rental modes managed by one or multiple companies
 * are optional but can be overriden here using the
 * pattern <OTP_MODE>_<COMPANY_ID> (e.g. 'CAR_HAIL_UBER').
 */
const triMetModeIcons = {
  BICYCLE: <TriMet.Bike />,
  BUS: <TriMet.Bus />,
  CAR: <TriMet.Car />,
  CAR_PARK: <TriMet.Car />,
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
