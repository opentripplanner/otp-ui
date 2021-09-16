import coreUtils from "@opentripplanner/core-utils";
import LocationIcon from "@opentripplanner/location-icon";
import PropTypes from "prop-types";
import React, { Component } from "react";

import * as S from "./styled";

const iconSize = "0.9em";

class FromToLocationPicker extends Component {
  onFromClick = () => {
    const { location, onFromClick, setLocation } = this.props;
    if (onFromClick) {
      onFromClick();
      return;
    }
    setLocation({
      location,
      locationType: "from",
      reverseGeocode: false
    });
  };

  onToClick = () => {
    const { location, onToClick, setLocation } = this.props;
    if (onToClick) {
      onToClick();
      return;
    }
    setLocation({
      location,
      locationType: "to",
      reverseGeocode: false
    });
  };

  render() {
    const { fromText, showIcons, toText } = this.props;
    return (
      <S.FromToPickerSpan>
        <S.LocationPickerSpan>
          {showIcons && <LocationIcon type="from" size={iconSize} />}
          <S.Button onClick={this.onFromClick}>{fromText}</S.Button>
        </S.LocationPickerSpan>
        <S.LocationPickerSpan>
          {showIcons && <LocationIcon type="to" size={iconSize} />}
          <S.Button onClick={this.onToClick}>{toText}</S.Button>
        </S.LocationPickerSpan>
      </S.FromToPickerSpan>
    );
  }
}

FromToLocationPicker.propTypes = {
  /**
   * The text to display on the "from" button for setting the origin of a trip.
   */
  fromText: PropTypes.string,
  /**
   * A specific location to associate with this. This is only used when combined
   * with the setLocation prop.
   */
  location: coreUtils.types.locationType,
  /**
   * Triggered when the user clicks on the "from" button.
   */
  onFromClick: PropTypes.func,
  /**
   * Triggered when the user clicks on the "to" button.
   */
  onToClick: PropTypes.func,
  /**
   * The text to display on the "to" button for setting the destination of a trip.
   */
  toText: PropTypes.string,
  /**
   * Triggered when the user clicks either the "from" or "to" button and there
   * are no from/to specific handler functions defined as props.
   *
   * Passes an argument as follows:
   * { locationType: "from/to", location, reverseGeocode: false }
   */
  setLocation: PropTypes.func,
  /**
   * Determines whether icons are shown on the "from" and "to" buttons.
   */
  showIcons: PropTypes.bool
};

FromToLocationPicker.defaultProps = {
  fromText: "From here",
  location: null,
  onFromClick: null,
  onToClick: null,
  setLocation: null,
  showIcons: true,
  toText: "To here"
};

export default FromToLocationPicker;

// Rename styled components for export
export { S as Styled };
