import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { StreetView } from "@styled-icons/fa-solid/StreetView";

import { defaultMessages } from "../util";

/**
 * Helper method to generate bounding box from a location. Adding the WINDOW to the coordinate
 * creates a bounding box of approximately 1 meter around the coordinate, which is likely to
 * encompass any imagery available.
 * @param coord     The coordinate to convert to a bounding box
 * @returns         A bounding box 1 meter around the passed coordinate
 */
const generateBoundingBoxFromCoordinate = ({
  lat,
  lon
}: {
  lat: number;
  lon: number;
}) => {
  const WINDOW = 0.000075;
  const south = lat - WINDOW;
  const north = lat + WINDOW;
  const west = lon - WINDOW;
  const east = lon + WINDOW;
  return [west, south, east, north];
};

const Container = styled.a`
  &:hover {
    cursor: pointer;
    text-decoration: none;
  }

  &:active {
    color: #111;
  }

  &::before {
    content: "| ";
    cursor: auto;
  }
`;

const Icon = styled(StreetView)`
  height: 16px;
  padding-left: 2px;
`;

/**
 * A component which shows a "street view" button if a Mapillary image is available for a
 * passed coordinate
 *
 * @param coords        The coordinates to find imagery for in the format [lat, lon]
 * @param mapillaryKey  A Mapillary api key used to check for imagery.
 * @param clickCallback A method to fire when the button is clicked, which accepts an ID.
 *  If it is not passed, a popup window will be opened. */
const MapillaryButton = ({
  clickCallback,
  coords,
  mapillaryKey
}: {
  clickCallback?: (id: string) => void;
  coords: { lat: number; lon: number };
  mapillaryKey: string;
}): JSX.Element => {
  const [imageUrl, setImageUrl] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    // useEffect only supports async actions as a child function
    const getMapillaryUrl = async () => {
      const bounds = generateBoundingBoxFromCoordinate(coords).join(",");
      const raw = await fetch(
        `https://graph.mapillary.com/images?fields=thumb_2048_url&limit=1&access_token=${mapillaryKey}&bbox=${bounds}`
      );
      const json = await raw.json();

      if (json?.data?.length > 0) {
        const imageRaw = await fetch(
          `https://graph.mapillary.com/${json.data[0].id}/?fields=thumb_2048_url&access_token=${mapillaryKey}`
        );
        const imageJson = await imageRaw.json();
        if (imageJson?.thumb_2048_url) {
          setImageUrl(imageJson.thumb_2048_url);
        }
      }
    };

    if (!imageUrl && !!mapillaryKey) getMapillaryUrl();
  }, [coords]);

  const handleClick = () => {
    if (clickCallback) clickCallback(imageUrl);
    else {
      window.open(
        `${imageUrl}?access_token=${mapillaryKey}`,
        "_blank",
        "location=no,height=600,width=600,scrollbars=no,status=no"
      );
    }
  };

  if (!imageUrl) return null;
  return (
    <Container
      onClick={handleClick}
      title={intl.formatMessage({
        defaultMessage: defaultMessages["otpUi.AccessLegBody.mapillaryTooltip"],
        description: "Tooltip text describing the street view icon.",
        id: "otpUi.AccessLegBody.mapillaryTooltip"
      })}
    >
      <Icon style={{ paddingBottom: 1 }} />
    </Container>
  );
};

export default MapillaryButton;
