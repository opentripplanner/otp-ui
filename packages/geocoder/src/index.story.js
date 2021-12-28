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
        <label htmlFor="lon">
          lng: lat:
          <input
            type="text"
            id="lon"
            onChange={e => {
              setFocusPoint({ ...focusPoint, lat: e.target.value });
            }}
            value={focusPoint.lat}
          />
        </label>
      </div>
      <div>
        <label htmlFor="lng">
          lng:
          <input
            type="text"
            id="lng"
            onChange={e => {
              setFocusPoint({ ...focusPoint, lng: e.target.value });
            }}
            value={focusPoint.lng}
          />
        </label>
      </div>
      {endpoint !== "reverse" && (
        <div>
          <label htmlFor="term">
            search:
            <input
              type="text"
              id="term"
              onChange={e => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </label>
        </div>
      )}
      <label htmlFor="geocodeEarth">
        Geocode.earth:
        <input
          type="checkbox"
          id="geocodeEarth"
          checked={enableGeocodeEarth}
          onChange={e => setEnableGeocodeEarth(e.target.checked)}
        />
      </label>
      <label htmlFor="here">
        Here:
        <input
          type="checkbox"
          id="here"
          checked={enableHere}
          onChange={e => setEnableHere(e.target.checked)}
        />
      </label>
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
  component: (
    <GeocoderTester
      endpoint="search"
      hereApiKey="placeholder"
      geocodeEarthApiKey="placeholder"
      onResults={() => null}
    />
  ),
  argTypes: { onResults: { action: "result" } }
};

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = args => <GeocoderTester {...args} />;

export const TestSearch = Template.bind({});
TestSearch.args = {
  endpoint: "search",
  hereApiKey: "fake_api_key_here",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  at: { lat: 47.67552, lng: -122.31831 }
};

export const TestAutocomplete = Template.bind({});
TestAutocomplete.args = {
  endpoint: "autocomplete",
  hereApiKey: "fake_api_key_here",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  at: { lat: 47.67552, lng: -122.31831 }
};

export const TestReverse = Template.bind({});
TestReverse.args = {
  endpoint: "reverse",
  hereApiKey: "fake_api_key_here",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  at: { lat: 47.66427, lng: -122.31388 }
};
