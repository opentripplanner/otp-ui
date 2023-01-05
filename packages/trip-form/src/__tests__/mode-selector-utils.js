import {
  addSettingsToButton,
  aggregateModes,
  checkIfModeSettingApplies,
  extractModeSettingDefaultsToObject,
  filterModeDefitionsByKey,
  getActivatedModesFromQueryParams,
  populateSettingsWithValues
} from "../MetroModeSelector/utils";

const modeButtonDefinitions = [
  {
    label: "Transit",
    key: "TRANSIT",
    modes: [
      {
        mode: "BUS"
      },
      {
        mode: "RAIL"
      }
    ],
    enabled: true,
    modeSettings: [
      {
        applicableMode: "TRANSIT",
        type: "CHECKBOX",
        key: "wheelchair",
        default: false,
        label: "Use Accessible Routing",
        value: false
      }
    ]
  },
  {
    label: "Walking",
    Icon: {},
    key: "WALK",
    modes: [
      {
        mode: "WALK"
      }
    ],
    enabled: true,
    modeSettings: [
      {
        applicableMode: "WALK",
        type: "SLIDER",
        key: "walkReluctance",
        default: 2,
        low: 0,
        high: 5,
        step: 0.1,
        label: "Walk Reluctance",
        labelLow: "More Walking",
        labelHigh: "More Transit",
        value: 2
      }
    ]
  },
  {
    label: "Bike",
    Icon: {},
    key: "BIKE",
    modes: [
      {
        mode: "BICYCLE"
      }
    ],
    enabled: true,
    modeSettings: [
      {
        applicableMode: "BICYCLE",
        type: "SLIDER",
        key: "bikeReluctance",
        default: 2,
        low: 0,
        high: 5,
        step: 0.1,
        label: "Bike Reluctance",
        labelLow: "More Biking",
        labelHigh: "More Transit",
        value: 2
      },
      {
        applicableMode: "BICYCLE",
        type: "CHECKBOX_ADD_MODE",
        key: "allowBikeRental",
        default: true,
        addMode: {
          mode: "BICYCLE",
          qualifier: "RENT"
        },
        label: "Enable Bike Rental"
      }
    ]
  }
];

const modeButtonsWithoutSettings = modeButtonDefinitions.map(b => ({
  ...b,
  modeSettings: null
}));

const modeSettingDefinitions = [
  {
    applicableMode: "CAR",
    type: "SLIDER",
    key: "carReluctance",
    default: 3,
    low: 0,
    high: 5,
    step: 0.1,
    label: "Car Reluctance",
    labelLow: "More Driving",
    labelHigh: "More Transit"
  },
  {
    applicableMode: "BICYCLE",
    type: "SLIDER",
    key: "bikeReluctance",
    default: 2,
    low: 0,
    high: 5,
    step: 0.1,
    label: "Bike Reluctance",
    labelLow: "More Biking",
    labelHigh: "More Transit"
  },
  {
    applicableMode: "WALK",
    type: "SLIDER",
    key: "walkReluctance",
    default: 2,
    low: 0,
    high: 5,
    step: 0.1,
    label: "Walk Reluctance",
    labelLow: "More Walking",
    labelHigh: "More Transit"
  },
  {
    applicableMode: "BICYCLE",
    type: "CHECKBOX_ADD_MODE",
    key: "allowBikeRental",
    default: true,
    addMode: {
      mode: "BICYCLE",
      qualifier: "RENT"
    },
    label: "Enable Bike Rental"
  },
  {
    applicableMode: "TRANSIT",
    type: "CHECKBOX",
    key: "wheelchair",
    default: false,
    label: "Use Accessible Routing"
  }
];

const valueObject = {
  carReluctance: 3,
  bikeReluctance: 2,
  walkReluctance: 2,
  allowBikeRental: true,
  wheelchair: false
};

function stringsToTransportModes(strs) {
  return strs.map(str => ({
    mode: str
  }));
}

describe("mode selector utils", () => {
  describe("aggregate modes", () => {
    it("should aggregate the modes, excluding duplicates", () => {
      expect(aggregateModes(modeButtonDefinitions)).toEqual(
        stringsToTransportModes(["BUS", "RAIL", "WALK", "BICYCLE"])
      );
    });
  });
  describe("filter mode buttons by key", () => {
    it("should filter the mode buttons by a list of keys", () => {
      expect(
        filterModeDefitionsByKey(modeButtonDefinitions, ["BIKE", "WALK"])
      ).toEqual([modeButtonDefinitions[1], modeButtonDefinitions[2]]);
    });
  });

  describe("populate mode settings with values", () => {
    it("should populate settings with values", () => {
      expect(
        populateSettingsWithValues(modeSettingDefinitions, valueObject)
      ).toMatchSnapshot();
    });
  });

  describe("extract mode setting defaults to object", () => {
    it("should extract defaults from the mode settings", () => {
      expect(
        extractModeSettingDefaultsToObject(modeSettingDefinitions)
      ).toMatchSnapshot();
    });
  });

  describe("check if mode settings apply to the button", () => {
    it("should return false for these", () => {
      expect(
        checkIfModeSettingApplies(modeSettingDefinitions[0], {
          mode: "TRANSIT"
        })
      ).toBeFalsy();
      expect(
        checkIfModeSettingApplies(modeSettingDefinitions[4], {
          mode: "BICYCLE"
        })
      ).toBeFalsy();
      expect(
        checkIfModeSettingApplies(modeSettingDefinitions[1], {
          mode: "BUS"
        })
      ).toBeFalsy();
    });
    it("should return true for these", () => {
      expect(
        checkIfModeSettingApplies(modeSettingDefinitions[0], {
          mode: "CAR"
        })
      ).toBeTruthy();
      expect(
        checkIfModeSettingApplies(modeSettingDefinitions[4], {
          mode: "TRANSIT"
        })
      ).toBeTruthy();
      expect(
        checkIfModeSettingApplies(modeSettingDefinitions[4], {
          mode: "BUS"
        })
      ).toBeTruthy();
    });
  });

  describe("check add settings to button", () => {
    it("should add applicable mode settings to the buttons", () => {
      expect(
        modeButtonsWithoutSettings.map(
          addSettingsToButton(modeSettingDefinitions)
        )
      ).toMatchSnapshot();
    });
  });

  describe("get activated modes and settings from query params", () => {
    it("should work for basic set of buttons and settings", () => {
      expect(
        getActivatedModesFromQueryParams(
          "?modeButtons=transit_walk_bike_car&modeSettings=carReluctance-3_bikeReluctance-2_walkReluctance-3.4_allowBikeRental-true_wheelchair-true",
          modeButtonDefinitions,
          modeSettingDefinitions,
          {}
        )
      ).toMatchSnapshot();
    });
    it("should work with some other parameters that we don't need", () => {
      expect(
        getActivatedModesFromQueryParams(
          "?modeButtons=transit_walk_bike_car&foo=bar&mode=notamode&mode=anothermode",
          modeButtonDefinitions,
          modeSettingDefinitions,
          {}
        )
      ).toMatchSnapshot();
    });
  });
});
