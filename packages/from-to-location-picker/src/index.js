import React from "react";
import PropTypes from "prop-types";

import LocationIcon from "@opentripplanner/location-icon";
import { LocationPickerSpan, Button, FromToPickerSpan } from "./styled";

const iconSize = "0.9em";

const FromToLocationPicker = ({
  fromText = "From here",
  toText = "To here",
  showIcons = true,
  onFromClick,
  onToClick
}) => {
  return (
    <FromToPickerSpan>
      <LocationPickerSpan>
        {showIcons ? <LocationIcon type="from" size={iconSize} /> : null}
        <Button onClick={onFromClick}>{fromText}</Button>
      </LocationPickerSpan>
      <LocationPickerSpan>
        {showIcons ? <LocationIcon type="to" size={iconSize} /> : null}
        <Button onClick={onToClick}>{toText}</Button>
      </LocationPickerSpan>
    </FromToPickerSpan>
  );
};

FromToLocationPicker.propTypes = {
  fromText: PropTypes.string,
  toText: PropTypes.string,
  showIcons: PropTypes.bool,
  onFromClick: PropTypes.func.isRequired,
  onToClick: PropTypes.func.isRequired
};

FromToLocationPicker.defaultProps = {
  fromText: "From here",
  toText: "To here",
  showIcons: true
};

export default FromToLocationPicker;
