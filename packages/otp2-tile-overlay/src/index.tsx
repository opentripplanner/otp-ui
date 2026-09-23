import { Feed } from "@opentripplanner/map-popup";
import {
  ConfiguredCompany,
  MapLocationActionArg,
  Stop,
  StopEventHandler
} from "@opentripplanner/types";
import { VehicleRentalStation } from "@opentripplanner/types/otp2";
import React, { useCallback, useState } from "react";
import { Source } from "react-map-gl/maplibre";

import OTP2TileLayerWithPopup, {
  ClickedEntity,
  STOPS_AND_STATIONS_TYPE
} from "./otp2-tile-layer-with-popup";

interface LayerConfig {
  color?: string;
  initiallyVisible?: boolean;
  minZoom?: number;
  name?: string;
  network?: string;
  overrideType?: string;
  type: string;
}

interface ClickedEntityState {
  entity: ClickedEntity;
}

const SOURCE_ID = "otp2-tiles";

function withFinalType(
  layer: LayerConfig
): LayerConfig & { finalType: string } {
  return {
    ...layer,
    finalType:
      layer.type === STOPS_AND_STATIONS_TYPE
        ? "stops,stations"
        : layer.overrideType || layer.type
  };
}

/**
 * Generates an array of MapLibreGL Source and Layer components with included popups for
 * rendering OTP2 tile data.
 *
 * @param layers          A list of layers, with some minimal config, matching what is configured on the server.
 *                        This list will be used to craft the tilejson request to OTP.
 * @param endpoint        The OTP endpoint to make the requests to
 * @param setLocation     An optional method to make from/to buttons functional. See component for more detail.
 * @param setViewedStop   An optional method to make stop viewer button functional. See component for more detail.
 * @param stopsWhitelist  An optional list of stops to display singularly. See component for more detail.
 * @param configCompanies An optional list of companies used to prettify network information.
 * @param getEntityPrefix An optional function to extract an entity prefix (e.g. to prepend a logo).
 * @param feeds           An optional list of feeds with publisher info.
 * @param closedStops     An optional list of OTP gtfsIds for stops to identify as closed.
 * @returns               Array of <Source> and <OTP2TileLayerWithPopup> components
 */
const generateOTP2TileLayers = (
  layers: LayerConfig[],
  endpoint: string,
  setLocation?: (location: MapLocationActionArg) => void,
  setViewedStop?: StopEventHandler,
  stopsWhitelist?: string[],
  configCompanies?: ConfiguredCompany[],
  getEntityPrefix?: (entity: Stop | VehicleRentalStation) => JSX.Element,
  feeds?: Feed[],
  closedStops?: Set<string>
): JSX.Element[] => {
  const [clickedEntity, setClickedEntity] = useState<ClickedEntityState | null>(
    null
  );
  const handleLayerClick = useCallback(
    (entity: ClickedEntity) => {
      if (!(clickedEntity?.entity && entity.sourceLayer === "stops")) {
        setClickedEntity({ entity });
        // Calling setClickedEntity does not cause the layers to be rerendered
        // right away because this is not a component.
        // @ts-expect-error Stop subsequent events by generating an error (clickedEntity original value is null).
        clickedEntity.entity = entity;
      }
    },
    [clickedEntity, setClickedEntity]
  );

  const clickedEntityLayer = clickedEntity?.entity?.sourceLayer;
  const editedLayers = layers.map(withFinalType);
  const tileTypes = editedLayers.map(l => l.finalType).join(",");
  return [
    <Source
      // @ts-expect-error we use a nonstandard prop
      alwaysShow
      id={SOURCE_ID}
      key={SOURCE_ID}
      type="vector"
      // Only grab the data we need based on layers defined
      url={`${endpoint}/${tileTypes}/tilejson.json`}
    />,
    ...editedLayers.map(layer => {
      const {
        color,
        finalType,
        initiallyVisible,
        minZoom,
        name,
        network,
        type
      } = layer;
      const id = `${type}${network ? `-${network}` : ""}`;
      const mutePopup = clickedEntityLayer
        ? !finalType.split(",").includes(clickedEntityLayer)
        : false;
      return (
        <OTP2TileLayerWithPopup
          closedStops={closedStops}
          color={color}
          configCompanies={configCompanies}
          feeds={feeds}
          getEntityPrefix={getEntityPrefix}
          id={id}
          key={id}
          name={name || id}
          network={network}
          minZoom={minZoom}
          mutePopup={mutePopup}
          onEntityClick={handleLayerClick}
          setLocation={setLocation}
          setViewedStop={setViewedStop}
          sourceId={SOURCE_ID}
          stopsWhitelist={stopsWhitelist}
          type={type}
          visible={initiallyVisible}
        />
      );
    })
  ];
};

export default generateOTP2TileLayers;
