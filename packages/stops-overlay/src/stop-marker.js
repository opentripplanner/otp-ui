import {
  languageConfigType,
  leafletPathType
} from "@opentripplanner/core-utils/lib/types";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { CircleMarker, Popup } from "react-leaflet";

import * as Styled from "./styled";

export const stopLayerStopType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired
});

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
    const { languageConfig, leafletPath, radius, stop } = this.props;
    const { id, name, lat, lon } = stop;
    const idArr = id.split(":");

    return (
      <CircleMarker
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...leafletPath}
        center={[lat, lon]}
        radius={radius}
      >
        <Popup>
          <Styled.MapOverlayPopup>
            <Styled.PopupTitle>{name}</Styled.PopupTitle>
            <Styled.PopupRow>
              <b>Agency:</b> {idArr[0]}
            </Styled.PopupRow>
            <Styled.PopupRow>
              <span>
                <b>Stop ID:</b> {idArr[1]}
              </span>
              <Styled.ViewStopButton onClick={this.onClickView}>
                {languageConfig.stopViewer || "Stop Viewer"}
              </Styled.ViewStopButton>
            </Styled.PopupRow>

            {/* The "Set as [from/to]" ButtonGroup */}
            <Styled.PopupRow>
              <FromToLocationPicker
                onFromClick={this.onFromClick}
                onToClick={this.onToClick}
              />
            </Styled.PopupRow>
          </Styled.MapOverlayPopup>
        </Popup>
      </CircleMarker>
    );
  }
}

StopMarker.propTypes = {
  languageConfig: languageConfigType.isRequired,
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
