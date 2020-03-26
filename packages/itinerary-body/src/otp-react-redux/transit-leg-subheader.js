import {
  languageConfigType,
  legType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "../styled";
import ViewStopButton from "./view-stop-button";

export default function TransitLegSubheader({
  languageConfig,
  leg,
  onStopClick
}) {
  const { from } = leg;
  const buttonText = languageConfig.stopViewer || "Stop Viewer";
  return (
    <Styled.PlaceSubheader>
      <span>Stop ID {from.stopId.split(":")[1]}</span>
      <ViewStopButton
        onStopClick={onStopClick}
        stopId={from.stopId}
        text={buttonText}
      />
    </Styled.PlaceSubheader>
  );
}

TransitLegSubheader.propTypes = {
  languageConfig: languageConfigType.isRequired,
  leg: legType.isRequired,
  onStopClick: PropTypes.func.isRequired
};
