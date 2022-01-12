import React from "react";
import ReactDOMServer from "react-dom/server";

import {
  Circle,
  MapComponentProps,
  LatLngBounds,
  FeatureGroup,
  Popup,
  MapLayer,
  withLeaflet
} from "react-leaflet";
import { getImages } from "./MapillaryUtils";

/**
 * An overlay to view Mapillary images.
 */
class MapillaryOverlay extends MapLayer<MapComponentProps> {
  state: {
    boundsAtLastUpdate: LatLngBounds;
    images: GeoJSON.FeatureCollection;
  } = {
    boundsAtLastUpdate: null,
    images: null
  };

  componentDidMount = () => {
    // set up pan/zoom listener
    this.props.leaflet.map.on("moveend", this.refreshImages);
    this.refreshImages();
  };

  // TODO: determine why the default MapLayer componentWillUnmount() method throws an error
  componentWillUnmount = () => {
    // Remove the pan/zoom listener set up above.
    this.props.leaflet.map.off("moveend", this.refreshImages);
  };

  refreshImages = async () => {
    const { leaflet } = this.props;
    const bounds = leaflet.map.getBounds();
    const zoom = leaflet.map.getZoom();
    console.log(zoom);
    if (zoom < 20) return;

    // TODO: check that previous bounds are sufficiently far from new ones before making expensive request

    const images = await getImages(bounds);
    const featureCollection = {
      type: "FeatureCollection",
      features: images.data.map(image => {
        return {
          geometry: image.geometry,
          type: "Feature",
          properties: { id: image.id }
        };
      })
    };

    this.setState({ images: featureCollection, boundsAtLastUpdate: bounds });
  };

  // @ts-expect-error This override is not type-correct, but neccesary
  createLeafletElement() {}

  updateLeafletElement() {}

  onEachFeature = (feature, layer) => {
    const popupContent = ReactDOMServer.renderToString(
      <b>feature id: {feature.properties.id}</b>
    );
    layer.bindPopup(popupContent);
  };

  render() {
    const { images } = this.state;
    if (!images) return null;

    return (
      <FeatureGroup>
        {images.features.map(feature => {
          if (feature.geometry.type !== "Point") return null;

          return (
            <FeatureGroup key={feature.properties.id}>
              <Popup style={{ margin: 0, padding: 0 }}>
                <iframe
                  src={`https://www.mapillary.com/embed?image_key=${feature.properties.id}&style=photo`}
                  title="Street viewer"
                  height={300}
                  width={300}
                  frameBorder="0"
                ></iframe>
              </Popup>
              <Circle
                center={[
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0]
                ]}
                fillColor="#00ff48"
                radius={5}
                color="#000"
                weight={1}
                opacity={1}
                fillOpacity={0.8}
              />
            </FeatureGroup>
          );
        })}
      </FeatureGroup>
    );
  }
}

export default withLeaflet(MapillaryOverlay);
