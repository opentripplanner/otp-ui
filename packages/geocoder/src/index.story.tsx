import React, { ReactElement, useState } from "react";
import { AnyGeocoderQuery } from "./geocoders/types";
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
  const [boundary, setBoundary] = useState({
    maxLat: 48.687912,
    minLat: 46.981852,
    maxLon: -121.467028,
    minLon: -123.148723
  });
  const [enableBoundary, setEnableBoundary] = useState(false);
  const [enableFocusPoint, setEnableFocusPoint] = useState(true);
  const [enableGeocodeEarth, setEnableGeocodeEarth] = useState(true);
  const [enableHere, setEnableHere] = useState(true);
  const [
    reverseUseFeatureCollection,
    setReverseUseFeatureCollection
  ] = useState(false);

  const geocoder = getGeocoder({
    apiKey: hereApiKey,
    focusPoint,
    reverseUseFeatureCollection,
    type: "HERE"
  });

  const peliasGeocoder = getGeocoder({
    apiKey: geocodeEarthApiKey,
    baseUrl: "https://api.geocode.earth/v1",
    focusPoint,
    size: 1,
    type: "PELIAS",
    reverseUseFeatureCollection
  });

  const searchObj: AnyGeocoderQuery = {
    text: searchTerm
  };

  if (enableBoundary) {
    searchObj.boundary = { rect: boundary };
  }
  if (enableFocusPoint) {
    searchObj.point = focusPoint;
    searchObj.focusPoint = focusPoint;
  }

  const search = async () => {
    const hereRes = enableHere ? await geocoder[endpoint](searchObj) : null;
    const peliasRes = enableGeocodeEarth
      ? await peliasGeocoder[endpoint](searchObj)
      : null;
    onResults({
      hereRes,
      peliasRes
    });
  };

  return (
    <div>
      {/* Boundary Input */}
      {endpoint !== "reverse" && (
        <div>
          <label htmlFor="maxLat">
            maxLat:
            <input
              disabled={!enableBoundary}
              id="maxLat"
              onChange={e => {
                setBoundary({
                  ...boundary,
                  maxLat: parseFloat(e.target.value)
                });
              }}
              type="text"
              value={boundary.maxLat}
            />
          </label>
          <label htmlFor="minLat">
            minLat:
            <input
              disabled={!enableBoundary}
              id="minLat"
              onChange={e => {
                setBoundary({
                  ...boundary,
                  minLat: parseFloat(e.target.value)
                });
              }}
              type="text"
              value={boundary.minLat}
            />
          </label>
          <label htmlFor="maxLon">
            maxLon:
            <input
              disabled={!enableBoundary}
              id="maxLon"
              onChange={e => {
                setBoundary({
                  ...boundary,
                  maxLon: parseFloat(e.target.value)
                });
              }}
              type="text"
              value={boundary.maxLon}
            />
          </label>
          <label htmlFor="minLon">
            minLon:
            <input
              disabled={!enableBoundary}
              id="minLon"
              onChange={e => {
                setBoundary({
                  ...boundary,
                  minLon: parseFloat(e.target.value)
                });
              }}
              type="text"
              value={boundary.minLon}
            />
          </label>
        </div>
      )}
      {/* Focus Point Input */}
      <div>
        <label htmlFor="lat">
          lat:
          <input
            disabled={!enableFocusPoint}
            id="lat"
            onChange={e => {
              setFocusPoint({ ...focusPoint, lat: parseFloat(e.target.value) });
            }}
            type="text"
            value={focusPoint.lat}
          />
        </label>
        <label htmlFor="lng">
          lng:
          <input
            disabled={!enableFocusPoint}
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
      <div>
        <label htmlFor="geocodeEarth">
          Geocode.earth:
          <input
            checked={enableGeocodeEarth}
            id="geocodeEarth"
            onChange={e => setEnableGeocodeEarth(e.target.checked)}
            type="checkbox"
          />
        </label>
        <label htmlFor="here">
          Here:
          <input
            checked={enableHere}
            id="here"
            onChange={e => setEnableHere(e.target.checked)}
            type="checkbox"
          />
        </label>
      </div>
      <div>
        {endpoint !== "reverse" && (
          <>
            <label htmlFor="enableFocusPoint">
              Enable Focus Point:
              <input
                checked={enableFocusPoint}
                id="enableFocusPoint"
                onChange={e => setEnableFocusPoint(e.target.checked)}
                type="checkbox"
              />
            </label>
            <label htmlFor="enableBoundary">
              Enable Boundary Box:
              <input
                checked={enableBoundary}
                id="enableBoundary"
                onChange={e => setEnableBoundary(e.target.checked)}
                type="checkbox"
              />
            </label>
          </>
        )}
      </div>
      <div>
        {endpoint === "reverse" && (
          <label htmlFor="reverseUseFeatureCollection">
            Return Feature Collection:
            <input
              checked={reverseUseFeatureCollection}
              id="reverseUseFeatureCollection"
              onChange={e => setReverseUseFeatureCollection(e.target.checked)}
              type="checkbox"
            />
          </label>
        )}
      </div>
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
