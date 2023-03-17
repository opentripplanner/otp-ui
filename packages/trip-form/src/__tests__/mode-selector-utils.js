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
        default: false,
        key: "wheelchair",
        label: "Use Accessible Routing",
        type: "CHECKBOX",
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
        default: 2,
        high: 5,
        key: "walkReluctance",
        label: "Walk Reluctance",
        labelHigh: "More Transit",
        labelLow: "More Walking",
        low: 0,
        step: 0.1,
        type: "SLIDER",
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
        default: 2,
        high: 5,
        key: "bikeReluctance",
        label: "Bike Reluctance",
        labelHigh: "More Transit",
        labelLow: "More Biking",
        low: 0,
        step: 0.1,
        type: "SLIDER",
        value: 2
      },
      {
        addTransportMode: { mode: "BICYCLE", qualifier: "RENT" },
        applicableMode: "BICYCLE",
        default: true,
        key: "allowBikeRental",
        label: "Enable Bike Rental",
        type: "CHECKBOX_ADD_MODE"
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
    default: 3,
    high: 5,
    key: "carReluctance",
    label: "Car Reluctance",
    labelHigh: "More Transit",
    labelLow: "More Driving",
    low: 0,
    step: 0.1,
    type: "SLIDER"
  },
  {
    applicableMode: "BICYCLE",
    default: 2,
    high: 5,
    key: "bikeReluctance",
    label: "Bike Reluctance",
    labelHigh: "More Transit",
    labelLow: "More Biking",
    low: 0,
    step: 0.1,
    type: "SLIDER"
  },
  {
    applicableMode: "WALK",
    default: 2,
    high: 5,
    key: "walkReluctance",
    label: "Walk Reluctance",
    labelHigh: "More Transit",
    labelLow: "More Walking",
    low: 0,
    step: 0.1,
    type: "SLIDER"
  },
  {
    addTransportMode: { mode: "BICYCLE", qualifier: "RENT" },
    applicableMode: "BICYCLE",
    default: true,
    key: "allowBikeRental",
    label: "Enable Bike Rental",
    type: "CHECKBOX"
  },
  {
    applicableMode: "TRANSIT",
    default: false,
    key: "wheelchair",
    label: "Use Accessible Routing",
    type: "CHECKBOX"
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
    const modeSettingsWithValues = populateSettingsWithValues(
      modeSettingDefinitions,
      extractModeSettingDefaultsToObject(modeSettingDefinitions)
    );
    it("should work for basic set of buttons and settings", () => {
      expect(
        getActivatedModesFromQueryParams(
          "?modeButtons=TRANSIT_WALK_BIKE_CAR&modeSettings=carReluctance-3_bikeReluctance-2_walkReluctance-3.4_allowBikeRental-true_wheelchair-true",
          modeButtonDefinitions,
          modeSettingDefinitions,
          {}
        )
      ).toMatchSnapshot();
    });
    it("should work with some other parameters that we don't need", () => {
      expect(
        getActivatedModesFromQueryParams(
          "?modeButtons=TRANSIT_WALK&foo=bar&mode=notamode&mode=anothermode",
          modeButtonDefinitions,
          modeSettingDefinitions,
          {}
        )
      ).toEqual({
        activeModes: [{ mode: "BUS" }, { mode: "RAIL" }, { mode: "WALK" }],
        modeSettings: modeSettingsWithValues
      });
    });
    it("should ignore modes and settings that are not defined", () => {
      expect(
        getActivatedModesFromQueryParams(
          "?modeButtons=undefinedMode_WALK&modeSettings=bungeeJumping-true",
          modeButtonDefinitions,
          modeSettingDefinitions,
          {}
        )
      ).toEqual({
        activeModes: [{ mode: "WALK" }],
        modeSettings: modeSettingsWithValues
      });
    });
  });
});
