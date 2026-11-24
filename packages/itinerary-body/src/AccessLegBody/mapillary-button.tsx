import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { StreetView } from "@styled-icons/fa-solid/StreetView";
import coreUtils from "@opentripplanner/core-utils";

import { MapillaryProvider } from "@opentripplanner/core-utils/lib/mapillary";
import { defaultMessages } from "../util";

const { mapillary } = coreUtils;

const Container = styled.a`
  &:hover {
    cursor: pointer;
    text-decoration: none;
  }

  &:active {
    color: #111;
  }

  &::before {
    content: "|";
    cursor: auto;
    margin: 0 0.25em;
  }
`;

const Icon = styled(StreetView)`
  height: 16px;
  padding-left: 5px;
`;

/**
 * A component which shows a "street view" button if a Mapillary image is available for a
 * passed coordinate
 *
 * @param coords            The coordinates to find imagery for in the format [lat, lon]
 * @param mapillaryKey      A Mapillary api key used to check for imagery.
 * @param mapillaryProvider A provider (defined in core-utils/mapillary) which displays street
 * imagery
 * @param clickCallback     A method to fire when the button is clicked, which accepts an ID.
 *  If it is not passed, a popup window will be opened. */
const MapillaryButton = ({
  clickCallback,
  coords,
  mapillaryKey,
  mapillaryProvider
}: {
  clickCallback?: (id: string) => void;
  coords: { lat: number; lon: number };
  mapillaryKey: string;
  mapillaryProvider?: MapillaryProvider;
}): JSX.Element => {
  const [imageId, setImageId] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    // useEffect only supports async actions as a child function
    const getMapillaryId = async () => {
      const fetchedId = await mapillary.getImageIdForProvider[
        mapillaryProvider || "MAPILLARY"
      ](coords, mapillaryKey);
      if (fetchedId) setImageId(fetchedId);
    };

    if (!imageId && !!(mapillaryKey || mapillaryProvider)) getMapillaryId();
  }, [coords]);

  const handleClick = () => {
    if (imageId) {
      if (clickCallback) clickCallback(imageId);
      else {
        window.open(
          mapillary.generateUrlForProvider[mapillaryProvider || "MAPILLARY"](
            imageId
          ),
          "_blank",
          "location=no,height=600,width=600,scrollbars=no,status=no"
        );
      }
    }
  };

  if (!imageId) return null;
  const mapilaryLabel = intl.formatMessage({
    defaultMessage: defaultMessages["otpUi.AccessLegBody.mapillaryTooltip"],
    description: "Tooltip text describing the street view icon.",
    id: "otpUi.AccessLegBody.mapillaryTooltip"
  });
  return (
    <Container
      aria-label={mapilaryLabel}
      onClick={handleClick}
      role="link"
      title={mapilaryLabel}
    >
      <Icon style={{ paddingBottom: 1 }} />
    </Container>
  );
};

export default MapillaryButton;
