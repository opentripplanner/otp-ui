import React, { useState } from "react";
import BaseMap from "@opentripplanner/base-map";
import generateOTP2TileLayers from ".";

export default {
  title: "OTP2 Tile Layer",
  parameters: { storyshots: { disable: true } }
};

// TODO: Add a story to illustrate "color" prop passed from overlay.

export const OtpTileLayer = (): JSX.Element => {
  const [endpoint, setEndpoint] = useState("https://fake-otp-server.com/otp");
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        OTP2 Server with stops layer enabled
        <input
          onChange={e => setEndpoint(e.target.value)}
          placeholder="http://localhost:8001/otp"
          value={endpoint}
        />
      </label>
      <pre style={{ display: "inline", paddingLeft: 5 }}>
        https://fake-otp-server.com/otp
      </pre>{" "}
      mocks downtown Philadelphia stop tile data. Check stops in the layer
      selector and zoom in on downtown Philadelphia (near city hall) to see some
      stops loaded from OTP tiles.
      <BaseMap center={[0, 0]} zoom={3} style={{ height: "80vh" }}>
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
    <code>http://localhost:5555/otp</code> mocks some stop tiles for downtown
    Philadelphia (near City Hall).
    <BaseMap center={[39.9526, -75.1652]} zoom={14} style={{ height: "80vh" }}>
      {generateOTP2TileLayers(
        [{ type: "stops", minZoom: 5, initiallyVisible: true }],
        "http://localhost:5555/otp/routers/default/vectorTiles"
      )}
    </BaseMap>
  </>
);
