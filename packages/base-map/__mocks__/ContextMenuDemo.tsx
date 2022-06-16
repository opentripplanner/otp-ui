import React, { Component } from "react";
import { Popup } from "react-map-gl";
import BaseMap from "../lib";

const center: [number, number] = [45.522862, -122.667837];

export default class ContextMenuDemo extends Component<
  Record<string, never>,
  { location: [number, number]; contents: React.ReactNode }
> {
  constructor(props: undefined) {
    super(props);

    this.state = { location: center, contents: null };
  }

  handleContextMenu = (e: { lngLat: { lat: number; lng: number } }): void => {
    this.setState({
      location: [e.lngLat.lat, e.lngLat.lng],
      contents: <h1>Context Popup</h1>
    });
  };

  render(): JSX.Element {
    const { location, contents } = this.state;

    return (
      <div style={{ height: "100vh" }}>
        {/* @ts-expect-error something weird is happening with imports */}
        <BaseMap center={center} onContextMenu={this.handleContextMenu}>
          {contents && (
            <Popup
              onClose={() => {
                this.setState({ contents: null });
              }}
              latitude={location[0]}
              longitude={location[1]}
            >
              {contents}
            </Popup>
          )}
        </BaseMap>
      </div>
    );
  }
}
