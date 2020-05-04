import React from "react";
import { create, act } from "react-test-renderer";

import * as utils from "../utils";

const line = require("../../__mocks__/line100.json");

const vehicleData = line;
const initVehicle = utils.findVehicleById(vehicleData, "9562512");

describe("util > vehicles and patterns", () => {
  it("find vehciles", () => {
    expect(initVehicle).toMatchSnapshot();
  });
});

// TODO ... more tests, especially testing presentation (and different states presented)
