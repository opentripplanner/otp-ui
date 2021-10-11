import coreUtils from "@opentripplanner/core-utils";
import React, { FunctionComponent, ReactElement, useState } from "react";

import GeneralSettingsPanel from "../GeneralSettingsPanel";

import FeaturedOption from "./FeaturedOption";
import FeaturedOptionOverlay from "./FeaturedOptionOverlay";
import { getSelectedModes } from "./util";
import ModeRow from "./ModeRow";
import TransitOptions from "./TransitOptions";
import { Company, QueryParams, QueryProps } from "./types";
import * as S from "./styled";

interface ComponentProps {
  /**
   * React element to be rendered below
   * the rest of the element
   */
  footer?: ReactElement;

  /**
   * List of company objects to include in the
   * featured options
   */
  supportedCompanies: Company[];

  /**
   * Classnames to add to the container div to allow additional styling
   */
  className: string;

  /**
   * Icon prop used for overwriting the question mark icon throughout the component
   */
  QuestionIcon: ReactElement;

  /**
   * Icon prop used for overwriting mode icons throughout the component
   */
  SimpleModeIcon?: FunctionComponent<{ mode: string }>;

  /**
   * Icon prop used for overwriting company logos throughout the component
   */
  CompanyIcon?: FunctionComponent<{ company: string }>;
  // DetailedModeIcon is defined in QueryProps
}

type Props = ComponentProps & QueryProps;

/**
 * This component renders the custom TriMet Mode Selector
 */
export default function TripOptions(props: Props): ReactElement {
  const [featuredOption, setFeaturedOption] = useState(null);
  const [queryParamOverrides, setQueryParamOverrides] = useState<{
    [key: string]: QueryParams;
  }>({});

  const {
    className,
    footer,
    onQueryParamChange: updateQueryParams,
    queryParams,
    supportedCompanies,
    supportedModes,
    QuestionIcon,
    SimpleModeIcon,
    DetailedModeIcon,
    CompanyIcon
  } = props;

  // FIXME: move all query param handling to hook (object with category to queryParam mapping)
  // THis will involve refactoring all sub-components to send category along with
  // query param update. The refactor will be complex but the end result will be
  // cleaner and simpler
  const onQueryParamChange = (
    newQueryParams: QueryParams,
    categoryLabel: string = null
  ) => {
    // Merge params together to persist some param changes
    const newParams = { ...queryParams, ...newQueryParams };

    // Update transit override if changes are made to transit submodes
    const updatedSelectedModes = getSelectedModes(newParams);
    const updatedSelectedTransit = updatedSelectedModes.filter(
      coreUtils.itinerary.isTransit
    );
    if (updatedSelectedTransit.length > 0) {
      setQueryParamOverrides({
        ...queryParamOverrides,
        transit: { mode: updatedSelectedTransit.join(",") }
      });
    }

    // Update category override
    if (categoryLabel) {
      const { companies, mode } = newQueryParams;
      setQueryParamOverrides({
        ...queryParamOverrides,
        [categoryLabel]: { companies, mode }
      });
    }

    // Override transit if transit override is present
    if (
      updatedSelectedTransit[0] === "TRANSIT" &&
      "transit" in queryParamOverrides
    ) {
      newParams.mode = newParams.mode.replace(
        "TRANSIT",
        queryParamOverrides.transit.mode
      );
    }
    updateQueryParams(newParams);
  };

  if (featuredOption) {
    return (
      <S.TripOptionsContainer className={className}>
        <FeaturedOptionOverlay
          featuredOption={featuredOption}
          setFeaturedOption={setFeaturedOption}
          supportedCompanies={supportedCompanies}
          supportedModes={supportedModes}
          CompanyIcon={CompanyIcon}
          DetailedModeIcon={DetailedModeIcon}
        />
      </S.TripOptionsContainer>
    );
  }
  return (
    <S.TripOptionsContainer className={className}>
      <ModeRow
        onQueryParamChange={onQueryParamChange}
        queryParamOverrides={queryParamOverrides}
        queryParams={queryParams}
        supportedModes={supportedModes}
        SimpleModeIcon={SimpleModeIcon}
      />
      <S.TripOptionsSubContainer>
        <FeaturedOption
          onQueryParamChange={onQueryParamChange}
          queryParams={queryParams}
          setFeaturedOption={setFeaturedOption}
          supportedModes={supportedModes}
          questionIcon={QuestionIcon}
          DetailedModeIcon={DetailedModeIcon}
        />
        <GeneralSettingsPanel
          query={queryParams}
          supportedModes={supportedModes}
          onQueryParamChange={onQueryParamChange}
        />
        <TransitOptions
          onQueryParamChange={onQueryParamChange}
          queryParams={queryParams}
          supportedModes={supportedModes}
          DetailedModeIcon={DetailedModeIcon}
        />
        {footer}
      </S.TripOptionsSubContainer>
    </S.TripOptionsContainer>
  );
}

export { S as Styled };
