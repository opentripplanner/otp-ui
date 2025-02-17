/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-use-before-define */
import coreUtils from "@opentripplanner/core-utils";
import getGeocoder from "@opentripplanner/geocoder";
// @ts-ignore Not Typescripted Yet
import LocationIcon from "@opentripplanner/location-icon";
import { Location } from "@opentripplanner/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormattedList, FormattedMessage, useIntl } from "react-intl";
import { Ban } from "@styled-icons/fa-solid/Ban";
import { Bus } from "@styled-icons/fa-solid/Bus";
import { ExclamationCircle } from "@styled-icons/fa-solid/ExclamationCircle";
import { LocationArrow } from "@styled-icons/fa-solid/LocationArrow";
import { Search } from "@styled-icons/fa-solid/Search";
import { Times } from "@styled-icons/fa-solid/Times";
import { debounce } from "throttle-debounce";

import flatten from "flat";
import {
  GeocodedOptionIcon,
  ICON_SIZE,
  Option,
  TransitStopOption,
  UserLocationIcon,
  getRenderData
} from "./options";
import * as S from "./styled";
import { LocationFieldProps, ResultType } from "./types";
import {
  addInParentheses,
  generateLabel,
  GeocoderResultsConstants,
  getCombinedLabel,
  getGeocoderErrorMessage,
  getMatchingLocations
} from "./utils";
import defaultEnglishMessages from "../i18n/en-US.yml";

const optionIdPrefix = "otpui-locf-option";

/**
 * Formats the option id based on its given index position.
 * This assumes only one location dropdown is shown at a time.
 */
function getOptionId(index: number): string {
  return `${optionIdPrefix}-${index}`;
}

// FIXME have a better key generator for options
let optionKey = 0;

function DefaultLocationIcon({
  locationType
}: {
  locationType: string;
}): React.ReactElement {
  return <LocationIcon size={ICON_SIZE} type={locationType} />;
}

/**
 * Helper function that includes or excludes features based om layers.
 */
function filter(
  list: any[],
  layers: string[],
  include: boolean,
  limit: number
): any[] {
  return list
    .filter(feature => layers.includes(feature.properties.layer) === include)
    .slice(0, limit);
}

const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

/**
 * Puts the given geocoded features into several categories with upper bounds.
 */
function getFeaturesByCategoryWithLimit(
  geocodedFeatures: any[],
  suggestionCount: number,
  sortByDistance: boolean,
  preferredLayers: string[]
) {
  // Split features into those we want to always show above others
  const { special, normal } = geocodedFeatures.reduce(
    (prev, cur) => {
      prev[
        preferredLayers.includes(cur?.properties?.layer) ? "special" : "normal"
      ].push(cur);
      return prev;
    },
    { special: [], normal: [] }
  );

  const sortedGeocodedFeatures = [
    ...special,
    ...normal.sort((a, b) => {
      if (!sortByDistance) return 0;
      return (
        (b.properties?.distance || Infinity) -
        (a.properties?.distance || Infinity)
      );
    })
  ];

  // Split out different types of transit results
  // To keep the list tidy, only include a subset of the responses for each category
  const stopFeatures = filter(
    sortedGeocodedFeatures,
    ["stops"],
    true,
    suggestionCount
  );
  const stationFeatures = filter(
    sortedGeocodedFeatures,
    ["stations"],
    true,
    suggestionCount
  );
  const otherFeatures = filter(
    sortedGeocodedFeatures,
    ["stops", "stations"],
    false,
    suggestionCount
  );

  return {
    otherFeatures,
    stationFeatures,
    stopFeatures
  };
}

/**
 * Helper to render and register a user-saved location.
 */
function makeUserOption(userLocation, index, key, activeIndex, selectHandlers) {
  const { displayName, icon, locationSelected } = userLocation;
  // Add to the selection handler lookup (for use in onKeyDown)
  selectHandlers[index] = locationSelected;
  return (
    <Option
      icon={icon}
      id={getOptionId(index)}
      isActive={index === activeIndex}
      key={key}
      onClick={locationSelected}
      title={displayName}
    />
  );
}

const renderFeature = (
  itemIndex,
  layerColorMap,
  feature,
  operatorIconMap,
  setLocation,
  addLocationSearch,
  showSecondaryLabels,
  locationSelectedLookup,
  activeIndex,
  GeocodedOptionIconComponent,
  geocoderConfig
) => {
  // generate the friendly labels for this feature
  const { main, secondary } = generateLabel(feature.properties);

  // Create the selection handler
  const locationSelected = () => {
    getGeocoder(geocoderConfig)
      .getLocationFromGeocodedFeature(feature)
      .then(geocodedLocation => {
        // add the friendly location labels for use later on
        geocodedLocation.main = main;
        geocodedLocation.secondary = secondary;
        geocodedLocation.name = getCombinedLabel(feature.properties);
        // Set the current location
        setLocation(geocodedLocation, "GEOCODE");
        // Add to the location search history. This is intended to
        // populate the sessionSearches array.
        addLocationSearch({ location: geocodedLocation });
      });
  };

  // Add to the selection handler lookup (for use in onKeyDown)
  locationSelectedLookup[itemIndex] = locationSelected;

  // Extract GTFS/POI info and assign to class
  const { id, layer, secondaryLabels, source } = feature.properties;
  const classNames = [];
  let operatorIcon;
  // Operator only exists on transit features
  const featureIdComponents = source === "transit" && id.split("::");
  if (featureIdComponents.length > 1 && featureIdComponents?.[1].length > 0) {
    const operatorName = featureIdComponents[1]
      .replace(/ /g, "-")
      .toLowerCase();
    classNames.push(`operator-${operatorName}`);
    operatorIcon = operatorIconMap[operatorName];
  }

  classNames.push(`source-${source}`);
  classNames.push(`layer-${layer}`);

  // Create and return the option menu item
  return (
    <Option
      classes={classNames.join(" ")}
      color={layerColorMap[layer]}
      icon={operatorIcon || <GeocodedOptionIconComponent feature={feature} />}
      id={getOptionId(itemIndex)}
      isActive={itemIndex === activeIndex}
      key={optionKey++}
      onClick={locationSelected}
      title={main}
      subTitle={secondary}
      secondaryLabels={secondaryLabels}
      showSecondaryLabels={showSecondaryLabels}
    />
  );
};

const FeatureHeader = ({
  bgColor,
  headerMessage,
  headingType,
  title
}: {
  bgColor: string;
  headerMessage: JSX.Element;
  headingType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  title: string;
}) => (
  <S.MenuGroupHeader as={headingType} bgColor={bgColor} key={title}>
    {headerMessage}
  </S.MenuGroupHeader>
);

const FeaturesElements = ({
  activeIndex,
  addLocationSearch,
  bgColor,
  features,
  GeocodedOptionIconComponent,
  geocoderConfig,
  headerMessage,
  headingType,
  itemIndex,
  layerColorMap,
  locationSelectedLookup,
  operatorIconMap,
  setLocation,
  showSecondaryLabels,
  title
}: {
  activeIndex: number;
  addLocationSearch: ({
    location: GeocodedLocation
  }: {
    location: any;
  }) => void;
  bgColor: string;
  features: JSX.Element[];
  GeocodedOptionIconComponent: any;
  geocoderConfig: any;
  headerMessage: JSX.Element;
  headingType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  itemIndex: number;
  layerColorMap: any;
  locationSelectedLookup: any;
  operatorIconMap: any;
  setLocation: (newLocation: Location, resultType: ResultType) => void;
  showSecondaryLabels: boolean;
  title: string;
}) => {
  return (
    <>
      <FeatureHeader
        bgColor={bgColor}
        headerMessage={headerMessage}
        headingType={headingType}
        title={title}
      />
      {features.map(feature =>
        renderFeature(
          itemIndex++,
          layerColorMap,
          feature,
          operatorIconMap,
          setLocation,
          addLocationSearch,
          showSecondaryLabels,
          locationSelectedLookup,
          activeIndex,
          GeocodedOptionIconComponent,
          geocoderConfig
        )
      )}
    </>
  );
};

const LocationField = ({
  addLocationSearch = () => {},
  autoFocus = false,
  className = null,
  clearButtonIcon = <Times size={ICON_SIZE} />,
  clearLocation = () => {},
  currentPosition = null,
  currentPositionIcon = <LocationArrow size={ICON_SIZE} />,
  currentPositionUnavailableIcon = <Ban size={ICON_SIZE} />,
  findNearbyStops = () => {},
  GeocodedOptionIconComponent = GeocodedOptionIcon,
  geocoderConfig,
  geocoderResultsOrder = [
    GeocoderResultsConstants.STATIONS,
    GeocoderResultsConstants.STOPS,
    GeocoderResultsConstants.OTHER
  ],
  getCurrentPosition,
  hideExistingValue = false,
  initialSearchResults = null,
  inputPlaceholder = null,
  isRequired = false,
  isStatic = false,
  isValid = true,
  layerColorMap = {},
  location = null,
  LocationIconComponent = DefaultLocationIcon,
  locationType,
  nearbyStops = [],
  onLocationSelected,
  onTextInputClick = null,
  operatorIconMap = {},
  preferredLayers = [],
  sessionOptionIcon = <Search size={ICON_SIZE} />,
  sessionSearches = [],
  showClearButton = true,
  showSecondaryLabels = true,
  showUserSettings = false,
  sortByDistance = false,
  stopOptionIcon = <Bus size={ICON_SIZE} />,
  stopsIndex = null,
  suggestionCount = 3,
  suggestionHeadingType: headingType,
  suppressNearby = false,
  UserLocationIconComponent = UserLocationIcon,
  userLocationsAndRecentPlaces = []
}: LocationFieldProps): React.ReactElement => {
  /**
   * Gets the initial value to place in the input field.
   */
  const getValueFromLocation = () => {
    const label = location?.name || "";
    return location && !hideExistingValue ? label : "";
  };

  const formControlClassname = `${locationType}-form-control`;

  const listBoxId = `${locationType}-listbox`;

  const intl = useIntl();

  const [activeIndex, setActiveIndex] = useState(null);
  const [stateGeocodedFeatures, setGeocodedFeatures] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [stateMessage, setMessage] = useState(null);
  const [stateValue, setValue] = useState(getValueFromLocation());
  const [abortControllers, setAbortController] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    // location could be null if none is set
    setValue(location?.name || "");
    setGeocodedFeatures([]);
  }, [location]);

  useEffect(() => {
    if (initialSearchResults) {
      setGeocodedFeatures(initialSearchResults);
      setMenuVisible(true);
    }
  }, [initialSearchResults]);

  // TODO: is it possible to restore the useCallback while also setting
  // a new abort controller?
  const geocodeAutocomplete = debounce(300, (text: string) => {
    if (!text) {
      console.warn("No text entry provided for geocode autocomplete search.");
      setMessage(null);
      return;
    }
    setFetching(true);
    setMessage(
      intl.formatMessage({
        defaultMessage: "Fetching suggestions…",
        description: "Hint shown while geocoder suggestions are being fetched",
        id: "otpUi.LocationField.fetchingSuggestions"
      })
    );
    const newController = new AbortController();
    setAbortController([...abortControllers, newController]);

    getGeocoder(geocoderConfig)
      .autocomplete({ text, options: { signal: newController.signal } })
      // TODO: Better type?
      .then(
        (result: {
          features: Location[];
          results: { error: { message: string } };
        }) => {
          let message: string;
          // If no features found in response, default to empty array.
          let geocodedFeatures = result?.features;
          if (!geocodedFeatures) {
            // Get the Pelias error message if exists.
            // TODO: determine how other geocoders return error messages.
            const errorMessage = result?.results?.error?.message;
            // If the result did not contain a list of features, add special note.
            message = getGeocoderErrorMessage(intl, errorMessage);
            geocodedFeatures = [];
          } else {
            const {
              otherFeatures,
              stationFeatures,
              stopFeatures
            } = getFeaturesByCategoryWithLimit(
              geocodedFeatures,
              suggestionCount,
              sortByDistance,
              preferredLayers
            );
            // Breakdown results found by type.
            const parts = [];
            if (stopFeatures.length) {
              parts.push(
                intl.formatMessage(
                  {
                    description: "Shows the count of transit stops",
                    id: "otpUi.LocationField.stopCount"
                  },
                  { count: stopFeatures.length }
                )
              );
            }
            if (stationFeatures.length) {
              parts.push(
                intl.formatMessage(
                  {
                    description: "Shows the count of stations",
                    id: "otpUi.LocationField.stationCount"
                  },
                  { count: stationFeatures.length }
                )
              );
            }
            if (otherFeatures.length) {
              parts.push(
                intl.formatMessage(
                  {
                    description: "Shows the count of other places",
                    id: "otpUi.LocationField.otherCount"
                  },
                  { count: otherFeatures.length }
                )
              );
            }
            const hasResults = parts.length !== 0;
            const results = hasResults
              ? intl.formatList(parts, { type: "conjunction" })
              : intl.formatMessage({
                  description: "Indicates no results",
                  id: "otpUi.LocationField.noResults"
                });
            const resultsFoundText = intl.formatMessage(
              {
                description: "Text about geocoder results found",
                id: "otpUi.LocationField.resultsFound"
              },
              {
                input: text,
                results
              }
            );
            if (hasResults) {
              // If there are results, concatenate sentences about results found and
              // instructions for assistive technology users on how to access results.
              const instructions = intl.formatMessage({
                description: "Instructions on accessing geocoder results",
                id: "otpUi.LocationField.howToAccessResults"
              });
              message = `${resultsFoundText} ${instructions}`;
            } else {
              message = resultsFoundText;
            }
          }
          setGeocodedFeatures(geocodedFeatures);
          setMessage(message);
          setFetching(false);
        }
      )
      .catch((err: unknown) => {
        console.error(err);
        const message = getGeocoderErrorMessage(intl, err.toString());
        setMessage(message);
      });
  });

  /** Clear selection & hide the menu. */
  const closeMenu = useCallback(() => {
    setMenuVisible(false);
    setActiveIndex(null);
  }, [setMessage, setMenuVisible, setActiveIndex]);

  const setLocation = (newLocation: Location, resultType: ResultType) => {
    onLocationSelected({
      location: newLocation,
      locationType,
      resultType
    });
    closeMenu();
    setMessage(null);
  };

  const useCurrentLocation = () => {
    const newLocation = coreUtils.map.currentPositionToLocation(
      currentPosition
    );
    if (newLocation) {
      // If geolocation is successful (i.e., user has granted app geolocation
      // permission and coords exist), set location.
      onLocationSelected({
        location: newLocation,
        locationType,
        resultType: "CURRENT_LOCATION"
      });
    } else {
      // Call geolocation.getCurrentPosition and set as from/to locationType
      getCurrentPosition(intl, locationType);
    }
    setMenuVisible(false);
  };

  const onClearButtonClick = () => {
    clearLocation({ locationType });
    setValue("");
    setMessage(null);
    setGeocodedFeatures([]);
    inputRef.current.focus();
    handleTextInputClick();
  };

  const onDropdownToggle = () => {
    setMenuVisible(!menuVisible);
  };

  /**
   * Only hide menu if the target clicked is not a menu item in the dropdown.
   * Otherwise, the click will not "finish" and the menu will hide without the
   * user having made a selection.
   */
  const onBlurFormGroup = e => {
    // IE does not use relatedTarget, so this check handles cross-browser support.
    // see https://stackoverflow.com/a/49325196/915811
    const target =
      e.relatedTarget !== null ? e.relatedTarget : document.activeElement;
    if (!target || target.getAttribute("role") !== "option") {
      // Hide the menu and messages, but:
      // - don't remove features,
      //   so that when the component gets focus again later, these features are shown
      //   (unless the location prop changed, in which case the features will be cleared by other code),
      // - don't revert the input text to previous location, so that users don't have to re-enter their text
      //   (unless the location prop changed, in which case the text will be updated by other code).
      closeMenu();
    }
  };

  const onTextInputChange = evt => {
    const { value } = evt.target;
    setValue(value);
    setMenuVisible(true);

    // Cancel all pending requests
    abortControllers.forEach(ac => ac.abort());

    geocodeAutocomplete(value);
  };

  const handleTextInputClick = () => {
    if (typeof onTextInputClick === "function") onTextInputClick();
    setMenuVisible(true);
    if (nearbyStops.length === 0 && currentPosition && currentPosition.coords) {
      findNearbyStops({
        lat: currentPosition.coords.latitude,
        lon: currentPosition.coords.longitude,
        max: geocoderConfig.maxNearbyStops || 4
      });
    }
  };

  const onKeyDown = evt => {
    switch (evt.key) {
      // 'Down' arrow key pressed: move selected menu item down by one position
      case "ArrowDown":
        // Suppress default 'ArrowDown' behavior which moves cursor to end
        evt.preventDefault();
        if (!menuVisible) {
          // If the menu is not visible, simulate a text input click to show it.
          handleTextInputClick();
        } else if (activeIndex === menuItemCount - 1) {
          setActiveIndex(null);
        } else {
          setActiveIndex(activeIndex === null ? 0 : activeIndex + 1);
        }
        break;
      // 'Up' arrow key pressed: move selection up by one position
      case "ArrowUp":
        // Suppress default 'ArrowUp' behavior which moves cursor to beginning
        evt.preventDefault();
        if (activeIndex === 0) {
          setActiveIndex(null);
        } else {
          setActiveIndex(
            activeIndex === null ? menuItemCount - 1 : activeIndex - 1
          );
        }
        break;
      // 'Enter' keypress serves two purposes:
      //  - If pressed when typing in search string, switch from 'autocomplete'
      //    to 'search' geocoding
      //  - If pressed when dropdown results menu is active, apply the location
      //    associated with current selected menu item
      case "Enter":
        if (typeof activeIndex === "number") {
          // Menu is active
          // Retrieve location selection handler from lookup object and invoke
          const locationSelected = locationSelectedLookup[activeIndex];
          if (locationSelected) locationSelected();

          closeMenu();
          setMessage(null);
        } else {
          // Menu not active; get geocode 'search' results
          geocodeSearch(evt.target.value);
          // Ensure menu is visible.
          setMenuVisible(true);
        }

        // Suppress default 'Enter' behavior which causes page to reload
        evt.preventDefault();
        break;
      case "Escape":
      case "Tab":
        closeMenu();
        break;
      // Any other key pressed: clear active selection
      default:
        setActiveIndex(null);
        break;
    }
  };

  const geocodeSearch = text => {
    if (!text) {
      console.warn("No text entry provided for geocode search.");
      return;
    }
    getGeocoder(geocoderConfig)
      .search({ text })
      .then(result => {
        if (result?.features?.length > 0) {
          // Only replace geocode items if results were found
          setGeocodedFeatures(result.features);
          setMessage(null);
        } else {
          console.warn(
            "No results found for geocode search. Not replacing results."
          );
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const message = stateMessage;
  const geocodedFeatures = stateGeocodedFeatures;

  if (sessionSearches.length > 5) sessionSearches = sessionSearches.slice(0, 5);

  // Assemble menu contents, to be displayed either as dropdown or static panel.
  // Menu items are created in four phases: (1) the current location, (2) any
  // geocoder search results; (3) nearby transit stops; and (4) saved searches

  const statusMessages = [];
  let menuItems = []; // array of menu items for display (may include non-selectable items e.g. dividers/headings)
  let itemIndex = 0; // the index of the current location-associated menu item (excluding non-selectable items)
  const locationSelectedLookup = {}; // maps itemIndex to a location selection handler (for use by the onKeyDown method)
  const userLocationRenderData = showUserSettings
    ? userLocationsAndRecentPlaces.map(loc =>
        getRenderData(loc, setLocation, UserLocationIconComponent, intl)
      )
    : [];

  /* 0) Include user saved locations if the typed text contains those locations name. */
  if (showUserSettings) {
    const matchingLocations = getMatchingLocations(
      userLocationRenderData,
      stateValue
    );
    if (matchingLocations.length) {
      // Iterate through any saved locations
      menuItems = menuItems.concat(
        matchingLocations.map(userLocation =>
          makeUserOption(
            userLocation,
            itemIndex++,
            optionKey++,
            itemIndex === activeIndex,
            locationSelectedLookup
          )
        )
      );
    }
  }

  /* 1) Process geocode search result option(s) */
  if (geocodedFeatures.length > 0) {
    const {
      otherFeatures,
      stationFeatures,
      stopFeatures
    } = getFeaturesByCategoryWithLimit(
      geocodedFeatures,
      suggestionCount,
      sortByDistance,
      preferredLayers
    );

    // Create an array of results to display based on the geocoderResultsOrder
    const featuresElementsArray = geocoderResultsOrder.map(result => {
      let element;

      const FeaturesElementProps = {
        headingType,
        itemIndex,
        operatorIconMap,
        setLocation,
        addLocationSearch,
        showSecondaryLabels,
        locationSelectedLookup,
        activeIndex,
        GeocodedOptionIconComponent,
        layerColorMap,
        geocoderConfig
      };
      switch (result) {
        case GeocoderResultsConstants.OTHER:
          element = otherFeatures.length > 0 && (
            <FeaturesElements
              bgColor="#333"
              features={otherFeatures}
              headerMessage={
                <FormattedMessage
                  defaultMessage={defaultMessages["otpUi.LocationField.other"]}
                  description="Text for header above the 'other' category of geocoder results"
                  id="otpUi.LocationField.other"
                />
              }
              key="other-header"
              title="other"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...FeaturesElementProps}
            />
          );
          break;
        case GeocoderResultsConstants.STATIONS:
          element = stationFeatures.length > 0 && (
            <FeaturesElements
              bgColor={layerColorMap.stations}
              features={stationFeatures}
              headerMessage={
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.LocationField.stations"]
                  }
                  description="Text for header above the 'stations' category of geocoder results"
                  id="otpUi.LocationField.stations"
                />
              }
              key="gtfs-stations-header"
              title="stations"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...FeaturesElementProps}
            />
          );
          break;
        case GeocoderResultsConstants.STOPS:
          element = stopFeatures.length > 0 && (
            <FeaturesElements
              bgColor={layerColorMap.stops}
              features={stopFeatures}
              headerMessage={
                <FormattedMessage
                  defaultMessage={defaultMessages["otpUi.LocationField.stops"]}
                  description="Text for header above the 'stops' category of geocoder results"
                  id="otpUi.LocationField.stops"
                />
              }
              key="gtfs-stops-header"
              title="stops"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...FeaturesElementProps}
            />
          );
          break;
        default:
          element = null;
          break;
      }
      return element;
    });

    // Iterate through the geocoder results
    menuItems = menuItems.concat(featuresElementsArray);
  }

  /* 2) Process nearby transit stop options */
  if (nearbyStops.length > 0 && !suppressNearby) {
    // Add the menu sub-heading (not a selectable item)
    menuItems.push(
      <S.MenuGroupHeader as={headingType} key="ns-header">
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.LocationField.nearby"]}
          description="Text for header above nearby stops"
          id="otpUi.LocationField.nearby"
        />
      </S.MenuGroupHeader>
    );

    // Iterate through the found nearby stops
    menuItems = menuItems.concat(
      nearbyStops.map(stopId => {
        // Construct the location
        const stop = stopsIndex[stopId];
        const stopLocation = {
          id: stopId,
          lat: stop.lat,
          lon: stop.lon,
          name: stop.name
        };

        // Create the location selected handler
        const locationSelected = () => {
          setLocation(stopLocation, "STOP");
        };

        // Add to the selection handler lookup (for use in onKeyDown)
        locationSelectedLookup[itemIndex] = locationSelected;

        // Create and return the option menu item
        const option = (
          <TransitStopOption
            id={getOptionId(itemIndex)}
            isActive={itemIndex === activeIndex}
            key={optionKey++}
            onClick={locationSelected}
            stop={stop}
            stopOptionIcon={stopOptionIcon}
          />
        );
        itemIndex++;
        return option;
      })
    );
  }

  /* 3) Process recent search history options */
  if (sessionSearches.length > 0) {
    // Add the menu sub-heading (not a selectable item)
    menuItems.push(
      <S.MenuGroupHeader as={headingType} key="ss-header">
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.LocationField.recentlySearched"]
          }
          description="Text for header above recently searched items"
          id="otpUi.LocationField.recentlySearched"
        />
      </S.MenuGroupHeader>
    );

    // Iterate through any saved locations
    menuItems = menuItems.concat(
      sessionSearches.map(sessionLocation => {
        // Create the location-selected handler
        const locationSelected = () => {
          setLocation(sessionLocation, "SESSION");
        };

        // Add to the selection handler lookup (for use in onKeyDown)
        locationSelectedLookup[itemIndex] = locationSelected;
        // Create and return the option menu item
        const option = (
          <Option
            icon={sessionOptionIcon}
            id={getOptionId(itemIndex)}
            isActive={itemIndex === activeIndex}
            key={optionKey++}
            onClick={locationSelected}
            subTitle={sessionLocation.secondary || ""}
            // just use the name if there is no main/secondary field
            title={sessionLocation.main || sessionLocation.name}
          />
        );
        itemIndex++;
        return option;
      })
    );
  }

  /* 3b) Process stored user locations */
  if (userLocationsAndRecentPlaces.length > 0 && showUserSettings) {
    // Add the menu sub-heading (not a selectable item)
    menuItems.push(
      <S.MenuGroupHeader as={headingType} key="mp-header">
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.LocationField.myPlaces"]}
          description="Text for header above user-saved places"
          id="otpUi.LocationField.myPlaces"
        />
      </S.MenuGroupHeader>
    );

    // Iterate through any saved locations
    menuItems = menuItems.concat(
      userLocationRenderData.map(userLocation =>
        makeUserOption(
          userLocation,
          itemIndex++,
          optionKey++,
          itemIndex === activeIndex,
          locationSelectedLookup
        )
      )
    );
  }

  /* 4) Process the current location */
  let locationSelected;
  let optionIcon;
  let optionTitle;
  let positionUnavailable;

  if (currentPosition && !currentPosition.error) {
    // current position detected successfully
    locationSelected = useCurrentLocation;
    optionIcon = currentPositionIcon;
    optionTitle = intl.formatMessage({
      id: "otpUi.LocationField.useCurrentLocation"
    });
    positionUnavailable = false;
  } else {
    // Error detecting current position.
    // If there is an error, concatenate the error message in parentheses.
    optionIcon = currentPositionUnavailableIcon;
    const locationUnavailableText = intl.formatMessage({
      description: "Current location unavailable status",
      id: "otpUi.LocationField.currentLocationUnavailable"
    });
    const errorText = !currentPosition
      ? undefined
      : typeof currentPosition.error === "string"
      ? currentPosition.error
      : currentPosition.error.message;

    optionTitle = addInParentheses(intl, locationUnavailableText, errorText);
    positionUnavailable = true;
    statusMessages.push(optionTitle);
  }

  // Add to the selection handler lookup (for use in onKeyDown)
  locationSelectedLookup[itemIndex] = locationSelected;

  if (!suppressNearby) {
    // Create and add the option item to the menu items array
    menuItems.push(
      <Option
        disabled={positionUnavailable}
        icon={optionIcon}
        id={getOptionId(itemIndex)}
        isActive={itemIndex === activeIndex}
        key={optionKey++}
        onClick={locationSelected}
        title={optionTitle}
      />
    );
    if (!positionUnavailable) itemIndex++;
  }
  if (message && !message.includes("AbortError")) {
    if (geocodedFeatures.length === 0) {
      const icon = isFetching ? (
        <S.Spinner size={ICON_SIZE} />
      ) : (
        <ExclamationCircle size={ICON_SIZE} />
      );
      menuItems.unshift(
        <Option disabled icon={icon} key={optionKey++} title={message} />
      );
    }
    statusMessages.push(message);
  }

  // Store the number of location-associated items for reference in the onKeyDown method
  let menuItemCount = itemIndex;

  /** the text input element * */
  // Use this text for aria-label below.
  const defaultPlaceholder = inputPlaceholder || locationType;
  const placeholder =
    currentPosition && currentPosition.fetching
      ? intl.formatMessage({ id: "otpUi.LocationField.fetchingLocation" })
      : defaultPlaceholder;
  const hasNoEnabledOptions = menuItemCount === 0;
  const isExpanded = isStatic || menuVisible;

  const textControl = (
    <S.Input
      aria-activedescendant={
        activeIndex !== null ? getOptionId(activeIndex) : null
      }
      aria-autocomplete="list"
      aria-controls={listBoxId}
      aria-expanded={isExpanded}
      aria-haspopup="listbox"
      aria-invalid={!isValid}
      aria-label={defaultPlaceholder}
      aria-required={isRequired}
      autoFocus={autoFocus}
      className={formControlClassname}
      onChange={onTextInputChange}
      onClick={handleTextInputClick}
      spellCheck={false}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      ref={inputRef}
      role="combobox"
      value={stateValue}
    />
  );

  // Only include the clear ('X') button add-on if a location is selected
  // or if the input field has text.
  const clearButton =
    showClearButton && location ? (
      <S.ClearButton
        aria-label={intl.formatMessage({
          id: "otpUi.LocationField.clearLocation"
        })}
        onClick={onClearButtonClick}
      >
        {clearButtonIcon}
      </S.ClearButton>
    ) : null;

  const ItemList = isStatic ? S.StaticMenuItemList : S.MenuItemList;

  return (
    <S.InputGroup className={className} onBlur={onBlurFormGroup} role="group">
      <S.DropdownButton
        aria-controls={listBoxId}
        aria-expanded={isExpanded}
        aria-label={intl.formatMessage({
          defaultMessage: "Open the list of location suggestions",
          description:
            "Text to show as a a11y label for the button that opens the dropdown list of locations",
          id: "otpUi.LocationField.suggestedLocationsLong"
        })}
        onClick={onDropdownToggle}
        tabIndex={-1}
      >
        <LocationIconComponent locationType={locationType} />
      </S.DropdownButton>
      {textControl}
      {clearButton}
      {/* Note: always render this status tag regardless of the open state,
          so that assistive technologies correctly set up status monitoring. */}
      <S.HiddenContent role="status">
        {/* However, only render the status if the menu is expanded, so that
            assistive technology reminds user on how to navigate the options. */}
        {isExpanded && (
          <FormattedList
            // eslint-disable-next-line react/style-prop-object
            style="narrow"
            type="conjunction"
            value={statusMessages}
          />
        )}
      </S.HiddenContent>
      <ItemList
        // Hide the list from screen readers if no enabled options are shown.
        aria-hidden={hasNoEnabledOptions || !menuVisible}
        aria-label={intl.formatMessage({
          defaultMessage: "Suggested locations",
          description:
            "Text to show as a label for the dropdown list of locations",
          id: "otpUi.LocationField.suggestedLocations"
        })}
        id={listBoxId}
      >
        {isStatic ? (
          menuItems.length > 0 ? ( // Show typing prompt to avoid empty screen
            menuItems
          ) : (
            <S.MenuGroupHeader as="div">
              <FormattedMessage
                defaultMessage={
                  defaultMessages["otpUi.LocationField.beginTypingPrompt"]
                }
                description="Text to show as initial placeholder in location search field"
                id="otpUi.LocationField.beginTypingPrompt"
              />
            </S.MenuGroupHeader>
          )
        ) : (
          menuVisible && menuItems
        )}
      </ItemList>
    </S.InputGroup>
  );
};

export default LocationField;

// Rename styled components for export.
export { S as Styled };
