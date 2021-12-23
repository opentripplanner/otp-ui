import React, { useState } from "react";
import PropTypes from "prop-types";
import getGeocoder from "./index";

const GeocoderTester = ({
  hereApiKey,
  geocodeEarthApiKey,
  onResults,
  endpoint,
  at
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [focusPoint, setFocusPoint] = useState({ lat: at.lat, lng: at.lng });
  const [enableGeocodeEarth, setEnableGeocodeEarth] = useState(true);
  const [enableHere, setEnableHere] = useState(true);

  const geocoder = getGeocoder({
    type: "HERE",
    apiKey: hereApiKey,
    focusPoint
  });

  const peliasGeocoder = getGeocoder({
    type: "PELIAS",
    apiKey: geocodeEarthApiKey,
    baseUrl: "https://api.geocode.earth/v1",
    size: 1,
    focusPoint
  });

  const search = async () => {
    const hereRes = enableHere
      ? await geocoder[endpoint]({
          text: searchTerm,
          focusPoint,
          point: focusPoint
        })
      : {};
    const peliasRes = enableGeocodeEarth
      ? await peliasGeocoder[endpoint]({
          text: searchTerm,
          focusPoint,
          point: focusPoint
        })
      : {};
    onResults({
      hereRes,
      peliasRes
    });
  };

  return (
    <div>
      <div>
        lat:
        <input
          type="text"
          onChange={e => setFocusPoint({ ...focusPoint, lat: e.target.value })}
          value={focusPoint.lat}
        />
      </div>
      <div>
        lng:
        <input
          type="text"
          onChange={e => setFocusPoint({ ...focusPoint, lng: e.target.value })}
          value={focusPoint.lng}
        />
      </div>
      {endpoint !== "reverse" && (
        <div>
          search:
          <input
            type="text"
            onChange={e => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      )}
      Geocode.earth:
      <input
        type="checkbox"
        checked={enableGeocodeEarth}
        onChange={e => setEnableGeocodeEarth(e.target.checked)}
      />
      Here:
      <input
        type="checkbox"
        checked={enableHere}
        onChange={e => setEnableHere(e.target.checked)}
      />
      <div>
        <button onClick={search} type="button">
          Search
        </button>
      </div>
    </div>
  );
};

GeocoderTester.propTypes = {
  hereApiKey: PropTypes.string.isRequired,
  geocodeEarthApiKey: PropTypes.string.isRequired,
  onResults: PropTypes.func.isRequired,
  endpoint: PropTypes.string.isRequired,
  at: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  })
};

GeocoderTester.defaultProps = {
  at: {
    lat: 0,
    lng: 0
  }
};

export default {
  title: "Geocoder",
  component: <GeocoderTester />,
  argTypes: { onResults: { action: "result" } }
};

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = args => <GeocoderTester {...args} />;

export const TestSearch = Template.bind({});
TestSearch.args = {
  endpoint: "search",
  hereApiKey: "fo_vzDfPGAYXJTG3HbdEZutV-4vjsP0LyekRDac_XaY",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  at: { lat: 47.67552, lng: -122.31831 }
};

export const TestAutocomplete = Template.bind({});
TestAutocomplete.args = {
  endpoint: "search",
  hereApiKey: "fo_vzDfPGAYXJTG3HbdEZutV-4vjsP0LyekRDac_XaY",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  at: { lat: 47.67552, lng: -122.31831 }
};

export const TestReverse = Template.bind({});
TestReverse.args = {
  endpoint: "reverse",
  hereApiKey: "fo_vzDfPGAYXJTG3HbdEZutV-4vjsP0LyekRDac_XaY",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  at: { lat: 47.66427, lng: -122.31388 }
};
