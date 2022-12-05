import React from "react";

import { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
// eslint-disable-next-line prettier/prettier
import type { Company, ConfiguredCompany, Location, Station, Stop } from "@opentripplanner/types";

import { FormattedMessage, useIntl } from "react-intl";
import { flatten } from "flat";
import * as S from "./styled";

// Load the default messages.
// @ts-expect-error TODO: why is this failing?
import defaultEnglishMessages from "../i18n/en-US.yml";
import { makeDefaultGetEntityName } from "./util";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages: { [key:string]:string } = flatten(defaultEnglishMessages);

type Entity = Stop | Station
type Props = {
  configCompanies?: ConfiguredCompany[];
  getEntityName?: (entity: Entity, configCompanies: Company[],) => string;

  setLocation?: ({ location, locationType }: { location: Location, locationType: string }) => void;
  setViewedStop?: ({ stopId }: { stopId: string }) => void;

  entity: Entity
};

/**
 * Renders a map popup for a stop, scooter, or shared bike
 */
export function MapPopup({ configCompanies, entity, getEntityName, setLocation, setViewedStop, }: Props): JSX.Element {
  if (!entity) return <></>
  const intl = useIntl()

  const getNameFunc = getEntityName || makeDefaultGetEntityName(intl, defaultMessages);
  const name = getNameFunc(entity, configCompanies);

  const generateLocation = () => {
    // @ts-expect-error some of these values may be null, but that's ok
    const { lon: entityLon, lat: entityLat, x, y } = entity

    const lat = entityLat || x
    const lon = entityLon || y
    if (!lat || !lon) return null

    return { lat, lon, name };
  }

  const entityIsStationHub = "bikesAvailable" in entity && entity?.bikesAvailable !== undefined && !entity?.isFloatingBike;
  const entityIsStop = !("bikesAvailable" in entity)
  // @ts-expect-error ts doesn't understand entityIsStop
  const stopId = entityIsStop && entity?.code || entity.id.split(":")[1] || entity.id

  return (
    <BaseMapStyled.MapOverlayPopup>
      <BaseMapStyled.PopupTitle>{name}</BaseMapStyled.PopupTitle>
      {/* render dock info if it is available */}
      {entityIsStationHub && (
        <BaseMapStyled.PopupRow>
          <div>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.MapPopup.availableBikes"]
              }
              description="Label text for the number of bikes available"
              id="otpUi.MapPopup.availableBikes"
              values={{ value: entity.bikesAvailable }}
            />
          </div>
          <div>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.MapPopup.availableDocks"]
              }
              description="Label text for the number of docks available"
              id="otpUi.MapPopup.availableDocks"
              values={{ value: entity.spacesAvailable }}
            />
          </div>
        </BaseMapStyled.PopupRow>
      )}

      {/* render stop viewer link if available */}
      {setViewedStop && entityIsStop && <BaseMapStyled.PopupRow>
        <span>
          <strong>
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.MapPopup.stopId"]}
              description="Displays the stop id"
              id="otpUi.MapPopup.stopId"
              values={{
                stopId
              }}
            />
          </strong>
        </span>
        <S.ViewStopButton onClick={() => setViewedStop(stopId)}>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.MapPopup.stopViewer"]}
            description="Text for link that opens the stop viewer"
            id="otpUi.MapPopup.stopViewer"
          />
        </S.ViewStopButton>
      </BaseMapStyled.PopupRow>}

      {/* The "Set as [from/to]" ButtonGroup */}
      {setLocation && (
        <BaseMapStyled.PopupRow>
          <FromToLocationPicker
            label
            location={generateLocation()}
            setLocation={setLocation}
          />
        </BaseMapStyled.PopupRow>
      )}
    </BaseMapStyled.MapOverlayPopup>
  );
}

export default MapPopup;

// Rename styled components for export
export { S as Styled };
