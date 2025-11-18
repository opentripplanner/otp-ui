import React from 'react'
import BaseMap, { Styled as BaseMapStyled } from "../packages/base-map";

import "maplibre-gl/dist/maplibre-gl.css";
import "./base-map-wrapper-a11y.css";

// BaseMap props
const CENTER = [45.5215, -122.686202];
const ZOOM = 16;

export const withMap = (center = CENTER, zoom = ZOOM) => (
    Story
  ) => (
    <BaseMapStyled.StoryMapContainer>
      <BaseMap center={center} zoom={zoom}>
        {/* For some reason, <Story /> does not work with snapshots,
          so use the function syntax instead. */}
        {Story()}
      </BaseMap>
    </BaseMapStyled.StoryMapContainer>
  );