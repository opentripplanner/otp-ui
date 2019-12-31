import React, { Component } from "react";
import ModeSelector, { getModeOptions } from "./mode-selector";
import { commonModes } from "./modes";

export default class ModeSelectorPanel extends Component {
  constructor() {
    super();
    this.state = { selectedModes: ["WALK", "TRAM", "RAIL", "BUS", "GONDOLA"] };
  }

  onChange = id => {
    const newModes = id.split("+");
    const finalModes =
      newModes[0] === "TRANSIT"
        ? [
            "TRAM",
            "RAIL",
            "BUS",
            "GONDOLA",
            newModes.length > 1 ? newModes[1] : "WALK"
          ]
        : newModes;

    this.setState({ selectedModes: finalModes });
  };

  render() {
    const { selectedModes } = this.state;
    const modeOptions = getModeOptions(commonModes, selectedModes);

    return <ModeSelector modes={modeOptions} onChange={this.onChange} />;
  }
}
