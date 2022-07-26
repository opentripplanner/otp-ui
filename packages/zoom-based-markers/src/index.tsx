import cloneDeep from "lodash.clonedeep";
import React, { useMemo } from "react";
import {
  LayerEntity,
  // @ts-expect-error alpha only change as we resolve merge conflicts
  SymbolComponent,
  ZoomBasedSymbol
} from "@opentripplanner/types";

/**
 * Transforms the symbol and symbols by type from the specified symbolEntry
 * using the specified symbolTransform.
 * TODO: Should this be memoized?
 */
const getTransformedSymbol = (
  symbolEntry: ZoomBasedSymbol,
  symbolTransform: (symbol: SymbolComponent) => SymbolComponent
) => {
  // If no transform function provided, just return symbolEntry.
  if (typeof symbolTransform !== "function") {
    return symbolEntry;
  }

  const { symbolByType } = symbolEntry;
  const newEntry = cloneDeep(symbolEntry);

  if (symbolByType) {
    // Transform entries in symbolByType.
    Object.entries(symbolByType).forEach(([key, originalSymbol]) => {
      newEntry.symbolByType[key] = symbolTransform(originalSymbol);
    });
  }

  // Transform the main (default) symbol.
  newEntry.symbol = symbolTransform(symbolEntry.symbol);
  return newEntry;
};

/**
 * Finds the deepest symbol (the symbol associated with the highest minZoom)
 * for the specified symbols and zoom level.
 */
const getSymbolEntry = (symbols: ZoomBasedSymbol[], zoom: number) =>
  symbols?.reduce((bestMarker, marker) => {
    if (zoom >= marker.minZoom) {
      if (!bestMarker || marker.minZoom > bestMarker.minZoom) {
        return marker;
      }
    }
    return bestMarker;
  }, null);

type Props = {
  /**
   * A list of objects (entities) to be rendered on the map.
   * Entities must have an id attribute and contain coordinates information for correct placement.
   */
  entities: LayerEntity[];
  /**
   * A list of symbols that represent the entities at the associated zoom level.
   * The symbols must be able to obtain the position of the specified entities.
   * (The list does not need to be sorted.)
   */
  symbols: ZoomBasedSymbol[];
  /**
   * An optional function(Component) to transforms components defined in the symbols prop prior to rendering,
   * in cases you need to wrap symbols or inject children.
   * The function must return a component that accepts these props: ({ entity, zoom }).
   * In addition, to inject children, the returned component must explicitly render any applicable children passed to it.
   */
  symbolTransform?: (symbol: SymbolComponent) => SymbolComponent;
  /**
   * The current zoom level for rendering.
   */
  zoom: number;
};
/**
 * A component that renders different components based on zoom level.
 */
const ZoomBasedMarkers = ({
  entities,
  symbols,
  symbolTransform,
  zoom
}: Props): JSX.Element => {
  if (!entities || !entities.length) return null;

  // Find the deepest symbol for the current zoom level.
  const symbolEntry = getSymbolEntry(symbols, zoom);

  // With that symbol entry, transform its symbols (if a symbolTransform prop is provided),
  // and use the transformed symbols to render the entities.
  let renderedMarkers = null;
  if (symbolEntry) {
    const transformedEntry = getTransformedSymbol(symbolEntry, symbolTransform);

    const { getType, symbol: DefaultSymbol, symbolByType } = transformedEntry;
    // Note that the result of the transformed symbols can be null (even for DefaultSymbol),
    // hence the null checks before the return statements below.

    renderedMarkers = useMemo(
      () =>
        entities.map(entity => {
          const EntitySymbol =
            (getType && symbolByType[getType(entity)]) || DefaultSymbol;
          return (
            EntitySymbol && (
              <EntitySymbol
                entity={entity}
                key={entity.id}
                zoom={Math.floor(zoom)}
              />
            )
          );
        }),
      [entities, zoom]
    );
  }

  return renderedMarkers;
};

export default ZoomBasedMarkers;
