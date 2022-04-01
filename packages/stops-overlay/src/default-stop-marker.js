import { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { CircleMarker, Popup } from "react-leaflet";

import * as S from "./styled";

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
                <b>Stop ID:</b> {userFacingId}
              </span>
              <S.ViewStopButton onClick={this.onClickView}>
                {languageConfig.stopViewer || "Stop Viewer"}
              </S.ViewStopButton>
            </BaseMapStyled.PopupRow>

            {/* The "Set as [from/to]" ButtonGroup */}
            <BaseMapStyled.PopupRow>
              <b>Plan a trip:</b>
              <FromToLocationPicker
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
  // Typescript TODO: restore correct type
  // eslint-disable-next-line react/forbid-prop-types
  languageConfig: PropTypes.object.isRequired,
  // Typescript TODO: restore correct type
  // eslint-disable-next-line react/forbid-prop-types
  leafletPath: PropTypes.object,
  radius: PropTypes.number,
  setLocation: PropTypes.func.isRequired,
  setViewedStop: PropTypes.func.isRequired,
  // Typescript TODO: restore correct type
  // eslint-disable-next-line react/forbid-prop-types
  stop: PropTypes.object.isRequired
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
