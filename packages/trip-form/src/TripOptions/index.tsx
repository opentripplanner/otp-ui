import React, { ReactElement, useState } from "react";

import GeneralSettingsPanel from "../GeneralSettingsPanel";

import FeaturedOption from "./FeaturedOption";
import FeaturedOptionOverlay from "./FeaturedOptionOverlay";
import ModeRow from "./ModeRow";
import TransitOptions from "./TransitOptions";
import { Company, QueryProps } from "./types";
import * as S from "./styled";

interface ComponentProps {
  footer?: ReactElement;
  supportedCompanies: Company[];
}

type Props = ComponentProps & QueryProps;

export default function TripOptions(props: Props): ReactElement {
  const [featuredOption, setFeaturedOption] = useState(null);
  const {
    footer,
    onQueryParamChange,
    queryParams,
    supportedCompanies,
    supportedModes
  } = props;
  if (featuredOption) {
    return (
      <S.TripOptionsContainer>
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
      <div className="optionsContainer">
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
      </div>
    </S.TripOptionsContainer>
  );
}
