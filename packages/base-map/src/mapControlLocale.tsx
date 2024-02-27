import { IntlShape } from "react-intl";

// Creates a language file to pass to MapLibre that has this format:
// https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/default_locale.ts

const MAP_CONTROL_TRANSLATION_KEYS = [
  "AttributionControl.ToggleAttribution",
  "AttributionControl.MapFeedback",
  "FullscreenControl.Enter",
  "FullscreenControl.Exit",
  "GeolocateControl.FindMyLocation",
  "GeolocateControl.LocationNotAvailable",
  "LogoControl.Title",
  "NavigationControl.ResetBearing",
  "NavigationControl.ZoomIn",
  "NavigationControl.ZoomOut",
  "ScaleControl.Feet",
  "ScaleControl.Meters",
  "ScaleControl.Kilometers",
  "ScaleControl.Miles",
  "ScaleControl.NauticalMiles",
  "TerrainControl.Enable",
  "TerrainControl.Disable",
  "CooperativeGesturesHandler.WindowsHelpText",
  "CooperativeGesturesHandler.MacHelpText",
  "CooperativeGesturesHandler.MobileHelpText"
];

const mapControlTranslationObject = (
  intl: IntlShape
): { [key: string]: string } => {
  const languageObject = {};

  MAP_CONTROL_TRANSLATION_KEYS.forEach(x => {
    languageObject[x] = intl.formatMessage({
      id: `otpUi.mapControls.${x}`
    });
  });

  return languageObject;
};

export default mapControlTranslationObject;
