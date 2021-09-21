import React, { ReactElement, useState } from "react";

import GeneralSettingsPanel from "../GeneralSettingsPanel";

import FeaturedOption from "./FeaturedOption";
import FeaturedOptionOverlay from "./FeaturedOptionOverlay";
import ModeRow from "./ModeRow";
import TransitOptions from "./TransitOptions";
import { Company, QueryProps } from "./types";
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
}

type Props = ComponentProps & QueryProps;

/**
 * This component renders the custom TriMet Mode Selector
 */
export default function TripOptions(props: Props): ReactElement {
  const [featuredOption, setFeaturedOption] = useState(null);
  const {
    className,
    footer,
    onQueryParamChange,
    queryParams,
    supportedCompanies,
    supportedModes
  } = props;
  if (featuredOption) {
    return (
      <S.TripOptionsContainer className={className}>
        <FeaturedOptionOverlay
          featuredOption={featuredOption}
          setFeaturedOption={setFeaturedOption}
          supportedCompanies={supportedCompanies}
          supportedModes={supportedModes}
        />
      </S.TripOptionsContainer>
    );
  }
  return (
    <S.TripOptionsContainer>
      <ModeRow
        onQueryParamChange={onQueryParamChange}
        queryParams={queryParams}
        supportedModes={supportedModes}
      />
      <S.TripOptionsSubContainer>
        <FeaturedOption
          onQueryParamChange={onQueryParamChange}
          queryParams={queryParams}
          setFeaturedOption={setFeaturedOption}
          supportedModes={supportedModes}
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
        />
        {footer}
      </S.TripOptionsSubContainer>
    </S.TripOptionsContainer>
  );
}
