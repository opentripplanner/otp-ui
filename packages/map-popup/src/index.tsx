import React, { useCallback } from "react";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import coreUtils from "@opentripplanner/core-utils";

// eslint-disable-next-line prettier/prettier
import type { Company, ConfiguredCompany, Location, Station, Stop, StopEventHandler } from "@opentripplanner/types";

import { FocusTrapWrapper } from "@opentripplanner/building-blocks";
import { flatten } from "flat";
import { FormattedMessage, useIntl } from "react-intl";
import { Styled } from "@opentripplanner/base-map";

import { ViewStopButton } from "./styled";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";
import { makeDefaultGetEntityName } from "./util";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages: { [key: string]: string } = flatten(defaultEnglishMessages);

const generateLocation = (entity: Entity, name: string) => {
  // @ts-expect-error some of these values may be null, but that's ok
  const { lon: entityLon, lat: entityLat, x, y } = entity

  const lat = entityLat || y
  const lon = entityLon || x
  if (!lat || !lon) return null

  return { lat, lon, name };
}

const StationHubDetails = ({ station }: { station: Station }) => {
  return (
    <Styled.PopupRow>
      <div>
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.MapPopup.availableBikes"]
          }
          description="Label text for the number of bikes available"
          id="otpUi.MapPopup.availableBikes"
          values={{ value: station.bikesAvailable }}
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

const StopDetails = ({ id, setViewedStop }: { id: string, setViewedStop: () => void; }) => {
  return (
    <Styled.PopupRow>
      <strong>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.MapPopup.stopId"]}
          description="Displays the stop id"
          id="otpUi.MapPopup.stopId"
          values={{
            stopId: id
          }}
        />
      </strong>
      <ViewStopButton onClick={setViewedStop}>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.MapPopup.stopViewer"]}
          description="Text for link that opens the stop viewer"
          id="otpUi.MapPopup.stopViewer"
        />
      </ViewStopButton>
    </Styled.PopupRow>
  )
}

type Entity = Stop | Station
type Props = {
  closePopup?: (arg?: any) => void
  configCompanies?: ConfiguredCompany[];
  entity: Entity
  getEntityName?: (entity: Entity, configCompanies: Company[],) => string;
  getEntityPrefix?: (entity: Entity) => JSX.Element
  setLocation?: ({ location, locationType }: { location: Location, locationType: string }) => void;
  setViewedStop?: StopEventHandler;
};

function entityIsStation(entity: Entity): entity is Station {
  return "bikesAvailable" in entity
}

/**
 * Renders a map popup for a stop, scooter, or shared bike
 */
export function MapPopup({ closePopup = () => {}, configCompanies, entity, getEntityName, getEntityPrefix, setLocation, setViewedStop }: Props): JSX.Element {

  const intl = useIntl()
  if (!entity) return <></>

  const getNameFunc = getEntityName || makeDefaultGetEntityName(intl, defaultMessages);
  const name = getNameFunc(entity, configCompanies);

  const stationNetwork = "networks" in entity && (coreUtils.itinerary.getCompaniesLabelFromNetworks(entity?.networks || [], configCompanies) || entity?.networks?.[0]);

  const bikesAvailablePresent = entityIsStation(entity)
  const entityIsStationHub = bikesAvailablePresent && entity?.bikesAvailable !== undefined && !entity?.isFloatingBike;
  const stopId = !bikesAvailablePresent && entity?.code || entity.id.split(":")[1] || entity.id

  // Double quotes make the query invalid, so remove them from the id just in case
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
          values={{ name, stationNetwork }}
        />
      </Styled.PopupTitle>
      {/* render dock info if it is available */}
      {entityIsStationHub && <StationHubDetails station={entity} />}

      {/* render stop viewer link if available */}
      {setViewedStop && !bikesAvailablePresent && (
        <StopDetails
          id={stopId}
          setViewedStop={useCallback(() => setViewedStop(entity), [entity])}
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