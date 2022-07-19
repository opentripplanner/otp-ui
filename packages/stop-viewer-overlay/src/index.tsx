import { Stop } from "@opentripplanner/types";
import { useMap } from "react-map-gl";
import React, { useEffect } from "react";

export type StopContainer = { stop: Stop };

/**
 * This overlay is intended to highlight a specific stop on a map typically in
 * conjunction with some kind of stop viewer.
 */
const StopViewerOverlay = ({
  stop,
  StopMarker,
  visible
}: {
  stop: Stop;
  StopMarker: React.FunctionComponent<StopContainer>;
  visible?: boolean;
}): JSX.Element => {
  const { current } = useMap();
  /**
   * Only reset map view if a new stop is selected. This prevents resetting the
   * bounds if, for example, the arrival times have changed for the same stop
   * in the viewer.
   */
  useEffect(() => {
    current?.flyTo({ center: [stop.lon, stop.lat] });
  }, [stop.lat, stop.lon]);

  if (visible === false || !stop || !StopMarker) return <></>;

  return <StopMarker stop={stop} />;
};

export default StopViewerOverlay;
