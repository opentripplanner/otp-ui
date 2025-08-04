import { LngLat, LngLatBoundsLike, LngLatLike } from "maplibre-gl";
import { MapRef, PaddingOptions } from "react-map-gl/maplibre";

/**
 * Computes padding dimensions based on roughly 1/20 of the map's canvas dimensions
 * (under a 2:1 canvas-to-screen pixel ratio).
 * @param map The map where the bounds fitting is to occur.
 * @param paddingRatio The ratio of the canvas dimensions set aside for padding.
 * @returns The object with the computed padding dimensions.
 */
export function getFitBoundsPadding(
  map: MapRef,
  paddingRatio = 0.1
): PaddingOptions {
  const canvas = map.getCanvas();
  const pixelRatio = map.getPixelRatio();
  const horizPadding = (canvas.width * paddingRatio) / pixelRatio;
  const vertPadding = (canvas.height * paddingRatio) / pixelRatio;

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

/**
 * Fit map bounds so that both points specified are visible.
 */
export function fitMapToPoints(
  map: MapRef,
  point1: LngLatLike,
  point2: LngLatLike,
  paddingRatio = 0.1,
  durationMillis = 500
): void {
  const pt1 = LngLat.convert(point1);
  const pt2 = LngLat.convert(point2);

  // Recent versions of maplibre enforce the order of coordinates (i.e., sw, ne).
  const minlat = Math.min(pt1.lat, pt2.lat);
  const maxlat = Math.max(pt1.lat, pt2.lat);
  const minlon = Math.min(pt1.lng, pt2.lng);
  const maxlon = Math.max(pt1.lng, pt2.lng);

  map.fitBounds([minlon, minlat, maxlon, maxlat], {
    duration: durationMillis,
    padding: getFitBoundsPadding(map, paddingRatio)
  });
}
