import flatten from "flat";
import LocationIcon from "@opentripplanner/location-icon";
import { FormattedMessage } from "react-intl";
import React from "react";

import * as S from "./styled";

// eslint-disable-next-line prettier/prettier
import type { FromToPickerProps } from "./types";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

const iconSize = "0.9em";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

const FromToLocationPicker = ({
  location = null,
  onFromClick = null,
  onToClick = null,
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
        <S.Button onClick={handleFromClick}>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.FromToLocationPicker.from"]}
            description="Text for the 'from' button of the picker"
            id="otpUi.FromToLocationPicker.from"
          />
        </S.Button>
      </S.LocationPickerSpan>
      <S.LocationPickerSpan>
        {showIcons && <LocationIcon type="to" size={iconSize} />}
        <S.Button onClick={handleToClick}>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.FromToLocationPicker.to"]}
            description="Text for the 'to' button of the picker"
            id="otpUi.FromToLocationPicker.to"
          />
        </S.Button>
      </S.LocationPickerSpan>
    </S.FromToPickerSpan>
  );
};

export default FromToLocationPicker;

// Rename styled components for export
export { S as Styled };
