import React from "react";

import StandardLegIcon from "../standard-leg-icon";

import LegIconRenderer from "./leg-icon-renderer";

export default {
  title: "Icons/StandardLegIcon",
  component: StandardLegIcon
};

export const StandardLegIconExamples = () => {
  return <LegIconRenderer component={StandardLegIcon} />;
};
