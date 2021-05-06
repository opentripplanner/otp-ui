import L from "leaflet";
import isEqual from "lodash.isequal";
import { transitiveDataType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import { MapLayer, withLeaflet } from "react-leaflet";
import Transitive from "transitive-js";
import { otpModeToGtfsType } from "transitive-js/lib/util";

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

const defaultLabeledModes = ["BUS"];

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
    const {
      labeledModes = defaultLabeledModes,
      leaflet,
      styles,
      transitiveData
    } = this.props;
    const { map } = leaflet;

    // Convert OTP modes to GTFS mode numbers.
    const gtfsLabeledModes = labeledModes.map(otpModeToGtfsType);

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
      labeledModes: gtfsLabeledModes,
      styles: {
        ...transitiveStyles,
        ...styles
      },
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

TransitiveCanvasOverlay.propTypes = {
  /**
   * Optional array of OTP modes whose lines should be rendered with a label.
   * Defaults to ['BUS'] if none specified.
   */
  labeledModes: PropTypes.arrayOf(PropTypes.string),
  /**
   * Optional styles to customize the basic defaults for place labels and route segment labels.
   * For examples of applicable style attributes, see
   * https://github.com/conveyal/transitive.js/blob/master/stories/Transitive.stories.js#L47.
   */
  styles: PropTypes.shape({
    labels: PropTypes.shape({}),
    segmentLabels: PropTypes.shape({})
  }),
  /**
   * The transitiveData object is assumed to be the result of converting an
   * OpenTripPlanner itinerary result into a transitive-readable format. This is
   * typically done using the @opentripplanner/core-utils/map#itineraryToTransitive
   * function.
   */
  transitiveData: transitiveDataType
};

export default withLeaflet(TransitiveCanvasOverlay);
