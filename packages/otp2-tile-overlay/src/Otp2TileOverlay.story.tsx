import React, { useState } from "react";
import BaseMap from "@opentripplanner/base-map";
import generateOTP2TileLayers from ".";

export default {
  parameters: { storyshots: { disable: true } },
  title: "OTP2 Tile Layer"
};

// TODO: Add a story to illustrate "color" prop passed from overlay.

export const OtpTileLayerWithYourOwnServer = (): JSX.Element => {
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

export const OtpStopTileLayerPHL = (): JSX.Element => (
  <>
    <code>http://localhost:5555/otp</code> mocks some stop tiles in downtown
    Philadelphia (near City Hall).
    <BaseMap center={[39.9526, -75.1652]} style={{ height: "80vh" }} zoom={14}>
      {generateOTP2TileLayers(
        [{ initiallyVisible: true, minZoom: 5, type: "stops" }],
        "http://localhost:5555/otp/routers/default/vectorTiles"
      )}
    </BaseMap>
  </>
);
