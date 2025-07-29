import React, { useCallback } from "react";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import coreUtils from "@opentripplanner/core-utils";

// eslint-disable-next-line prettier/prettier
import type { Company, ConfiguredCompany, Location, Stop, StopEventHandler } from "@opentripplanner/types";
import { RentalVehicle, VehicleRentalStation } from "@opentripplanner/types/otp2";

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

const StationHubDetails = ({ availableVehicles, availableSpaces }: { availableVehicles: number, availableSpaces: number }) => {
  return (
    <Styled.PopupRow>
      <div>
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.MapPopup.availableBikes"]
          }
          description="Label text for the number of bikes available"
          id="otpUi.MapPopup.availableBikes"
          values={{ value: availableVehicles }}
        />
      </div>
      <div>
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.MapPopup.availableDocks"]
          }
          description="Label text for the number of docks available"
          id="otpUi.MapPopup.availableDocks"
          values={{ value: availableSpaces }}
        />
      </div>
    </Styled.PopupRow>
  )
}

const StopDetails = ({ id, setViewedStop }: { id: string, setViewedStop: () => void; }) => {
  return (
    <Styled.PopupRow>
      {id &&
        <strong>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.MapPopup.stopId"]}
            description="Displays the stop id"
            id="otpUi.MapPopup.stopId"
            values={{
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

type Entity = Stop | VehicleRentalStation | RentalVehicle
type Props = {
  closePopup?: (arg?: any) => void
  configCompanies?: ConfiguredCompany[];
  entity: Entity
  getEntityName?: (entity: Entity, configCompanies: Company[],) => string;
  getEntityPrefix?: (entity: Entity) => JSX.Element
  setLocation?: ({ location, locationType }: { location: Location, locationType: string }) => void;
  setViewedStop?: StopEventHandler;
};

const entityIsStop = (entity: Entity): entity is Stop => "gtfsId" in entity;

/**
 * Renders a map popup for a stop, scooter, or shared bike
 */
export function MapPopup({ closePopup = () => {}, configCompanies, entity, getEntityName, getEntityPrefix, setLocation, setViewedStop }: Props): JSX.Element {

  const intl = useIntl()
  if (!entity) return <></>

  const getNameFunc = getEntityName || makeDefaultGetEntityName(intl, defaultMessages);
  const name = getNameFunc(entity, configCompanies);

  const stationNetwork = "rentalNetwork" in entity && (coreUtils.itinerary.getCompaniesLabelFromNetworks(entity?.rentalNetwork.networkId, configCompanies) || entity?.rentalNetwork.networkId);

  const vehiclesAvailable = "availableVehicles" in entity;
  const entityIsStationHub = vehiclesAvailable && entity?.availableVehicles !== undefined;
  const stopId = entityIsStop(entity) ? entity.code : "";
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
      {entityIsStationHub && <StationHubDetails availableSpaces={entity.availableSpaces.total} availableVehicles={entity.availableVehicles.total} />}

      {/* render stop viewer link if available */}
      {setViewedStop && entityIsStop(entity) && (
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