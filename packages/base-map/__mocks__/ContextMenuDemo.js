/* eslint-disable react/prop-types */
import React, { Component } from "react";
import BaseMap from "..";

export default class ContextMenuDemo extends Component {
  constructor() {
    super();

    this.state = { location: null };
  }

  handleContextMenu = e => {
    this.setState({ location: [e.latlng.lat, e.latlng.lng] });
  };

  render() {
    const { location } = this.state;
    const center = [45.522862, -122.667837];

    return (
      <div>
        <BaseMap
          center={center}
          popup={{ location, contents: <h1>Context Menu</h1> }}
          onContextMenu={this.handleContextMenu}
        />
      </div>
    );
  }
}
