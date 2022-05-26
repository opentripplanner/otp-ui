/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-use-before-define */
import coreUtils from "@opentripplanner/core-utils";
import getGeocoder from "@opentripplanner/geocoder";
// @ts-ignore Not Typescripted Yet
import LocationIcon from "@opentripplanner/location-icon";
import React, { useEffect, useState, useRef } from "react";
import { Ban } from "@styled-icons/fa-solid/Ban";
import { Bus } from "@styled-icons/fa-solid/Bus";
import { ExclamationCircle } from "@styled-icons/fa-solid/ExclamationCircle";
import { LocationArrow } from "@styled-icons/fa-solid/LocationArrow";
import { Search } from "@styled-icons/fa-solid/Search";
import { Times } from "@styled-icons/fa-solid/Times";
import { debounce } from "throttle-debounce";
import { useIntl, FormattedMessage } from "react-intl";
// eslint-disable-next-line prettier/prettier
import type { Location } from "@opentripplanner/types";
import type { LocationFieldProps, ResultType } from "./types";

import {
  GeocodedOptionIcon,
  Option,
  TransitStopOption,
  UserLocationIcon
} from "./options";
import * as S from "./styled";
import { generateLabel, getCombinedLabel } from "./utils";

// FIXME have a better key generator for options
let optionKey = 0;

function DefaultLocationIcon({
  locationType
}: {
  locationType: string;
}): React.ReactElement {
  return <LocationIcon size={13} type={locationType} />;
}

const LocationField = ({
  addLocationSearch = () => {},
  autoFocus = false,
  className = null,
  clearButtonIcon = <Times size={13} />,
  clearLocation = () => {},
  currentPosition = null,
  currentPositionIcon = <LocationArrow size={13} />,
  currentPositionUnavailableIcon = <Ban size={13} />,
  findNearbyStops = () => {},
  GeocodedOptionIconComponent = GeocodedOptionIcon,
  geocoderConfig,
  getCurrentPosition,
  hideExistingValue = false,
  initialSearchResults = null,
  inputPlaceholder = null,
  isStatic = false,
  layerColorMap = {},
  location = null,
  LocationIconComponent = DefaultLocationIcon,
  locationType,
  nearbyStops = [],
  onLocationSelected,
  onTextInputClick = null,
  operatorIconMap = {},
  preferredLayers = [],
  sessionOptionIcon = <Search size={13} />,
  sessionSearches = [],
  showClearButton = true,
  showUserSettings = false,
  sortByDistance = false,
  stopOptionIcon = <Bus size={13} />,
  stopsIndex = null,
  suggestionCount = 3,
  suppressNearby = false,
  UserLocationIconComponent = UserLocationIcon,
  userLocationsAndRecentPlaces = [],
}: LocationFieldProps): React.ReactElement => {
  /**
   * Gets the initial value to place in the input field.
   */
  const getValueFromLocation = () => {
    const label = location?.name || "";
    return location && !hideExistingValue ? label : "";
  };

  const listBoxId = `listbox-${optionKey}`;

  const intl = useIntl();

  const [activeIndex, setActiveIndex] = useState(null);
  const [stateGeocodedFeatures, setGeocodedFeatures] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [stateMessage, setMessage] = useState(null);
  const [stateValue, setValue] = useState(getValueFromLocation());

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

  const geocodeAutocomplete = debounce(300, text => {
    if (!text) {
      console.warn("No text entry provided for geocode autocomplete search.");
      return;
    }
    getGeocoder(geocoderConfig)
      .autocomplete({ text })
      // TODO: Better type?
      .then(
        (result: {
          features: Location[]
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
            message = intl.formatMessage(
              { id: "otpUi.LocationField.geocoderUnreachable" },
              { error: errorMessage }
            );
            geocodedFeatures = [];
          } else if (geocodedFeatures.length === 0) {
            message = intl.formatMessage(
              { id: "otpUi.LocationField.noResultsFound" },
              { input: text }
            );
          }
          setGeocodedFeatures(geocodedFeatures);
          setMessage(message);
        }
      )
      .catch((err: unknown) => {
        console.error(err);
      });
  });

  const getFormControlClassname = () => {
    return `${locationType}-form-control`;
  };

  const setLocation = (newLocation: Location, resultType: ResultType) => {
    onLocationSelected(intl, { location: newLocation, locationType, resultType });
    setMenuVisible(false);
  };

  const useCurrentLocation = () => {
    const newLocation = coreUtils.map.currentPositionToLocation(
      currentPosition
    );
    if (newLocation) {
      // If geolocation is successful (i.e., user has granted app geolocation
      // permission and coords exist), set location.
      onLocationSelected(intl, {
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
      setGeocodedFeatures([]);
      setMenuVisible(false);
      setMessage(null);
      setValue(getValueFromLocation());
    }
  };

  const onTextInputChange = evt => {
    const { value } = evt.target;
    setValue(value);
    setMenuVisible(true);
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

          // Clear selection & hide the menu
          setMenuVisible(false);
          setActiveIndex(null);
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
        // Clear selection & hide the menu
        setMenuVisible(false);
        setActiveIndex(null);
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

  const renderFeature = (itemIndex, feature) => {
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
    const { id, source, layer } = feature.properties;
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
        isActive={itemIndex === activeIndex}
        key={optionKey++}
        onClick={locationSelected}
        title={main}
        subTitle={secondary}
      />
    );
  };

  const message = stateMessage;
  let geocodedFeatures = stateGeocodedFeatures;

  if (sessionSearches.length > 5) sessionSearches = sessionSearches.slice(0, 5);

  // Assemble menu contents, to be displayed either as dropdown or static panel.
  // Menu items are created in four phases: (1) the current location, (2) any
  // geocoder search results; (3) nearby transit stops; and (4) saved searches

  let menuItems = []; // array of menu items for display (may include non-selectable items e.g. dividers/headings)
  let itemIndex = 0; // the index of the current location-associated menu item (excluding non-selectable items)
  const locationSelectedLookup = {}; // maps itemIndex to a location selection handler (for use by the onKeyDown method)

  /* 1) Process geocode search result option(s) */
  if (geocodedFeatures.length > 0) {
    // Split features into those we want to always show above others
    const { special, normal } = geocodedFeatures.reduce(
      (prev, cur) => {
        prev[
          preferredLayers.includes(cur?.properties?.layer)
            ? "special"
            : "normal"
        ].push(cur);
        return prev;
      },
      { special: [], normal: [] }
    );

    geocodedFeatures = [
      ...special,
      ...normal.sort((a, b) => {
        if (!sortByDistance) return 0;
        return (
          (b.properties?.distance || Infinity) -
          (a.properties?.distance || Infinity)
        );
      })
    ];

    // Add the menu sub-heading (not a selectable item)
    // menuItems.push(<MenuItem header key='sr-header'>Search Results</MenuItem>)

    // Split out different types of transit results
    // To keep the list tidy, only include a subset of the responses for each category
    const stopFeatures = geocodedFeatures
      .filter(feature => feature.properties.layer === "stops")
      .slice(0, suggestionCount);
    const stationFeatures = geocodedFeatures
      .filter(feature => feature.properties.layer === "stations")
      .slice(0, suggestionCount);
    const otherFeatures = geocodedFeatures
      .filter(feature => feature.properties.layer !== "stops")
      .filter(feature => feature.properties.layer !== "stations")
      .slice(0, suggestionCount);

    // If no categories of features are returned, this variable is used to
    // avoid displaying headers
    const transitFeaturesPresent =
      stopFeatures.length > 0 || stationFeatures.length > 0;

    // Iterate through the geocoder results
    menuItems = menuItems.concat(
      stationFeatures.length > 0 && (
        <S.MenuItem
          bgColor={layerColorMap.stations}
          centeredText
          header
          key="gtfs-stations-header"
        >
          <FormattedMessage
            description="Text for header above Stations"
            id="otpUi.LocationField.stations"
          />
        </S.MenuItem>
      ),
      stationFeatures.map(feature => renderFeature(itemIndex++, feature)),

      stopFeatures.length > 0 && (
        <S.MenuItem
          bgColor={layerColorMap.stops}
          centeredText
          header
          key="gtfs-stops-header"
        >
          <FormattedMessage
            description="Text for header above Stops"
            id="otpUi.LocationField.stops"
          />
        </S.MenuItem>
      ),
      stopFeatures.map(feature => renderFeature(itemIndex++, feature)),

      transitFeaturesPresent && otherFeatures.length > 0 && (
        <S.MenuItem bgColor="#333" centeredText header key="other-header">
          <FormattedMessage
            description="Text for header above the 'other'"
            id="otpUi.LocationField.other"
          />
        </S.MenuItem>
      ),
      otherFeatures.map(feature => renderFeature(itemIndex++, feature))
    );
  }

  /* 2) Process nearby transit stop options */
  if (nearbyStops.length > 0 && !suppressNearby) {
    // Add the menu sub-heading (not a selectable item)
    menuItems.push(
      <S.MenuItem centeredText header key="ns-header">
        <FormattedMessage
          description="Text for header above nearby stops"
          id="otpUi.LocationField.nearby"
        />
      </S.MenuItem>
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
      <S.MenuItem header centeredText key="ss-header">
        <FormattedMessage
          description="Text for header above recently searched items"
          id="otpUi.LocationField.recentlySearched"
        />
      </S.MenuItem>
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
      <S.MenuItem header centeredText key="mp-header">
        <FormattedMessage
          description="Text for header above user-saved places"
          id="otpUi.LocationField.myPlaces"
        />
      </S.MenuItem>
    );

    // Iterate through any saved locations
    menuItems = menuItems.concat(
      userLocationsAndRecentPlaces.map(userLocation => {
        // Create the location-selected handler
        const locationSelected = () => {
          setLocation(userLocation, "SAVED");
        };

        // Add to the selection handler lookup (for use in onKeyDown)
        locationSelectedLookup[itemIndex] = locationSelected;

        // Create and return the option menu item
        const option = (
          <Option
            icon={<UserLocationIconComponent userLocation={userLocation} />}
            isActive={itemIndex === activeIndex}
            key={optionKey++}
            onClick={locationSelected}
            title={coreUtils.map.formatStoredPlaceName(userLocation)}
          />
        );
        itemIndex++;
        return option;
      })
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
    // error detecting current position
    optionIcon = currentPositionUnavailableIcon;
    optionTitle = intl.formatMessage({
      id: "otpUi.LocationField.currentLocationUnavailable"
    }, { error: typeof currentPosition.error === "string" ? currentPosition.error : currentPosition.error.message });
    positionUnavailable = true;
  }

  // Add to the selection handler lookup (for use in onKeyDown)
  locationSelectedLookup[itemIndex] = locationSelected;

  if (!suppressNearby) {
    // Create and add the option item to the menu items array
    const currentLocationOption = (
      <Option
        disabled={positionUnavailable}
        icon={optionIcon}
        isActive={itemIndex === activeIndex}
        key={optionKey++}
        onClick={locationSelected}
        title={optionTitle}
      />
    );
    menuItems.push(currentLocationOption);
    itemIndex++;
  }
  if (message) {
    const messageItem = (
      <Option
        disabled
        icon={<ExclamationCircle size={20} />}
        key={optionKey++}
        title={message}
      />
    );
    menuItems.unshift(messageItem);
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
  const textControl = (
    <S.Input
      aria-autocomplete="list"
      aria-controls={listBoxId}
      aria-expanded={menuVisible}
      aria-haspopup="listbox"
      aria-label={defaultPlaceholder}
      autoFocus={autoFocus}
      className={getFormControlClassname()}
      onChange={onTextInputChange}
      onClick={handleTextInputClick}
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
      <S.InputGroupAddon>
        <S.Button
          aria-label={intl.formatMessage({
            id: "otpUi.LocationField.clearLocation"
          })}
          onClick={onClearButtonClick}
        >
          {clearButtonIcon}
        </S.Button>
      </S.InputGroupAddon>
    ) : null;
  if (isStatic) {
    // 'static' mode (menu is displayed alongside input, e.g., for mobile view)
    return (
      <div className={className}>
        <S.FormGroup>
          <S.InputGroup>
            <S.InputGroupAddon>
              <LocationIconComponent locationType={locationType} />
            </S.InputGroupAddon>
            {textControl}
            {clearButton}
          </S.InputGroup>
        </S.FormGroup>
        <S.StaticMenuItemList uniqueId={listBoxId}>
          {menuItems.length > 0 ? ( // Show typing prompt to avoid empty screen
            menuItems
          ) : (
            <S.MenuItem header centeredText>
              <FormattedMessage
                description="Text to show as initial placeholder in location search field"
                id="otpUi.LocationField.beingTypingPrompt"
              />
            </S.MenuItem>
          )}
        </S.StaticMenuItemList>
      </div>
    );
  }

  // default display mode with dropdown menu
  return (
    <S.FormGroup onBlur={onBlurFormGroup} className={className}>
      <S.InputGroup>
        {/* location field icon -- also serves as dropdown anchor */}
        <S.Dropdown
          listBoxIdentifier={listBoxId}
          locationType={locationType}
          onToggle={onDropdownToggle}
          open={menuVisible}
          title={<LocationIconComponent locationType={locationType} />}
        >
          {menuItems}
        </S.Dropdown>
        {textControl}
        {clearButton}
      </S.InputGroup>
    </S.FormGroup>
  );
};

export default LocationField;

// Rename styled components for export
export { S as Styled };
