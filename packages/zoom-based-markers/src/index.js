import PropTypes from "prop-types";
import React, { Component } from "react";

import { zoomBasedSymbolType } from "@opentripplanner/core-utils/lib/types";

/**
 * A component that renders different components based on zoom level.
 */
class ZoomBasedMarkers extends Component {
  constructor(props) {
    super(props);
    this.state = { symbols: this.getTransformedSymbols(props) };
  }

  componentDidUpdate(prevProps) {
    // Remap symbol transform if new symbols are provided.
    const { symbols, symbolTransform } = this.props;

    if (symbolTransform && prevProps.symbols !== symbols) {
      this.updateSymbols(this.getTransformedSymbols(this.props));
    }
  }

  /**
   * This helper method maps the symbolTransform (if provided)
   * to the symbols originally defined in the symbols prop.
   * The result of this function call is stored in this component's state.
   */
  getTransformedSymbols = ({ symbols, symbolTransform }) => {
    if (typeof symbolTransform === "function") {
      return (
        symbols &&
        symbols.map(({ getMode, minZoom, symbol, symbolByMode }) => {
          // Make a new version of symbolByMode with the tranformed symbols
          // using symbolTransform.
          let newSymbolByMode;
          const originalSymbolByMode = symbolByMode;

          if (originalSymbolByMode) {
            Object.keys(originalSymbolByMode).forEach(key => {
              const originalSymbol = originalSymbolByMode[key];
              if (originalSymbol) {
                if (!newSymbolByMode) {
                  // Initialize on first need.
                  newSymbolByMode = {};
                }
                newSymbolByMode[key] = symbolTransform(originalSymbol);
              }
            });
          }

          return {
            getMode,
            minZoom,
            symbol: symbolTransform(symbol),
            symbolByMode: newSymbolByMode
          };
        })
      );
    }

    return symbols;
  };

  /**
   * Updates the state outside of componentDidUpdate.
   */
  updateSymbols = symbols => {
    this.setState({ symbols });
  };

  render() {
    const { entities, zoom } = this.props;
    if (!entities) return null;

    const { symbols } = this.state;

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

      if (Symbol) {
        if (symbolByMode && getMode) {
          return entities.map((entity, index) => {
            const EntitySymbol = symbolByMode[getMode(entity)] || Symbol;
            return <EntitySymbol entity={entity} key={index} zoom={zoom} />;
          });
        }

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
   * An optional function(Component) to transforms components defined in the symbols props prior to rendering,
   * in cases you need to wrap symbols or inject children.
   * The function must return a component that accepts these props: ({ entity, key, zoom }).
   */
  symbolTransform: PropTypes.func,
  /**
   * The current zoom level for rendering.
   */
  zoom: PropTypes.number.isRequired
};

ZoomBasedMarkers.defaultProps = {
  entities: null,
  symbolTransform: null
};

export default ZoomBasedMarkers;
