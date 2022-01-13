import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StreetView } from "@styled-icons/fa-solid";

/**
 * Helper method to generate bounding box from a location. Adding the WINDOW to the coordinate
 * creates a bounding box of approximately 1 meter around the coordinate, which is likely to
 * encompass any imagery available.
 * @param coord     The coordinate to convert to a bounding box
 * @returns         A bounding box 1 meter around the passed coordinate
 */
const generateBoundingBoxFromCoordinate = (coord: [number, number]) => {
  const WINDOW = 0.000075;
  const south = coord[0] - WINDOW;
  const north = coord[0] + WINDOW;
  const west = coord[1] - WINDOW;
  const east = coord[1] + WINDOW;
  return [west, south, east, north];
};

const Container = styled.a<{ padLeft?: boolean; padTop?: boolean }>`
  display: inline-block;
  margin-top: ${props => (props.padTop ? "10px" : "0")};

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
    margin-left: ${props => (props.padLeft ? "1ch" : "0")};
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
 * @param padTop        Whether to add padding to the top of the container.
 * @param clickCallback A method to fire when the button is clicked, which accepts an ID.
 *  If it is not passsed, a popup window will be opened. */
const MapillaryButton = ({
  clickCallback,
  coords,
  mapillaryKey,
  padLeft,
  padTop
}: {
  clickCallback?: (id: string) => void;
  coords: [number, number];
  mapillaryKey: string;
  padLeft?: boolean;
  padTop?: boolean;
}): JSX.Element => {
  const [imageId, setImageId] = useState(null);

  useEffect(() => {
    // useEffect only supports async actions as a child function
    const getMapillaryId = async () => {
      const bounds = generateBoundingBoxFromCoordinate(coords).join(",");
      const raw = await fetch(
        `https://graph.mapillary.com/images?fields=id&limit=1&access_token=${mapillaryKey}&bbox=${bounds}`
      );
      const json = await raw.json();
      if (json?.data?.length > 0) {
        setImageId(json.data[0].id);
      }
    };

    if (!imageId && !!mapillaryKey) getMapillaryId();
  }, [coords]);

  const handleClick = () => {
    if (clickCallback) clickCallback(imageId);
    else {
      window.open(
        `https://www.mapillary.com/embed?image_key=${imageId}`,
        "_blank",
        "location=no,height=600,width=600,scrollbars=no,status=no"
      );
    }
  };

  if (!imageId) return null;
  return (
    <Container
      onClick={handleClick}
      padLeft={padLeft}
      padTop={padTop}
      title="Show street imagery at this location"
    >
      <Icon />
    </Container>
  );
};

export default MapillaryButton;
