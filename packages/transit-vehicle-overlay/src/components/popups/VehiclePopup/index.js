// Removed as core-utils is typescripted. TODO: Remove when typescripting!
/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import { FormattedDate, FormattedMessage } from "react-intl";
import { Popup } from "react-leaflet";

import { PopupStyle } from "../styled";
import VehicleTracker from "../vehicle-tracker";
import { defaultMessages, linterIgnoreTheseProps } from "../../../utils";
import FormattedDurationWithSeconds from "../../../utils/formatted-duration-with-seconds";

/**
 * view component for vehicle marker popup
 * content is derived from the vehicle record
 */
export default function VehiclePopup({ isTracked, setTracked, vehicle }) {
  const {
    blockId,
    reportDate,
    routeLongName,
    seconds,
    status,
    stopId,
    stopSequence,
    tripId,
    vehicleId
  } = vehicle;
  let displayedStatus;
  if (status === "IN_TRANSIT_TO") {
    displayedStatus = (
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitVehicleOverlay.statusEnRoute"]
        }
        description="Text shown for a moving transit vehicle"
        id="otpUi.TransitVehicleOverlay.statusEnRoute"
        values={{ stopId }}
      />
    );
  } else if (status === "STOPPED_AT") {
    if (stopSequence === 1) {
      displayedStatus = (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TransitVehicleOverlay.statusAtStart"]
          }
          description="Text shown for a transit vehicle at the beginning of the line"
          id="otpUi.TransitVehicleOverlay.statusAtStart"
          values={{ stopId }}
        />
      );
    } else {
      displayedStatus = (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TransitVehicleOverlay.statusAtStop"]
          }
          description="Text shown for a transit vehicle stopped at a stop"
          id="otpUi.TransitVehicleOverlay.statusAtStop"
          values={{ stopId }}
        />
      );
    }
  } else {
    displayedStatus = (
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitVehicleOverlay.statusUnknown"]
        }
        description="Text shown for an unknown status"
        id="otpUi.TransitVehicleOverlay.statusUnknown"
      />
    );
  }

  const isMultipleVehicles = vehicleId.indexOf("+") > 0;
  const vehicleMessageValues = isMultipleVehicles
    ? {
        count: 2,
        // TODO: ideally you would want to use the equivalent of the comma of the desired language.
        vehicleIds: vehicleId.replace(/\+/g, ", ")
      }
    : {
        count: 1,
        vehicleIds: vehicleId
      };

  return (
    <Popup>
      <PopupStyle>
        <PopupStyle.Title>{routeLongName}</PopupStyle.Title>
        <PopupStyle.Span>
          <FormattedMessage
            defaultMessage={
              defaultMessages["otpUi.TransitVehicleOverlay.lastSeen"]
            }
            description="Text describing how long ago a transit vehicle last reported its status"
            id="otpUi.TransitVehicleOverlay.lastSeen"
            values={{
              durationText: (
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.TransitVehicleOverlay.durationAgo"]
                  }
                  description="Text describing a past duration"
                  id="otpUi.TransitVehicleOverlay.durationAgo"
                  values={{
                    duration: <FormattedDurationWithSeconds seconds={seconds} />
                  }}
                />
              )
            }}
          />
        </PopupStyle.Span>
        <PopupStyle.Span>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.TransitVehicleOverlay.date"]}
            description="Text describing when a transit vehicle last reported its status"
            id="otpUi.TransitVehicleOverlay.date"
            values={{
              date: <FormattedDate value={reportDate} />
            }}
          />
        </PopupStyle.Span>
        <PopupStyle.Span>
          <FormattedMessage
            defaultMessage={
              defaultMessages["otpUi.TransitVehicleOverlay.status"]
            }
            description="Text describing the status of a transit vehicle"
            id="otpUi.TransitVehicleOverlay.status"
            values={{ status: displayedStatus }}
          />
        </PopupStyle.Span>
        <PopupStyle.Span>
          <FormattedMessage
            defaultMessage={
              defaultMessages["otpUi.TransitVehicleOverlay.tripAndBlockIds"]
            }
            description="Text showing a transit vehicle trip and block ids"
            id="otpUi.TransitVehicleOverlay.tripAndBlockIds"
            values={{ blockId, tripId }}
          />
        </PopupStyle.Span>
        <PopupStyle.Span>
          <FormattedMessage
            defaultMessage={
              defaultMessages["otpUi.TransitVehicleOverlay.vehicleIds"]
            }
            description="Displays transit vehicle numbers"
            id="otpUi.TransitVehicleOverlay.vehicleIds"
            values={vehicleMessageValues}
          />
        </PopupStyle.Span>
        <VehicleTracker
          isTracked={isTracked}
          setTracked={setTracked}
          vehicle={vehicle}
        />
      </PopupStyle>
    </Popup>
  );
}

VehiclePopup.propTypes = {
  /** indicate if this vehicle is being tracked, */
  isTracked: PropTypes.bool,

  /** callback which forwards the vehicle and tracking status from track button */
  setTracked: PropTypes.func,

  /** vehicle record - @see: core-utils/types/transitVehicleType */
  // TODO: add typescript
  // vehicle: coreUtils.types.transitVehicleType,
  vehicle: PropTypes.object
};

VehiclePopup.defaultProps = {
  isTracked: false,
  setTracked: (vehicle, isTracked) => {
    linterIgnoreTheseProps(vehicle, isTracked);
  },
  vehicle: null
};
