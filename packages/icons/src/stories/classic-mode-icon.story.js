import React from "react";

import ClassicModeIcon from "../classic-mode-icon";

import ModeIconRenderer from "./mode-icon-renderer";
import CustomModeIconRenderer from "./custom-mode-icon-renderer";

export default {
  title: "Icons/ClassicModeIcon",
  component: ClassicModeIcon
};

export const ClassicModeIconExamples = () => (
  <ModeIconRenderer component={ClassicModeIcon} />
);

export const ModeIconOverrideByRouteId = CustomModeIconRenderer;
