import {
  Bus,
  Car,
  PersonWalking,
  Train,
  TrainSubway,
  TrainTram
} from "@styled-icons/fa-solid";

import { ModeButtonDefinition, ModeSetting } from "@opentripplanner/types";

import { ClassicBike } from "@opentripplanner/icons/src/classic";
import React from "react";

export const defaultModeButtonDefinitions: ModeButtonDefinition[] = [
  {
    Icon: Bus,
    iconName: "bus",
    key: "transit",
    label: "Transit",
    modes: [{ mode: "TRANSIT" }]
  },
  {
    Icon: PersonWalking,
    iconName: "person-walking",
    key: "walk",
    label: "Walk",
    modes: [{ mode: "WALK" }]
  },
  {
    // Using TriMet icon here to illustrate the use of fillModeIcons prop.
    Icon: ClassicBike,
    iconName: "bicycle",
    key: "bicycle",
    label: "Bike",
    modes: [{ mode: "BICYCLE" }]
  },
  {
    Icon: Car,
    iconName: "car",
    key: "car",
    label: "Car",
    modes: [{ mode: "CAR" }]
  }
];
// TODO: add more test settings?
export const modeSettingDefinitionsWithDropdown: ModeSetting[] = [
  {
    applicableMode: "TRANSIT",
    default: "blue",
    key: "busColor",
    label: "Bus Color",
    options: [{ value: "blue", text: "Blue" }],
    type: "DROPDOWN"
  },
  {
    applicableMode: "TRANSIT",
    default: true,
    key: "tram",
    iconName: "tram",
    label: "Tram",
    addTransportMode: {
      mode: "TRAM"
    },
    type: "SUBMODE"
  },
  {
    applicableMode: "TRANSIT",
    default: true,
    key: "bus",
    label: "MARTA Rail",
    iconName: "bus",
    addTransportMode: {
      mode: "BUS"
    },
    type: "SUBMODE"
  },
  {
    applicableMode: "TRANSIT",
    default: true,
    key: "subway",
    label: "Subway",
    iconName: "subway",
    addTransportMode: {
      mode: "SUBWAY"
    },
    type: "SUBMODE"
  },
  {
    applicableMode: "TRANSIT",
    default: true,
    key: "ferry",
    label: "Ferry",
    addTransportMode: {
      mode: "FERRY"
    },
    type: "SUBMODE"
  }
];

export const getIcon = (iconName: string): JSX.Element | null => {
  switch (iconName) {
    case "bus":
      return <Bus />;
    case "tram":
      return <TrainTram />;
    case "subway":
      return <TrainSubway />;
    case "train":
      return <Train />;
    default:
      return null;
  }
};
