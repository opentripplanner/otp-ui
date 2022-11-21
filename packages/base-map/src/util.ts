import { LngLatBoundsLike, MapRef, PaddingOptions } from "react-map-gl";

/**
 * Computes padding dimensions based on roughly 1/20 of the map's canvas dimensions
 * (under a 2:1 canvas-to-screen pixel ratio).
 * @param map The map where the bounds fitting is to occur.
 * @returns The object with the computed padding dimensions.
 */
export function getFitBoundsPadding(map: MapRef): PaddingOptions {
  const canvas = map.getCanvas();
  // @ts-expect-error getPixelRatio not defined in MapRef type.
  const pixelRatio = map.getPixelRatio();
  const horizPadding = canvas.width / pixelRatio / 10;
  const vertPadding = canvas.height / pixelRatio / 10;

  return {
    bottom: vertPadding,
    left: horizPadding,
    right: horizPadding,
    top: vertPadding
  };
}

/**
 * Helper function used in several packages to fit a map to the given bounds,
 * using padding based on map canvas size.
 * @param map The map where the bounds fitting is to occur.
 * @param bounds The bounds to be fit.
 */
export function fitMapBounds(map: MapRef, bounds: LngLatBoundsLike): void {
  map.fitBounds(bounds, {
    duration: 500,
    padding: getFitBoundsPadding(map)
  });

  // Often times, the map is not updated right away, so try to force an update.
  map.triggerRepaint();
}
