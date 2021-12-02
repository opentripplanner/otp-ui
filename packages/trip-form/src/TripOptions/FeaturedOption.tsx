import React from "react";
import coreUtils from "@opentripplanner/core-utils";
import { QuestionCircle } from "@styled-icons/fa-regular/QuestionCircle";

import {
  accessModeIsWalkOnly,
  getCategoryModes,
  getCategoryPrimaryMode,
  getNonTransitModes,
  getSelectedModes
} from "./util";
import { ModeOption, QueryProps } from "./types";
import OptionButton from "./OptionButton";

import * as S from "./styled";

// todo: move this string to localization file (and possibly add more exact info on each particular mode)
const modeButtonAriaLabel =
  "Opens a dialog that describes this mode, with optional links to third party services.";

const FeaturedOption = ({
  onQueryParamChange,
  queryParams,
  questionIcon,
  setFeaturedOption,
  supportedModes,
  DetailedModeIcon
}: QueryProps & {
  setFeaturedOption(option: string): void;
  questionIcon?: React.ReactElement;
}): React.ReactElement => {
  // No featured mode to show if walking to transit
  if (accessModeIsWalkOnly(queryParams?.mode)) return null;
  const nonTransitModes = getNonTransitModes(queryParams?.mode);
  const selectedCompanies = queryParams?.companies?.split(",") || [];
  const selectedModes = getSelectedModes(queryParams);
  const option = nonTransitModes[0];
  const category = supportedModes.categories.find(c =>
    getCategoryModes(c).some(o => o === option)
  );
  const optionsAreCheckboxes = Boolean(category.mode);

  // FIXME: the entire selectOption method could probably be repalced
  // with a better useEffect hook

  const selectOption = (isChecked: boolean, o: ModeOption) => {
    let mode = selectedModes;
    let company = selectedCompanies;
    if (isChecked) {
      // Un-check the company box if dealing with checkboxes. Otherwise, do nothing.
      if (optionsAreCheckboxes) {
        company = selectedCompanies.filter(c => c !== o.company);
        // Do nothing if already radio button is already checked.
      } else {
        return;
      }
    } else {
      // if un checked, set/add company and set mode (FIXME: what about car/walk)
      if (o.mode) {
        mode = selectedModes
          .filter(coreUtils.itinerary.isTransit)
          .concat([o.mode]);
      }
      if (o.company) {
        company = optionsAreCheckboxes
          ? selectedCompanies.concat([o.company])
          : [o.company];
      } else {
        company = [];
      }
    }
    onQueryParamChange(
      {
        companies: company.join(","),
        mode: mode.join(",")
      },
      category.id
    );
  };

  return (
    <S.FeaturedOptionContainer>
      <div>
        {category.options.map((o, index) => {
          const companyIsSelected = selectedCompanies.some(
            c => c === o.company
          );
          const modeIsSelected = selectedModes.some(m => m === o.mode);
          const isChecked = optionsAreCheckboxes
            ? companyIsSelected
            : o.company
            ? companyIsSelected && modeIsSelected
            : modeIsSelected;

          return (
            <OptionButton
              checked={isChecked}
              disabled={isChecked && selectedCompanies.length === 1}
              key={index}
              label={o.label}
              onClick={() => selectOption(isChecked, o)}
              selected={isChecked}
            />
          );
        })}
      </div>
      <S.FeaturedOptionQuestionContainer
        aria-label={modeButtonAriaLabel}
        onClick={() => setFeaturedOption(option)}
        onKeyPress={() => setFeaturedOption(option)}
        role="link"
        tabIndex={0}
      >
        <S.QuestionButton aria-label={modeButtonAriaLabel}>
          {questionIcon || <QuestionCircle />}
        </S.QuestionButton>
        <S.FeaturedOptionImageWrapper>
          {(DetailedModeIcon && (
            <DetailedModeIcon mode={getCategoryPrimaryMode(category)} />
          )) || <S.Image src={category.image} />}
        </S.FeaturedOptionImageWrapper>
      </S.FeaturedOptionQuestionContainer>
    </S.FeaturedOptionContainer>
  );
};

export default FeaturedOption;
