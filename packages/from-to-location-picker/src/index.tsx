import LocationIcon from "@opentripplanner/location-icon";
import React from "react";
// eslint-disable-next-line prettier/prettier
import type { FromToPickerProps } from "./types";

import * as S from "./styled";

const iconSize = "0.9em";


const FromToLocationPicker = ({
  fromText = "From here",
  location = null,
  onFromClick = null,
  onToClick = null,
  toText = "To here",
  setLocation = null,
  showIcons = true
}: FromToPickerProps): React.ReactElement => {
  const handleFromClick = () => {
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

  const handleToClick = () => {
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

  return (
    <S.FromToPickerSpan>
      <S.LocationPickerSpan>
        {showIcons && <LocationIcon type="from" size={iconSize} />}
        <S.Button onClick={handleFromClick}>{fromText}</S.Button>
      </S.LocationPickerSpan>
      <S.LocationPickerSpan>
        {showIcons && <LocationIcon type="to" size={iconSize} />}
        <S.Button onClick={handleToClick}>{toText}</S.Button>
      </S.LocationPickerSpan>
    </S.FromToPickerSpan>
  );
};

export default FromToLocationPicker;

// Rename styled components for export
export { S as Styled };
