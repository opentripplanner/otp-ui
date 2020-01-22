import { locationType } from "@opentripplanner/core-utils/lib/types";
import LocationIcon from "@opentripplanner/location-icon";
import PropTypes from "prop-types";
import React, { Component } from "react";

import { LocationPickerSpan, Button, FromToPickerSpan } from "./styled";

const iconSize = "0.9em";

class FromToLocationPicker extends Component {
  onFromClick = () => {
    const { location, onFromClick, setLocation } = this.props;
    if (onFromClick) {
      onFromClick();
      return;
    }
    setLocation({
      type: "from",
      location,
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
      type: "to",
      location,
      reverseGeocode: false
    });
  };

  render() {
    const { fromText, showIcons, toText } = this.props;
    return (
      <FromToPickerSpan>
        <LocationPickerSpan>
          {showIcons && <LocationIcon type="from" size={iconSize} />}
          <Button onClick={this.onFromClick}>{fromText}</Button>
        </LocationPickerSpan>
        <LocationPickerSpan>
          {showIcons && <LocationIcon type="to" size={iconSize} />}
          <Button onClick={this.onToClick}>{toText}</Button>
        </LocationPickerSpan>
      </FromToPickerSpan>
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
  location: locationType,
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
   * { type: "from/to", location, reverseGeocode: false }
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
