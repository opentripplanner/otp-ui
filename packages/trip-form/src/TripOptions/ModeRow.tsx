import coreUtils from "@opentripplanner/core-utils";
import React from "react";

import {
  categoryIsActive,
  getCategoryPrimaryMode,
  getSelectedModes
} from "./util";
import { Modes, QueryParams } from "./types";
import * as S from "./styled";

import Checkbox from "./Checkbox";

const ModeRow = ({
  onQueryParamChange,
  queryParams,
  queryParamOverrides,
  supportedModes,
  SimpleModeIcon
}: {
  onQueryParamChange(paramsToUpdate: QueryParams, categoryLabel?: string): void;
  queryParams: QueryParams;
  queryParamOverrides: { [key: string]: QueryParams };
  supportedModes: Modes;
  SimpleModeIcon?: React.FunctionComponent<{ mode: string }>;
}): React.ReactElement => {
  const { categories } = supportedModes;
  const selectedModes = getSelectedModes(queryParams);
  const selectedTransit = selectedModes.filter(coreUtils.itinerary.isTransit);
  const hasTransit = selectedTransit.length > 0;
  const selectedTransitString = selectedTransit.join(",") || "TRANSIT";

  return (
    <S.ScrollableRow hideScrollbars={false}>
      <Checkbox
        aria-checked={hasTransit}
        ariaLabel="Go by Transit"
        checked={hasTransit}
        // Prettier conflicts with jsx style rules
        // eslint-disable-next-line prettier/prettier
        onClick={() => onQueryParamChange({ companies: "", mode: `${selectedTransitString},WALK` })}
        selected={hasTransit}
        SimpleModeIcon={SimpleModeIcon}
      >
        Go by Transit
      </Checkbox>
      {categories.map(category => {
        const selectedModeAndCategoryActive = categoryIsActive(
          category,
          selectedModes
        );
        const isChecked = hasTransit
          ? category.type === "access" && selectedModeAndCategoryActive
          : category.type === "exclusive" && selectedModeAndCategoryActive;

        const onChangeMode = () => {
          // Use override query if present
          if (queryParamOverrides && queryParamOverrides[category.label]) {
            onQueryParamChange(
              queryParamOverrides[category.label],
              category.label
            );
            return;
          }

          let mode = getCategoryPrimaryMode(category);
          const companies =
            typeof category.mode === "undefined"
              ? ""
              : category.options?.map(o => o.company).join(",");
          if (category.type === "access") {
            mode = isChecked
              ? selectedTransitString
              : `${selectedTransitString},${mode}`;
          }
          onQueryParamChange({ companies, mode }, category.label);
        };
        // All Tri-Met categories either have a mode or the first option does
        const mode =
          category.mode || (category.options && category.options[0].mode);
        return (
          <Checkbox
            aria-checked={hasTransit}
            ariaLabel={category.label}
            checked={isChecked}
            key={`access-${category.label}`}
            mode={mode}
            onClick={onChangeMode}
            selected={isChecked}
            SimpleModeIcon={SimpleModeIcon}
          >
            {category.label}
          </Checkbox>
        );
      })}
    </S.ScrollableRow>
  );
};

export default ModeRow;
