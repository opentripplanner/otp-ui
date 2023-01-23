import { LngLat } from "maplibre-gl";
import React, { Component } from "react";

import BaseMap from "../src";
import { Popup } from "../src/styled";

const center: [number, number] = [45.522862, -122.667837];

type State = {
  contents?: React.ReactNode;
  location?: [number, number];
};
type Props = Record<string, never>;

export default class ContextMenuDemo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { contents: null, location: center };
  }

  handleContextMenu = (e: { lngLat: LngLat }): void => {
    this.setState({
      contents: <h1>Context Popup</h1>,
      location: [e.lngLat.lat, e.lngLat.lng]
    });
  };

  render(): JSX.Element {
    const { contents, location } = this.state;

    return (
      <div style={{ height: "90vh" }}>
        <BaseMap center={center} onContextMenu={this.handleContextMenu}>
          {contents && location && (
            <Popup
              latitude={location[0]}
              longitude={location[1]}
              onClose={() => {
                this.setState({ contents: null });
              }}
            >
              {contents}
            </Popup>
          )}
        </BaseMap>
      </div>
    );
  }
}
