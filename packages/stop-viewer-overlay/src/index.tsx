import React, { useEffect } from "react";
import { Stop } from "@opentripplanner/types";
import { useMap } from "react-map-gl";

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
  StopMarker: React.FunctionComponent<{ stop: Stop }>;
  visible?: boolean;
}): JSX.Element => {
  const { mainMap } = useMap();
  /**
   * Only reset map view if a new stop is selected. This prevents resetting the
   * bounds if, for example, the arrival times have changed for the same stop
   * in the viewer.
   */
  useEffect(() => {
    mainMap?.flyTo({ center: [stop.lon, stop.lat] });
  }, [stop.lat, stop.lon]);

  if (!visible || !stop || !StopMarker) return <></>;

  return <StopMarker stop={stop} />;
};

export default StopViewerOverlay;
