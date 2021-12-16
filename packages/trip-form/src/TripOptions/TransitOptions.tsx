import coreUtils from "@opentripplanner/core-utils";
import React, { FunctionComponent } from "react";

import * as S from "./styled";
import Checkbox from "./Checkbox";
import { QueryProps } from "./types";
import { getSelectedModes } from "./util";

const TransitOptions = ({
  onQueryParamChange,
  queryParams,
  supportedModes,
  checkboxIcons,
  DetailedModeIcon
}: {
  checkboxIcons?: { checked: FunctionComponent; unchecked: FunctionComponent };
} & QueryProps): JSX.Element => {
  const { transitModes } = supportedModes;
  const selectedModes = getSelectedModes(queryParams);
  const selectedTransit = selectedModes.filter(coreUtils.itinerary.isTransit);
  const hasTransit = selectedTransit.length > 0;
  if (!hasTransit) return null;
  const selectedAndVisibleTransit = [];
  transitModes.forEach(m => {
    if (selectedTransit.some(t => t === m.mode) && !m.hidden) {
      selectedAndVisibleTransit.push(m);
    }
  });
  return (
    <S.TransitOptionsContainer>
      {transitModes.map(transitMode => {
        if (transitMode.hidden) return null;
        const allTransitEnabled = selectedModes.some(m => m === "TRANSIT");
        const isChecked =
          allTransitEnabled || selectedModes.some(m => m === transitMode.mode);
        return (
          <Checkbox
            ariaLabel={transitMode.label}
            checkboxIcons={checkboxIcons}
            checked={isChecked}
            /* This prevents the user from de-selecting a transit mode when it is the only one selected.
            the selectedModes length being 3 indicates that only one mode is selected. GONDOLA, WALK, and the mode. */
            disabled={isChecked && selectedModes.length === 3}
            key={transitMode.mode}
            inset
            onClick={() => {
              let mode = selectedModes;
              // Remove mode from list if all transit is selected.
              if (allTransitEnabled) {
                mode = selectedModes
                  .filter(m => m !== "TRANSIT")
                  .concat(
                    transitModes
                      .filter(m => m.mode !== transitMode.mode)
                      .map(m => m.mode)
                  );
              } else if (isChecked) {
                // Handle unchecking.
                // If this is the last visible transit mode, switch to WALK only.
                mode =
                  selectedAndVisibleTransit.length === 1
                    ? ["WALK"]
                    : selectedModes.filter(m => m !== transitMode.mode);
              } else {
                // Add mode to list.
                mode = selectedModes.concat([transitMode.mode]);
              }
              onQueryParamChange({ mode: mode.join(",") });
            }}
            selected={isChecked}
          >
            {(DetailedModeIcon && (
              <DetailedModeIcon mode={transitMode.mode} />
            )) ||
              (transitMode.image && (
                <S.Image
                  alt={`Image for ${transitMode.label}`}
                  src={transitMode.image}
                />
              ))}
            <span style={{ zIndex: 5 }}>{transitMode.label}</span>
          </Checkbox>
        );
      })}
    </S.TransitOptionsContainer>
  );
};

export default TransitOptions;
