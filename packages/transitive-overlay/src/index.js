import L from "leaflet";
import isEqual from "lodash.isequal";
import { encodedPolylineType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import { MapLayer, withLeaflet } from "react-leaflet";
import Transitive from "transitive-js";

import transitiveStyles from "./transitive-styles";

require("./leaflet-canvas-layer");

// TODO: move to util?
function checkHiPPI(canvas) {
  if (window.devicePixelRatio > 1) {
    const PIXEL_RATIO = 2;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    canvas.width *= PIXEL_RATIO;
    canvas.height *= PIXEL_RATIO;

    const context = canvas.getContext("2d");
    context.scale(PIXEL_RATIO, PIXEL_RATIO);
  }
}

const zoomFactors = [
  {
    minScale: 0,
    gridCellSize: 0,
    internalVertexFactor: 0,
    angleConstraint: 5,
    mergeVertexThreshold: 0,
    useGeographicRendering: true
  }
];

class TransitiveCanvasOverlay extends MapLayer {
  // React Lifecycle Methods

  componentDidMount() {
    const { map } = this.props.leaflet;
    L.canvasLayer()
      .delegate(this) // -- if we do not inherit from L.CanvasLayer  we can setup a delegate to receive events from L.CanvasLayer
      .addTo(map);
  }

  componentDidUpdate(prevProps) {
    // Check if we received new transitive data
    if (
      this.transitive &&
      !isEqual(prevProps.transitiveData, this.props.transitiveData)
    ) {
      this.transitive.updateData(this.props.transitiveData);
      if (!this.props.transitiveData) this.transitive.render();
      else this.updateBoundsAndRender();
    }

    if (
      // this block only applies for profile trips where active option changed
      this.props.routingType === "PROFILE" &&
      prevProps.activeItinerary !== this.props.activeItinerary
    ) {
      if (this.props.activeItinerary == null) {
        // no option selected; clear focus
        this.transitive.focusJourney(null);
        this.transitive.render();
      } else if (this.props.transitiveData) {
        this.transitive.focusJourney(
          this.props.transitiveData.journeys[this.props.activeItinerary]
            .journey_id
        );
        this.transitive.render();
      }
    }
  }

  componentWillUnmount() {
    if (this.transitive) {
      this.transitive.updateData(null);
      this.transitive.render();
    }
  }

  // Internal Methods

  initTransitive(canvas) {
    const { leaflet, transitiveData } = this.props;
    const { map } = leaflet;

    // set up the transitive instance
    const mapBounds = map.getBounds();
    this.transitive = new Transitive({
      data: transitiveData,
      initialBounds: [
        [mapBounds.getWest(), mapBounds.getSouth()],
        [mapBounds.getEast(), mapBounds.getNorth()]
      ],
      zoomEnabled: false,
      autoResize: false,
      styles: transitiveStyles,
      zoomFactors,
      display: "canvas",
      canvas
    });

    checkHiPPI(canvas);

    // the initial map draw
    this.updateBoundsAndRender();
  }

  updateBoundsAndRender() {
    if (!this.transitive) {
      console.log(
        "WARNING: Transitive object not set in transitive-canvas-overlay"
      );
      return;
    }

    const mapBounds = this.props.leaflet.map.getBounds();
    this.transitive.setDisplayBounds([
      [mapBounds.getWest(), mapBounds.getSouth()],
      [mapBounds.getEast(), mapBounds.getNorth()]
    ]);
    this.transitive.render();
  }

  // Leaflet Layer API Methods

  onDrawLayer(info) {
    if (!this.transitive) this.initTransitive(info.canvas);

    const mapSize = this.props.leaflet.map.getSize();
    if (
      this.lastMapSize &&
      (mapSize.x !== this.lastMapSize.x || mapSize.y !== this.lastMapSize.y)
    ) {
      const canvas = info.canvas;
      checkHiPPI(canvas);
      this.transitive.display.setDimensions(mapSize.x, mapSize.y);
      this.transitive.display.setCanvas(canvas);
    }

    this.updateBoundsAndRender();

    this.lastMapSize = this.props.leaflet.map.getSize();
  }

  createTile() {}

  createLeafletElement() {}

  updateLeafletElement() {}
}

const placeType = PropTypes.shape({
  place_id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
});

TransitiveCanvasOverlay.propTypes = {
  transitiveData: PropTypes.shape({
    journeys: PropTypes.arrayOf(
      PropTypes.shape({
        journey_id: PropTypes.string.isRequired,
        journey_name: PropTypes.string.isRequired,
        segments: PropTypes.arrayOf(
          PropTypes.shape({
            arc: PropTypes.bool,
            from: placeType,
            patterns: PropTypes.arrayOf(
              PropTypes.shape({
                pattern_id: PropTypes.string.isRequired,
                from_stop_index: PropTypes.number.isRequired,
                to_stop_index: PropTypes.number.isRequired
              })
            ),
            streetEdges: PropTypes.arrayOf(PropTypes.number),
            to: placeType,
            type: PropTypes.string.isRequired
          })
        ).isRequired
      })
    ).isRequired,
    patterns: PropTypes.arrayOf(
      PropTypes.shape({
        pattern_id: PropTypes.string.isRequired,
        pattern_name: PropTypes.string.isRequired,
        route_id: PropTypes.string.isRequired,
        stops: PropTypes.arrayOf(
          PropTypes.shape({
            geometry: PropTypes.string,
            stop_id: PropTypes.string.isRequired
          })
        ).isRequired
      })
    ).isRequired,
    places: PropTypes.arrayOf(
      PropTypes.shape({
        place_id: PropTypes.string.isRequired,
        place_lat: PropTypes.number.isRequired,
        place_lon: PropTypes.number.isRequired,
        place_name: PropTypes.string
      })
    ).isRequired,
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        agency_id: PropTypes.string.isRequired,
        route_id: PropTypes.string.isRequired,
        route_short_name: PropTypes.string.isRequired,
        route_long_name: PropTypes.string.isRequired,
        route_type: PropTypes.number.isRequired,
        route_color: PropTypes.string
      })
    ).isRequired,
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        stop_id: PropTypes.string.isRequired,
        stop_name: PropTypes.string.isRequired,
        stop_lat: PropTypes.number.isRequired,
        stop_lon: PropTypes.number.isRequired
      })
    ).isRequired,
    streetEdges: PropTypes.arrayOf(
      PropTypes.shape({
        edge_id: PropTypes.number.isRequired,
        geometry: encodedPolylineType
      })
    ).isRequired
  })
};

export default withLeaflet(TransitiveCanvasOverlay);
