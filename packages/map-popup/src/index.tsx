import React, { useCallback } from "react";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";

// eslint-disable-next-line prettier/prettier
import type {
  Company,
  ConfiguredCompany,
  Location,
  Stop,
  StopEventHandler,
  TileLayerStation
} from "@opentripplanner/types";

import { FocusTrapWrapper } from "@opentripplanner/building-blocks";
import { flatten } from "flat";
import { FormattedMessage, useIntl } from "react-intl";
import { Styled } from "@opentripplanner/base-map";

import { Entity, getNetwork, makeDefaultGetEntityName, type StopIdAgencyMap } from "./util";
import { ViewStopButton } from "./styled";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages: { [key: string]: string } = flatten(defaultEnglishMessages);

export type Feed = {
  feedId: string;
  publisher: {
    name: string;
  };
};


const generateLocation = (entity: Entity, name: string) => {
  // @ts-expect-error some of these values may be null, but that's ok
  const { lon: entityLon, lat: entityLat, x, y } = entity

  const lat = entityLat || y
  const lon = entityLon || x
  if (!lat || !lon) return null

  return { lat, lon, name };
}

const StationHubDetails = ({ station }: { station: TileLayerStation }) => {
  return (
    <Styled.PopupRow>
      <div>
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.MapPopup.availableBikes"]
          }
          description="Label text for the number of bikes available"
          id="otpUi.MapPopup.availableBikes"
          values={{ value: station.vehiclesAvailable }}
        />
      </div>
      <div>
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.MapPopup.availableDocks"]
          }
          description="Label text for the number of docks available"
          id="otpUi.MapPopup.availableDocks"
          values={{ value: station.spacesAvailable }}
        />
      </div>
    </Styled.PopupRow>
  )
}

const StopDetails = ({ id, feedName, setViewedStop }: { id: string, feedName?: string, setViewedStop: () => void; }) => {
  return (
    <Styled.PopupRow>
      {id &&
        <strong>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.MapPopup.stopId"]}
            description="Displays the stop id"
            id="otpUi.MapPopup.stopId"
            values={{
              feedName,
              stopId: id
            }}
          />
        </strong>}
      <ViewStopButton onClick={setViewedStop} stopId={id}> 
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.MapPopup.stopViewer"]}
          description="Text for link that opens the stop viewer"
          id="otpUi.MapPopup.stopViewer"
        />
      </ViewStopButton>
    </Styled.PopupRow>
  )
}

type Props = {
  closePopup?: (arg?: boolean) => void
  configCompanies?: ConfiguredCompany[];
  entity: Entity
  getEntityName?: (entity: Entity, configCompanies: Company[], feedName?: string, includeParenthetical?: boolean) => string;
  getEntityPrefix?: (entity: Entity) => JSX.Element
  feeds?: Feed[]
  setLocation?: ({ location, locationType }: { location: Location, locationType: string }) => void;
  setViewedStop?: StopEventHandler;
};

function entityIsStation(entity: Entity): entity is TileLayerStation {
  return "vehiclesAvailable" in entity
}

/**
 * Renders a map popup for a stop, scooter, or shared bike
 */
export function MapPopup({ 
  closePopup = () => {}, 
  configCompanies, 
  entity, 
  getEntityName, 
  getEntityPrefix, 
  setLocation, 
  setViewedStop, 
  feeds,
}: Props): JSX.Element {

  const intl = useIntl()
  if (!entity) return <></>

  const getNameFunc = getEntityName || makeDefaultGetEntityName(intl, defaultMessages);
  
  // Find the feed name using the logic from generateLabel in otp.ts
  let feedName: string | undefined;
  if (feeds && entity.id) {
    const feedId = entity.id.split(":")[0];
    const feed = feeds.find(f => f.feedId === feedId);
    feedName = feed?.publisher?.name;
  }
  
  const name = getNameFunc(entity, configCompanies, feedName);
  const titleName = getNameFunc(entity, configCompanies, feedName, false);

  const stationNetwork = getNetwork(entity, configCompanies);

  const bikesAvailablePresent = entityIsStation(entity)
  const entityIsStationHub = bikesAvailablePresent && entity.vehiclesAvailable !== undefined && !entity.isFloatingBike;
  const stopId = !bikesAvailablePresent && "code" in entity && entity.code;
  const id = `focus-${encodeURIComponent(entity.id).replace(/%/g, "")}-popup`

  return (
    <Styled.MapOverlayPopup>
      <FocusTrapWrapper closePopup={closePopup} id={id}>
      <Styled.PopupTitle>
        {getEntityPrefix && getEntityPrefix(entity)}
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.MapPopup.popupTitle"]}
          description="Text for title of the popup, contains an optional company name"
          id="otpUi.MapPopup.popupTitle"
          values={{ name: titleName, stationNetwork }}
        />
      </Styled.PopupTitle>
      {/* render dock info if it is available */}
      {entityIsStationHub && <StationHubDetails station={entity} />}

      {/* render stop viewer link if available */}
      {setViewedStop && !bikesAvailablePresent && (
        <StopDetails
          id={stopId}
          feedName={feedName}
          setViewedStop={useCallback(() => setViewedStop(entity as Stop), [entity])}
        />
      )}

      {/* The "Set as [from/to]" ButtonGroup */}
      {setLocation && (
        <Styled.PopupRow>
          <FromToLocationPicker
            label
            location={generateLocation(entity, name)}
            setLocation={setLocation}
          />
        </Styled.PopupRow>
      )}
      </FocusTrapWrapper>
      
    </Styled.MapOverlayPopup>
  );
}

export default MapPopup;
export { type StopIdAgencyMap };