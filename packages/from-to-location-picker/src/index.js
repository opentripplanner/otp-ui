import React from "react";
import PropTypes from "prop-types";

import LocationIcon from "@opentripplanner/location-icon";
import { LocationPickerSpan, Button, FromToPickerSpan } from "./styled";

const iconSize = "0.9em";

const FromToLocationPicker = ({
  fromText,
  toText,
  showIcons,
  onFromClick,
  onToClick
}) => {
  return (
    <FromToPickerSpan>
      <LocationPickerSpan>
        {showIcons && <LocationIcon type="from" size={iconSize} />}
        <Button onClick={onFromClick}>{fromText}</Button>
      </LocationPickerSpan>
      <LocationPickerSpan>
        {showIcons && <LocationIcon type="to" size={iconSize} />}
        <Button onClick={onToClick}>{toText}</Button>
      </LocationPickerSpan>
    </FromToPickerSpan>
  );
};

FromToLocationPicker.propTypes = {
  /**
   * The text to display on the "from" button for setting the origin of a trip.
   */
  fromText: PropTypes.string,
  /**
   * The text to display on the "to" button for setting the destination of a trip.
   */
  toText: PropTypes.string,
  /**
   * Determines whether icons are shown on the "from" and "to" buttons.
   */
  showIcons: PropTypes.bool,
  /**
   * Triggered when the user clicks on the "from" button.
   */
  onFromClick: PropTypes.func.isRequired,
  /**
   * Triggered when the user clicks on the "to" button.
   */
  onToClick: PropTypes.func.isRequired
};

FromToLocationPicker.defaultProps = {
  fromText: "From here",
  toText: "To here",
  showIcons: true
};

export default FromToLocationPicker;
