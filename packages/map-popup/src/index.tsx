import React, { useCallback } from "react";

import { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
// eslint-disable-next-line prettier/prettier
import type { Company, ConfiguredCompany, Location, Station, Stop } from "@opentripplanner/types";

import { FormattedMessage, useIntl } from "react-intl";
import { flatten } from "flat";
import * as S from "./styled";

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
    <BaseMapStyled.PopupRow>
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
    </BaseMapStyled.PopupRow>
  )
}

const StopDetails = ({ id, setViewedStop }: { id: string, setViewedStop: () => void; }) => {
  return (
    <BaseMapStyled.PopupRow>
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
      <S.ViewStopButton onClick={setViewedStop}>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.MapPopup.stopViewer"]}
          description="Text for link that opens the stop viewer"
          id="otpUi.MapPopup.stopViewer"
        />
      </S.ViewStopButton>
    </BaseMapStyled.PopupRow>
  )
}

type Entity = Stop | Station
type Props = {
  configCompanies?: ConfiguredCompany[];
  entity: Entity
  getEntityName?: (entity: Entity, configCompanies: Company[],) => string;
  setLocation?: ({ location, locationType }: { location: Location, locationType: string }) => void;
  setViewedStop?: ({ stopId }: { stopId: string }) => void;
};

/**
 * Renders a map popup for a stop, scooter, or shared bike
 */
export function MapPopup({ configCompanies, entity, getEntityName, setLocation, setViewedStop }: Props): JSX.Element {
  const intl = useIntl()
  if (!entity) return <></>

  const getNameFunc = getEntityName || makeDefaultGetEntityName(intl, defaultMessages);
  const name = getNameFunc(entity, configCompanies);


  const bikesAvailablePresent = "bikesAvailable" in entity
  const entityIsStationHub = bikesAvailablePresent && entity?.bikesAvailable !== undefined && !entity?.isFloatingBike;
  // @ts-expect-error ts doesn't understand entityIsStop
  const stopId = !bikesAvailablePresent && entity?.code || entity.id.split(":")[1] || entity.id

  return (
    <BaseMapStyled.MapOverlayPopup>
      <BaseMapStyled.PopupTitle>{name}</BaseMapStyled.PopupTitle>
      {/* render dock info if it is available */}
      {entityIsStationHub && <StationHubDetails station={entity} />}

      {/* render stop viewer link if available */}
      {setViewedStop && !bikesAvailablePresent && <StopDetails id={stopId} setViewedStop={useCallback(() => setViewedStop({ stopId: entity.id }), [entity.id])} />}

      {/* The "Set as [from/to]" ButtonGroup */}
      {setLocation && (
        <BaseMapStyled.PopupRow>
          <FromToLocationPicker
            label
            location={generateLocation(entity, name)}
            setLocation={setLocation}
          />
        </BaseMapStyled.PopupRow>
      )}
    </BaseMapStyled.MapOverlayPopup>
  );
}

export default MapPopup;

// Rename styled components for export.
export { S as Styled };
