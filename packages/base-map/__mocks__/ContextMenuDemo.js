import React, { Component } from "react";
import { Popup } from "react-map-gl";
import BaseMap from "..";

const center = [45.522862, -122.667837];

export default class ContextMenuDemo extends Component {
  constructor() {
    super();

    this.state = { location: center, contents: null };
  }

  handleContextMenu = e => {
    this.setState({
      location: [e.lngLat.lat, e.lngLat.lng],
      contents: <h1>Context Popup</h1>
    });
  };

  render() {
    const { location, contents } = this.state;

    return (
      <div>
        <BaseMap center={center} onContextMenu={this.handleContextMenu}>
          {location && (
            <Popup latitude={location[0]} longitude={location[1]}>
              {contents}
            </Popup>
          )}
        </BaseMap>
      </div>
    );
  }
}
