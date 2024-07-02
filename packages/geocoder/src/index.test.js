import path from "path";

import nock from "nock";

import PeliasGeocoder from "./geocoders/pelias";

import getGeocoder from ".";

function mockResponsePath(geocoder, file) {
  return path.join(__dirname, "test-fixtures", geocoder, file);
}

describe("geocoder", () => {
  const geocoders = [
    {
      type: "ARCGIS"
    },
    {
      apiKey: "dummy-mapzen-key",
      baseUrl: "https://ws-st.trimet.org/pelias/v1",
      type: "PELIAS"
    },
    {
      apiKey: "dummy-here-key",
      type: "HERE"
    },
    {
      type: "PHOTON"
    },
    {
      type: "OTP",
      baseUrl: "http://dummy.dummy/otp"
    },
    // this entry represents no geocoder configuration. In this case it is
    // expected that the NoApiGeocoder will be used.
    undefined
  ];

  // nocks for ARCGIS
  const baseArcGisPath = "/arcgis/rest/services/World/GeocodeServer/";
  nock("https://geocode.arcgis.com")
    // autocomplete
    .get(`${baseArcGisPath}suggest`)
    .query(true)
    .replyWithFile(200, mockResponsePath("arcgis", "suggest-response.json"))
    // reverse
    .get(`${baseArcGisPath}reverseGeocode`)
    .twice()
    .query(true)
    .replyWithFile(
      200,
      mockResponsePath("arcgis", "reverseGeocode-response.json")
    )
    // search
    .get(`${baseArcGisPath}findAddressCandidates`)
    .query(true)
    .replyWithFile(
      200,
      mockResponsePath("arcgis", "findAddressCandidates-response.json")
    )
    // a 2nd search for purposes of resolving getLocationFromGeocodedFeature test
    .get(`${baseArcGisPath}findAddressCandidates`)
    .query(true)
    .replyWithFile(
      200,
      mockResponsePath("arcgis", "findAddressCandidates-response.json")
    );

  // nocks for PELIAS
  const basePeliasPath = "/pelias/v1/";
  nock("https://ws-st.trimet.org")
    // autocomplete
    .get(`${basePeliasPath}autocomplete`)
    .query(true)
    .replyWithFile(
      200,
      mockResponsePath("pelias", "autocomplete-response.json")
    )
    // search
    .get(`${basePeliasPath}search`)
    .query(true)
    .replyWithFile(200, mockResponsePath("pelias", "search-response.json"))
    // reverse, includes not using zip/country in returned location.name.
    .get(`${basePeliasPath}reverse`)
    .twice()
    .query(true)
    .replyWithFile(200, mockResponsePath("pelias", "reverse-response.json"));

  // nocks for HERE
  nock(/.*\.hereapi\.com/)
    .persist()
    // autocomplete
    .get(`/v1/autosuggest`)
    .query(true)
    .replyWithFile(200, mockResponsePath("here", "autosuggest-response.json"))
    // geocode
    .get("/v1/geocode")
    .query(true)
    .replyWithFile(200, mockResponsePath("here", "search-response.json"))
    // reverse
    .get("/v1/revgeocode")
    .twice()
    .query(true)
    .replyWithFile(200, mockResponsePath("here", "reverse-response.json"));

  // nocks for PHOTON
  nock("https://photon.komoot.io/")
    // autocomplete & search
    .get("/api")
    .twice()
    .query(true)
    .replyWithFile(200, mockResponsePath("photon", "search-response.json"))
    // reverse
    .get("/reverse")
    .twice()
    .query(true)
    .replyWithFile(200, mockResponsePath("photon", "reverse-response.json"));

  // nocks for OTP
  nock("http://dummy.dummy/")
    // autocomplete & search
    .get("/otp/geocode/stopClusters")
    .twice()
    .query(true)
    .replyWithFile(200, mockResponsePath("otp", "autocomplete-response.json"));

  const AUTOCOMPLETE_ONLY = ["OTP"];
  geocoders.forEach(geocoder => {
    const geocoderType = geocoder ? geocoder.type : "NoApiGeocoder";
    // the describe is in quotes to bypass a lint rule
    describe(`${geocoderType}`, () => {
      it("should make autocomplete query", async () => {
        const result = await getGeocoder(geocoder).autocomplete({
          text: "Mill Ends"
        });
        expect(result).toMatchSnapshot();
      });

      it("should make search query", async () => {
        const result = await getGeocoder(geocoder).search({
          text: "Mill Ends"
        });
        expect(result).toMatchSnapshot();
      });

      it("should make reverse query", async () => {
        if (AUTOCOMPLETE_ONLY.includes(geocoderType)) {
          return;
        }

        const result = await getGeocoder(geocoder).reverse({
          point: { lat: 45.516198, lon: -122.67324 }
        });
        expect(result).toMatchSnapshot();
      });

      it("should make reverse query with featurecollection enabled", async () => {
        if (AUTOCOMPLETE_ONLY.includes(geocoderType)) {
          return;
        }

        const result = await getGeocoder({
          ...geocoder,
          reverseUseFeatureCollection: true
        }).reverse({
          point: { lat: 45.516198, lon: -122.67324 }
        });
        expect(result).toMatchSnapshot();
      });

      it("should get location from geocode feature", async () => {
        if (AUTOCOMPLETE_ONLY.includes(geocoderType)) {
          return;
        }

        let mockFeature;
        switch (geocoderType) {
          case "ARCGIS":
            mockFeature = {
              magicKey: "abcd",
              properties: {
                label: "Mill Ends City Park, Portland, OR, USA"
              },
              text: "Mill Ends City Park, Portland, OR, USA"
            };
            break;
          case "PELIAS":
            mockFeature = {
              geometry: {
                coordinates: [-122.67324, 45.516198],
                type: "Point"
              },
              properties: {
                label: "Mill Ends Park, Portland, OR, USA"
              }
            };
            break;
          case "HERE":
            mockFeature = {
              geometry: {
                coordinates: [-122.67324, 45.516198],
                type: "Point"
              },
              properties: {
                label: "Mill Ends Park, Portland, OR, USA"
              }
            };
            break;
          case "PHOTON":
            mockFeature = {
              geometry: {
                coordinates: [-122.67325, 45.51621],
                type: "Point"
              },
              properties: {
                label:
                  "Mill Ends Park, Southwest Naito Parkway, Downtown, OR, 97204, Portland, États-Unis d'Amérique",
                country: "États-Unis d'Amérique",
                city: "Portland",
                postcode: "97204",
                street: "Southwest Naito Parkway",
                district: "Downtown",
                name: "Mill Ends Park",
                state: "OR"
              }
            };
            break;
          case "NoApiGeocoder":
            mockFeature = {
              geometry: {
                coordinates: [-122.67324, 45.516198],
                type: "Point"
              },
              properties: {
                label: "45.516198, -122.673240"
              }
            };
            break;
          default:
            throw new Error(
              `no mock feature defined for geocoder type: ${geocoder.type}`
            );
        }
        const result = await getGeocoder(
          geocoder
        ).getLocationFromGeocodedFeature(mockFeature);
        expect(result).toMatchSnapshot();
      });

      // geocoder-specific tests
      if (geocoderType === "PELIAS") {
        const mockSources = "gn,oa,osm,wof";

        // sources should not be sent unless they are explicitly defined in the
        // query. See https://github.com/ibi-group/trimet-mod-otp/issues/239
        it("should not send sources in autocomplete by default", () => {
          // create mock API to check query
          const mockPeliasAPI = {
            autocomplete: query => {
              expect(query.sources).not.toBe(expect.anything());
              return Promise.resolve();
            }
          };
          const pelias = new PeliasGeocoder(mockPeliasAPI, geocoder);
          pelias.autocomplete({ text: "Mill Ends" });
        });

        // should send sources if they're defined in the config
        it("should send sources in autocomplete if defined in config", () => {
          // create mock API to check query
          const mockPeliasAPI = {
            autocomplete: query => {
              expect(query.sources).toBe(mockSources);
              return Promise.resolve();
            }
          };
          const pelias = new PeliasGeocoder(mockPeliasAPI, {
            ...geocoder,
            sources: mockSources
          });
          pelias.autocomplete({ text: "Mill Ends" });
        });

        // sources should not be sent unless they are explicitly defined in the
        // query. See https://github.com/ibi-group/trimet-mod-otp/issues/239
        it("should not send sources in search by default", () => {
          // create mock API to check query
          const mockPeliasAPI = {
            search: query => {
              expect(query.sources).not.toBe(expect.anything());
              return Promise.resolve();
            }
          };
          const pelias = new PeliasGeocoder(mockPeliasAPI, geocoder);
          pelias.search({ text: "Mill Ends" });
        });

        // should send sources if they're defined in the config
        it("should send sources in search if defined in config", () => {
          // create mock API to check query
          const mockPeliasAPI = {
            search: query => {
              expect(query.sources).toBe(mockSources);
              return Promise.resolve();
            }
          };
          const pelias = new PeliasGeocoder(mockPeliasAPI, {
            ...geocoder,
            sources: mockSources
          });
          pelias.search({ text: "Mill Ends" });
        });
      }
    });
  });
});
