import React, { useState } from "react";
import BaseMap from "@opentripplanner/base-map";
import generateOTP2TileLayers from ".";

export default {
  title: "OTP2 Tile Layer"
};

export const OtpTileLayer = (): JSX.Element => {
  const [endpoint, setEndpoint] = useState("");
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        OTP2 Server with stops layer enabled
        <input
          onChange={e => setEndpoint(e.target.value)}
          type="text"
          placeholder="http://localhost:8001/otp"
        />
      </label>
      <BaseMap center={[0, 0]} zoom={3} style={{ height: "80vh" }}>
        {generateOTP2TileLayers(
          [{ type: "stops" }],
          `${endpoint}/routers/default/vectorTiles`
        )}
      </BaseMap>
    </>
  );
};

// Don't take a snapshot of an interactive component
OtpTileLayer.parameters = {
  storyshots: { disable: true }
};
