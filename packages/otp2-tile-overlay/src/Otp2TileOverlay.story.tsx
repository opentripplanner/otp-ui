import React, { useState } from "react";
import BaseMap from "@opentripplanner/base-map";
import generateOTP2TileLayers from ".";

export default {
  parameters: { storyshots: { disable: true } },
  title: "OTP2 Tile Layer"
};

// TODO: Add a story to illustrate "color" prop passed from overlay.

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

export const MockStopTileLayerPHL = (): JSX.Element => (
  <BaseMap center={[39.9526, -75.1652]} style={{ height: "80vh" }} zoom={14}>
    {generateOTP2TileLayers(
      [{ initiallyVisible: true, minZoom: 5, type: "stops" }],
      "http://localhost:5555/phl/otp/routers/default/vectorTiles"
    )}
  </BaseMap>
);

export const MockAreaStopTileLayerATL = (): JSX.Element => (
  <BaseMap center={[33.719, -84.298]} style={{ height: "80vh" }} zoom={12}>
    {generateOTP2TileLayers(
      [{ initiallyVisible: true, minZoom: 5, type: "areaStops" }],
      "http://localhost:5555/atl/otp/routers/default/vectorTiles"
    )}
  </BaseMap>
);
