import PropTypes from "prop-types";
import React, { Component } from "react";

import { zoomBasedSymbolType } from "@opentripplanner/core-utils/lib/types";

/**
 * A component that renders different components based on zoom level.
 */
class ZoomBasedMarkers extends Component {
  render() {
    const { entities, symbols, zoom } = this.props;

    // Find the deepest symbol for the current zoom level (minZoom <= zoom).
    const symbolEntry = symbols.reduce((bestMarker, marker) => {
      if (zoom >= marker.minZoom) {
        if (!bestMarker || marker.minZoom > bestMarker.minZoom) {
          return marker;
        }
      }
      return bestMarker;
    }, null);

    // And use that symbol, if found, to render the entities, if any.
    if (symbolEntry && entities) {
      const Symbol = symbolEntry.symbol;

      return entities.map((entity, index) => (
        <Symbol entity={entity} key={index} />
      ));
    }
    return null;
  }
}

ZoomBasedMarkers.propTypes = {
  /**
   * A list of objects (entities) to be rendered on the map.
   * Entities should contain coordinates information for correct placement.
   */
  entities: PropTypes.arrayOf(PropTypes.shape()),
  /**
   * A list of symbols that represent the entities, and the associated zoom level.
   * (The list does not need to be sorted.)
   */
  symbols: PropTypes.arrayOf(zoomBasedSymbolType.isRequired).isRequired,
  /**
   * The current zoom level for rendering.
   */
  zoom: PropTypes.number.isRequired
};

ZoomBasedMarkers.defaultProps = {
  entities: null
};

export default ZoomBasedMarkers;
