import React, { useState } from "react";
import BaseMap from "@opentripplanner/base-map";
import generateOTP2TileLayers from ".";

export default {
  parameters: { storyshots: { disable: true } },
  title: "OTP2 Tile Layer"
};

export const OtpTileLayerFromYourOwnServer = (): JSX.Element => {
  const [endpoint, setEndpoint] = useState("");
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        OTP2 Server with stops layers enabled:{" "}
        <input
          onChange={e => setEndpoint(e.target.value)}
          placeholder="http://localhost:8001/otp"
          value={endpoint}
        />
      </label>
      <BaseMap center={[0, 0]} style={{ height: "80vh" }} zoom={3}>
        {generateOTP2TileLayers(
          [{ type: "stops" }, { type: "areaStops" }],
          `${endpoint}/routers/default/vectorTiles`
        )}
      </BaseMap>
    </>
  );
};

export const MockStopStationTileLayersPHL = (args: {
  stationsColor: string;
  stopsColor: string;
}): JSX.Element => (
  <BaseMap center={[39.9526, -75.1652]} style={{ height: "80vh" }} zoom={14}>
    {generateOTP2TileLayers(
      [
        {
          color: args.stopsColor,
          initiallyVisible: true,
          type: "stops"
        },
        {
          color: args.stationsColor,
          initiallyVisible: true,
          type: "stations"
        }
      ],
      "http://localhost:5555/phl/otp/routers/default/vectorTiles"
    )}
  </BaseMap>
);
MockStopStationTileLayersPHL.args = {
  stationsColor: "#66ccff",
  stopsColor: "#fff"
};

export const MockStopStationCombinedLayerPHL = (): JSX.Element => (
  <BaseMap center={[39.9526, -75.1652]} style={{ height: "80vh" }} zoom={14}>
    {generateOTP2TileLayers(
      [
        {
          initiallyVisible: true,
          type: "OTP-UI-stopsAndStations"
        }
      ],
      "http://localhost:5555/phl/otp/routers/default/vectorTiles"
    )}
  </BaseMap>
);

export const MockAreaStopTileLayerATL = (): JSX.Element => (
  <BaseMap center={[33.76339, -84.44089]} style={{ height: "80vh" }} zoom={13}>
    {generateOTP2TileLayers(
      [
        { initiallyVisible: true, minZoom: 12, type: "stops" },
        { initiallyVisible: true, minZoom: 12, type: "areaStops" }
      ],
      "http://localhost:5555/atl/otp/routers/default/vectorTiles"
    )}
  </BaseMap>
);
