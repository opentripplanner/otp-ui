import { IntlShape } from "react-intl";

// Creates a language file to pass to MapLibre that has this format:
// https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/default_locale.ts

const mapControlFields = (intl: IntlShape): any => {
  return {
    "AttributionControl.ToggleAttribution": intl.formatMessage({
      id: "otpUi.mapControls.AttributionControl.ToggleAttribution"
    }),
    "AttributionControl.MapFeedback": intl.formatMessage({
      id: "otpUi.mapControls.AttributionControl.MapFeedback"
    }),
    "FullscreenControl.Enter": intl.formatMessage({
      id: "otpUi.mapControls.FullscreenControl.Enter"
    }),
    "FullscreenControl.Exit": intl.formatMessage({
      id: "otpUi.mapControls.FullscreenControl.Exit"
    }),
    "GeolocateControl.FindMyLocation": intl.formatMessage({
      id: "otpUi.mapControls.GeolocateControl.FindMyLocation"
    }),
    "GeolocateControl.LocationNotAvailable": intl.formatMessage({
      id: "otpUi.mapControls.GeolocateControl.LocationNotAvailable"
    }),
    "LogoControl.Title": intl.formatMessage({
      id: "otpUi.mapControls.LogoControl.Title"
    }),
    "NavigationControl.ResetBearing": intl.formatMessage({
      id: "otpUi.mapControls.NavigationControl.ResetBearing"
    }),
    "NavigationControl.ZoomIn": intl.formatMessage({
      id: "otpUi.mapControls.NavigationControl.ZoomIn"
    }),
    "NavigationControl.ZoomOut": intl.formatMessage({
      id: "otpUi.mapControls.NavigationControl.ZoomOut"
    }),
    "ScaleControl.Feet": intl.formatMessage({
      id: "otpUi.mapControls.ScaleControl.Feet"
    }),
    "ScaleControl.Meters": intl.formatMessage({
      id: "otpUi.mapControls.ScaleControl.Meters"
    }),
    "ScaleControl.Kilometers": intl.formatMessage({
      id: "otpUi.mapControls.ScaleControl.Kilometers"
    }),
    "ScaleControl.Miles": intl.formatMessage({
      id: "otpUi.mapControls.ScaleControl.Miles"
    }),
    "ScaleControl.NauticalMiles": intl.formatMessage({
      id: "otpUi.mapControls.ScaleControl.NauticalMiles"
    }),
    "TerrainControl.Enable": intl.formatMessage({
      id: "otpUi.mapControls.TerrainControl.Enable"
    }),
    "TerrainControl.Disable": intl.formatMessage({
      id: "otpUi.mapControls.TerrainControl.Disable"
    }),
    "CooperativeGesturesHandler.WindowsHelpText": intl.formatMessage({
      id: "otpUi.mapControls.CooperativeGesturesHandler.WindowsHelpText"
    }),
    "CooperativeGesturesHandler.MacHelpText": intl.formatMessage({
      id: "otpUi.mapControls.CooperativeGesturesHandler.MacHelpText"
    }),
    "CooperativeGesturesHandler.MobileHelpText": intl.formatMessage({
      id: "otpUi.mapControls.CooperativeGesturesHandler.MobileHelpText"
    })
  };
};

export default mapControlFields;
