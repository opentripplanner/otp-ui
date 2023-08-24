import {
  addSettingsToButton,
  aggregateModes,
  checkIfModeSettingApplies,
  convertModeSettingValue,
  extractModeSettingDefaultsToObject,
  filterModeDefitionsByKey,
  populateSettingWithValue
} from "../MetroModeSelector/utils";

const modeButtonDefinitions = [
  {
    enabled: true,
    key: "TRANSIT",
    label: "Transit",
    modes: [{ mode: "BUS" }, { mode: "RAIL" }],
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
    enabled: true,
    label: "Walking",
    Icon: {},
    key: "WALK",
    modes: [
      {
        mode: "WALK"
      }
    ],
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
    enabled: true,
    label: "Bike",
    Icon: {},
    key: "BIKE",
    modes: [
      {
        mode: "BICYCLE"
      }
    ],
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
  allowBikeRental: true,
  bikeReluctance: 2,
  carReluctance: 3,
  walkReluctance: 2,
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
        modeSettingDefinitions.map(populateSettingWithValue(valueObject))
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

    describe("check type conversion of mode setting value", () => {
      it("should convert to number", () => {
        expect(convertModeSettingValue(modeSettingDefinitions[0], 4)).toBe(4);
      });
      it("should convert to boolean", () => {
        expect(
          convertModeSettingValue(modeSettingDefinitions[4], "false")
        ).toBeFalsy();
      });
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
});
