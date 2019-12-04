import React from "react";
import PropTypes from "prop-types";

import { FromLocationIcon, ToLocationIcon } from "icons";
import { LocationPickerSpan, Button, FromToPickerSpan } from "./styled";

const iconStyle = { height: "0.9em" };

const FromToLocationPicker = ({ onFromClick, onToClick }) => {
  return (
    <FromToPickerSpan>
      <LocationPickerSpan>
        <FromLocationIcon style={iconStyle} />
        <Button onClick={onFromClick}>From here</Button>
      </LocationPickerSpan>
      <LocationPickerSpan>
        <ToLocationIcon style={iconStyle} />
        <Button onClick={onToClick}>To here</Button>
      </LocationPickerSpan>
    </FromToPickerSpan>
  );
};

FromToLocationPicker.propTypes = {
  onFromClick: PropTypes.func.isRequired,
  onToClick: PropTypes.func.isRequired
};

export default FromToLocationPicker;
