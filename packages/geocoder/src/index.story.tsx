import React, { ReactElement, useState } from "react";
import getGeocoder from "./index";

const GeocoderTester = ({
  at = { lat: 0, lng: 0 },
  endpoint,
  geocodeEarthApiKey,
  hereApiKey,
  onResults
}: {
  at?: { lat: number; lng: number };
  endpoint: string;
  geocodeEarthApiKey: string;
  hereApiKey: string;
  onResults: (any) => void;
}): ReactElement => {
  const [searchTerm, setSearchTerm] = useState("");
  const [focusPoint, setFocusPoint] = useState({ lat: at.lat, lng: at.lng });
  const [enableGeocodeEarth, setEnableGeocodeEarth] = useState(true);
  const [enableHere, setEnableHere] = useState(true);

  const geocoder = getGeocoder({
    apiKey: hereApiKey,
    focusPoint,
    type: "HERE"
  });

  const peliasGeocoder = getGeocoder({
    apiKey: geocodeEarthApiKey,
    baseUrl: "https://api.geocode.earth/v1",
    focusPoint,
    size: 1,
    type: "PELIAS"
  });

  const search = async () => {
    const hereRes = enableHere
      ? await geocoder[endpoint]({
          focusPoint,
          point: focusPoint,
          text: searchTerm
        })
      : {};
    const peliasRes = enableGeocodeEarth
      ? await peliasGeocoder[endpoint]({
          focusPoint,
          point: focusPoint,
          text: searchTerm
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
            id="lon"
            onChange={e => {
              setFocusPoint({ ...focusPoint, lat: parseFloat(e.target.value) });
            }}
            type="text"
            value={focusPoint.lat}
          />
        </label>
      </div>
      <div>
        <label htmlFor="lng">
          lng:
          <input
            id="lng"
            onChange={e => {
              setFocusPoint({ ...focusPoint, lng: parseFloat(e.target.value) });
            }}
            type="text"
            value={focusPoint.lng}
          />
        </label>
      </div>
      {endpoint !== "reverse" && (
        <div>
          <label htmlFor="term">
            search:
            <input
              id="term"
              onChange={e => setSearchTerm(e.target.value)}
              type="text"
              value={searchTerm}
            />
          </label>
        </div>
      )}
      <label htmlFor="geocodeEarth">
        Geocode.earth:
        <input
          id="geocodeEarth"
          onChange={e => setEnableGeocodeEarth(e.target.checked)}
          type="checkbox"
          checked={enableGeocodeEarth}
        />
      </label>
      <label htmlFor="here">
        Here:
        <input
          id="here"
          onChange={e => setEnableHere(e.target.checked)}
          type="checkbox"
          checked={enableHere}
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
export default {
  argTypes: { onResults: { action: "result" } },
  component: (
    <GeocoderTester
      endpoint="search"
      geocodeEarthApiKey="placeholder"
      hereApiKey="placeholder"
      onResults={() => null}
    />
  ),
  title: "Geocoder"
};

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = args => <GeocoderTester {...args} />;

export const TestSearch = Template.bind({});
TestSearch.args = {
  at: { lat: 47.67552, lng: -122.31831 },
  endpoint: "search",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  hereApiKey: "fake_api_key_here"
};

export const TestAutocomplete = Template.bind({});
TestAutocomplete.args = {
  at: { lat: 47.67552, lng: -122.31831 },
  endpoint: "autocomplete",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  hereApiKey: "fake_api_key_here"
};

export const TestReverse = Template.bind({});
TestReverse.args = {
  at: { lat: 47.66427, lng: -122.31388 },
  endpoint: "reverse",
  geocodeEarthApiKey: "fake_api_key_geocodeearth",
  hereApiKey: "fake_api_key_here"
};
