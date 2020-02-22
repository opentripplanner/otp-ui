import React, { Component } from "react";
import BaseMap from "..";

const center = [45.522862, -122.667837];

export default class ContextMenuDemo extends Component {
  constructor() {
    super();

    this.state = { location: center, contents: "" };
  }

  handleContextMenu = e => {
    this.setState({
      location: [e.latlng.lat, e.latlng.lng],
      contents: <h1>Context Popup</h1>
    });
  };

  render() {
    const { location, contents } = this.state;

    return (
      <div>
        <BaseMap
          center={center}
          popup={{ location, contents }}
          onContextMenu={this.handleContextMenu}
        />
      </div>
    );
  }
}
