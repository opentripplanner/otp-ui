import coreUtils from "@opentripplanner/core-utils";
import React from "react";

import { Modes, QueryParams } from "./types";
import * as S from "./styled";
import {
  categoryIsActive,
  getCategoryPrimaryMode,
  getSelectedModes
} from "./util";

const ModeRow = ({
  onQueryParamChange,
  queryParams,
  supportedModes,
  modeIcons = {}
}: {
  onQueryParamChange(paramsToUpdate: QueryParams): void;
  queryParams: QueryParams;
  supportedModes: Modes;
  modeIcons: Record<string, string>;
}) => {
  const { categories } = supportedModes;
  const selectedModes = getSelectedModes(queryParams);
  const selectedTransit = selectedModes.filter(coreUtils.itinerary.isTransit);
  const hasTransit = selectedTransit.length > 0;
  return (
    <S.ScrollableRow hideScrollbars={false}>
      <S.Checkbox
        onClick={() => onQueryParamChange({ mode: "TRANSIT" })}
        selected={hasTransit}
      >
        {hasTransit ? <S.GreenCheck /> : <S.UncheckedIcon />}
        Go by Transit
      </S.Checkbox>
      {categories.map(category => {
        const isChecked = hasTransit
          ? category.type === "access" &&
            categoryIsActive(category, selectedModes)
          : category.type === "exclusive" &&
            categoryIsActive(category, selectedModes);
        const onChangeMode = () => {
          let mode = getCategoryPrimaryMode(category);
          const company =
            typeof category.mode === "undefined"
              ? undefined
              : category.options?.map(o => o.company).join(",");
          const selectedTransitString = selectedTransit.join(",") || "TRANSIT";
          if (category.type === "access") {
            mode = isChecked
              ? selectedTransitString
              : `${selectedTransitString},${mode}`;
          }
          onQueryParamChange({ company, mode });
        };
        return (
          <S.Checkbox
            key={`access-${category.label}`}
            onClick={onChangeMode}
            selected={isChecked}
          >
            {/* Must use label, as it is the only field garunteed across all modes */}
            {modeIcons[category.label] !== undefined && (
              <span className="custom">{modeIcons[category.label]}</span>
            )}

            {isChecked ? <S.GreenCheck /> : <S.UncheckedIcon />}
            {category.label}
          </S.Checkbox>
        );
      })}
    </S.ScrollableRow>
  );
};

export default ModeRow;
