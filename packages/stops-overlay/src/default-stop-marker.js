import { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import coreUtils from "@opentripplanner/core-utils";
import flatten from "flat";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { CircleMarker, Popup } from "react-leaflet";

import * as S from "./styled";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages = flatten(defaultEnglishMessages);

const { leafletPathType, stopLayerStopType } = coreUtils.types;

export default class StopMarker extends Component {
  onClickView = () => {
    const { setViewedStop, stop } = this.props;
    setViewedStop({ stopId: stop.id });
  };

  onFromClick = () => {
    this.setLocation("from");
  };

  onToClick = () => {
    this.setLocation("to");
  };

  setLocation(locationType) {
    const { setLocation, stop } = this.props;
    const { lat, lon, name } = stop;
    setLocation({ location: { lat, lon, name }, locationType });
  }

  render() {
    const { leafletPath, radius, stop } = this.props;
    const { code, geometries, id, lat, lon, name } = stop;
    const userFacingId = code || id.split(":")[1] || id;

    const extraPathOptions = {};
    // We pull the color from the GeoJSON properties instead of directly from
    // the stop object because we only want the stop icon to be route-colored
    // if it is a flex zone, and only flex zone stops have the color inserted
    // into the GeoJSON properties.
    //
    // However, all stops may have a color attribute
    if (geometries?.geoJson?.properties?.color) {
      extraPathOptions.fillColor = geometries.geoJson.properties.color;
    }
    return (
      <CircleMarker
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...leafletPath}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...extraPathOptions}
        center={[lat, lon]}
        radius={radius}
      >
        <Popup>
          <BaseMapStyled.MapOverlayPopup>
            <BaseMapStyled.PopupTitle>{name}</BaseMapStyled.PopupTitle>
            <BaseMapStyled.PopupRow>
              <span>
                <strong>
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages["otpUi.StopsOverlay.stopId"]
                    }
                    description="Displays the stop id"
                    id="otpUi.StopsOverlay.stopId"
                    values={{
                      stopId: userFacingId
                    }}
                  />
                </strong>
              </span>
              <S.ViewStopButton onClick={this.onClickView}>
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.StopsOverlay.stopViewer"]
                  }
                  description="Text for link that opens the stop viewer"
                  id="otpUi.StopsOverlay.stopViewer"
                />
              </S.ViewStopButton>
            </BaseMapStyled.PopupRow>

            {/* The "Set as [from/to]" ButtonGroup */}
            <BaseMapStyled.PopupRow>
              <FromToLocationPicker
                label
                onFromClick={this.onFromClick}
                onToClick={this.onToClick}
              />
            </BaseMapStyled.PopupRow>
          </BaseMapStyled.MapOverlayPopup>
        </Popup>
      </CircleMarker>
    );
  }
}

StopMarker.propTypes = {
  leafletPath: leafletPathType,
  radius: PropTypes.number,
  setLocation: PropTypes.func.isRequired,
  setViewedStop: PropTypes.func.isRequired,
  stop: stopLayerStopType.isRequired
};

StopMarker.defaultProps = {
  leafletPath: {
    color: "#000",
    fillColor: "#FFF",
    fillOpacity: 1,
    weight: 1
  },
  radius: 5
};
