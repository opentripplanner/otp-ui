import React from "react";

import ModeSelectorPanel from "./mode-selector-panel";

const background = story => (
  <div
    style={{
      backgroundColor: "#F0F0F0",
      height: "300px",
      padding: "15px",
      fontFamily: "Hind, sans-serif"
    }}
  >
    {story()}
  </div>
);

export default {
  title: "ModeSelectorPanel",
  decorators: [background]
};

export const container = () => <ModeSelectorPanel />;
