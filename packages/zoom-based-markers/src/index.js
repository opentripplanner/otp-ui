import PropTypes from "prop-types";
import React, { Component } from "react";

import { zoomBasedSymbolType } from "@opentripplanner/core-utils/lib/types";

/**
 * A component that renders different components based on zoom level.
 */
class ZoomBasedMarkers extends Component {
  render() {
    const { entities, symbols, zoom } = this.props;
    if (!entities) return null;

    // Find the deepest symbol for the current zoom level (minZoom <= zoom).
    const symbolEntry = symbols.reduce((bestMarker, marker) => {
      if (zoom >= marker.minZoom) {
        if (!bestMarker || marker.minZoom > bestMarker.minZoom) {
          return marker;
        }
      }
      return bestMarker;
    }, null);

    // And use that symbol, if found, to render the entities.
    if (symbolEntry) {
      const { getMode, symbol: Symbol, symbolByMode } = symbolEntry;

      if (symbolByMode && getMode) {
        return entities.map((entity, index) => {
          const EntitySymbol = symbolByMode[getMode(entity)] || Symbol;
          return (
            EntitySymbol && (
              <EntitySymbol entity={entity} key={index} zoom={zoom} />
            )
          );
        });
      }

      if (Symbol) {
        return entities.map((entity, index) => (
          <Symbol entity={entity} key={index} zoom={zoom} />
        ));
      }
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
  symbols: PropTypes.arrayOf(zoomBasedSymbolType).isRequired,
  /**
   * The current zoom level for rendering.
   */
  zoom: PropTypes.number.isRequired
};

ZoomBasedMarkers.defaultProps = {
  entities: null
};

export default ZoomBasedMarkers;
