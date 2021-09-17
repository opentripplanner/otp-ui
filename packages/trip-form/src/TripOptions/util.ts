import coreUtils from "@opentripplanner/core-utils";

import { Category, QueryParams } from "./types";

export function getNonTransitModes(modeString = "") {
  const modes = modeString?.split(",") || [];
  return modes.filter(m => !coreUtils.itinerary.isTransit(m));
}

export function accessModeIsWalkOnly(modeString = "") {
  const nonTransitModes = getNonTransitModes(modeString);
  return (
    nonTransitModes.length === 0 ||
    (nonTransitModes.length === 1 && nonTransitModes[0] === "WALK")
  );
}

export function getSelectedModes(queryParams: QueryParams) {
  return queryParams?.mode?.split(",") || [];
}

export const categoryIsActive = (
  category: Category,
  selectedModes: Array<string>
) => {
  if (category.mode) {
    return selectedModes.some(m => m === category.mode);
  }
  if (category.options) {
    let isActive = false;
    category.options.forEach(o => {
      if (selectedModes.some(m => m === o.mode)) {
        isActive = true;
      }
    });
    return isActive;
  }
  return false;
};

export function getCategoryModes(category: Category): string[] {
  return category.mode ? [category.mode] : category.options.map(o => o.mode);
}

export function getCategoryPrimaryMode(category: Category): string {
  return getCategoryModes(category)[0];
}
