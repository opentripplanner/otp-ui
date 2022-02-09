import coreUtils from "@opentripplanner/core-utils";
import getGeocoder from "@opentripplanner/geocoder";
import LocationIcon from "@opentripplanner/location-icon";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Ban } from "@styled-icons/fa-solid/Ban";
import { Bus } from "@styled-icons/fa-solid/Bus";
import { ExclamationCircle } from "@styled-icons/fa-solid/ExclamationCircle";
import { LocationArrow } from "@styled-icons/fa-solid/LocationArrow";
import { Search } from "@styled-icons/fa-solid/Search";
import { Times } from "@styled-icons/fa-solid/Times";
import { throttle } from "throttle-debounce";

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

function DefaultLocationIcon({ locationType }) {
  return <LocationIcon size={13} type={locationType} />;
}

DefaultLocationIcon.propTypes = {
  locationType: PropTypes.string.isRequired
};

class LocationField extends Component {
  geocodeAutocomplete = throttle(1000, text => {
    if (!text) {
      console.warn("No text entry provided for geocode autocomplete search.");
      return;
    }
    const { geocoderConfig } = this.props;
    getGeocoder(geocoderConfig)
      .autocomplete({ text })
      .then(result => {
        let message;
        // If no features found in response, default to empty array.
        let geocodedFeatures = result && result.features;
        if (!geocodedFeatures) {
          // Get the Pelias error message if exists.
          // TODO: determine how other geocoders return error messages.
          const errorMessage =
            result &&
            result.results &&
            result.results.error &&
            result.results.error.message;
          // If the result did not contain a list of features, add special note.
          message = "Could not reach geocoder";
          if (errorMessage) message += ` (${errorMessage})`;
          geocodedFeatures = [];
        } else if (geocodedFeatures.length === 0) {
          message = `No results found for '${text}'`;
        }
        this.setState({ geocodedFeatures, message });
      })
      .catch(err => {
        console.error(err);
      });
  });

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null,
      geocodedFeatures: [],
      listBoxId: `listbox-${optionKey}`,
      menuVisible: false,
      message: null,
      value: this.getValueFromLocation()
    };
  }

  componentDidMount() {
    const { initialSearchResults } = this.props;
    if (initialSearchResults) {
      this.setState({
        geocodedFeatures: initialSearchResults,
        menuVisible: true
      });
    }
  }

  componentDidUpdate(prevProps) {
    // If location is updated externally, replace value and geocoded features
    // in internal state.
    // TODO: This might be considered an anti-pattern. There may be a more
    // effective way to handle this.
    const { location } = this.props;
    if (location !== prevProps.location) {
      /* FIXME only disabled this because it'd take longer to refactor */
      /* eslint-disable-next-line */
      this.setState({
        //  location could be null if none is set
        value: location?.name || "",
        geocodedFeatures: []
      });
    }
  }

  getFormControlClassname() {
    const { locationType } = this.props;
    return `${locationType}-form-control`;
  }

  /**
   * Gets the initial value to place in the input field.
   */
  getValueFromLocation = () => {
    const { hideExistingValue, location } = this.props;
    const label = location?.name || "";
    return location && !hideExistingValue ? label : "";
  };

  setLocation(location, resultType) {
    const { onLocationSelected, locationType } = this.props;
    onLocationSelected({ locationType, location, resultType });
    this.setState({ menuVisible: false });
  }

  useCurrentLocation = () => {
    const {
      currentPosition,
      getCurrentPosition,
      onLocationSelected,
      locationType
    } = this.props;
    const location = coreUtils.map.currentPositionToLocation(currentPosition);
    if (location) {
      // If geolocation is successful (i.e., user has granted app geolocation
      // permission and coords exist), set location.
      onLocationSelected({
        locationType,
        location,
        resultType: "CURRENT_LOCATION"
      });
    } else {
      // Call geolocation.getCurrentPosition and set as from/to locationType
      getCurrentPosition(locationType);
    }
    this.setState({ menuVisible: false });
  };

  /**
   * Provide alert to user with reason for geolocation error
   */
  geolocationAlert = () => {
    const { currentPosition } = this.props;
    window.alert(
      `Geolocation either has been disabled for ${
        window.location.host
      } or is not available in your browser.\n\nReason: ${currentPosition.error
        .message || "Unknown reason"}`
    );
  };

  onClearButtonClick = () => {
    const { clearLocation, locationType } = this.props;
    clearLocation({ locationType });
    this.setState({
      value: "",
      geocodedFeatures: []
    });
    /* eslint-disable-next-line */
    ReactDOM.findDOMNode(this.inputRef).focus();
    this.onTextInputClick();
  };

  onDropdownToggle = () => {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  };

  /**
   * Only hide menu if the target clicked is not a menu item in the dropdown.
   * Otherwise, the click will not "finish" and the menu will hide without the
   * user having made a selection.
   */
  onBlurFormGroup = e => {
    // IE does not use relatedTarget, so this check handles cross-browser support.
    // see https://stackoverflow.com/a/49325196/915811
    const target =
      e.relatedTarget !== null ? e.relatedTarget : document.activeElement;
    if (!target || target.getAttribute("role") !== "option") {
      this.setState({
        geocodedFeatures: [],
        menuVisible: false,
        message: null,
        value: this.getValueFromLocation()
      });
    }
  };

  onTextInputChange = evt => {
    const { value } = evt.target;
    this.setState({ value, menuVisible: true });
    this.geocodeAutocomplete(value);
  };

  onTextInputClick = () => {
    const {
      currentPosition,
      findNearbyStops,
      geocoderConfig,
      nearbyStops,
      onTextInputClick
    } = this.props;
    if (typeof onTextInputClick === "function") onTextInputClick();
    this.setState({ menuVisible: true });
    if (nearbyStops.length === 0 && currentPosition && currentPosition.coords) {
      findNearbyStops({
        lat: currentPosition.coords.latitude,
        lon: currentPosition.coords.longitude,
        max: geocoderConfig.maxNearbyStops || 4
      });
    }
  };

  onKeyDown = evt => {
    const { activeIndex, menuVisible } = this.state;
    switch (evt.key) {
      // 'Down' arrow key pressed: move selected menu item down by one position
      case "ArrowDown":
        // Suppress default 'ArrowDown' behavior which moves cursor to end
        evt.preventDefault();
        if (!menuVisible) {
          // If the menu is not visible, simulate a text input click to show it.
          this.onTextInputClick();
        } else if (activeIndex === this.menuItemCount - 1) {
          this.setState({ activeIndex: null });
        } else {
          this.setState({
            activeIndex: activeIndex === null ? 0 : activeIndex + 1
          });
        }
        break;
      // 'Up' arrow key pressed: move selection up by one position
      case "ArrowUp":
        // Suppress default 'ArrowUp' behavior which moves cursor to beginning
        evt.preventDefault();
        if (activeIndex === 0) {
          this.setState({ activeIndex: null });
        } else {
          this.setState({
            activeIndex:
              activeIndex === null ? this.menuItemCount - 1 : activeIndex - 1
          });
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
          const locationSelected = this.locationSelectedLookup[activeIndex];
          if (locationSelected) locationSelected();

          // Clear selection & hide the menu
          this.setState({
            menuVisible: false,
            activeIndex: null
          });
        } else {
          // Menu not active; get geocode 'search' results
          this.geocodeSearch(evt.target.value);
          // Ensure menu is visible.
          this.setState({ menuVisible: true });
        }

        // Suppress default 'Enter' behavior which causes page to reload
        evt.preventDefault();
        break;
      case "Escape":
      case "Tab":
        // Clear selection & hide the menu
        this.setState({
          menuVisible: false,
          activeIndex: null
        });
        break;
      // Any other key pressed: clear active selection
      default:
        this.setState({ activeIndex: null });
        break;
    }
  };

  geocodeSearch(text) {
    const { geocoderConfig } = this.props;
    if (!text) {
      console.warn("No text entry provided for geocode search.");
      return;
    }
    getGeocoder(geocoderConfig)
      .search({ text })
      .then(result => {
        if (result.features && result.features.length > 0) {
          // Only replace geocode items if results were found
          this.setState({ geocodedFeatures: result.features, message: null });
        } else {
          console.warn(
            "No results found for geocode search. Not replacing results."
          );
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  renderFeature = (itemIndex, feature) => {
    const {
      addLocationSearch,
      GeocodedOptionIconComponent,
      geocoderConfig,
      layerColorMap,
      operatorIconMap
    } = this.props;
    const { activeIndex } = this.state;

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
          this.setLocation(geocodedLocation, "GEOCODE");
          // Add to the location search history. This is intended to
          // populate the sessionSearches array.
          addLocationSearch({ location: geocodedLocation });
        });
    };

    // Add to the selection handler lookup (for use in onKeyDown)
    this.locationSelectedLookup[itemIndex] = locationSelected;

    // Extract GTFS/POI info and assign to class
    const { layer, source, id } = feature.properties;
    const classNames = [];
    let operatorIcon;
    // Operator only exists on transit features
    const featureIdComponents = source === "transit" && id.split("::");
    if (featureIdComponents.length > 0) {
      const operatorName = featureIdComponents[1]
        .replaceAll(" ", "-")
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

  render() {
    const {
      autoFocus,
      className,
      currentPosition,
      currentPositionIcon,
      currentPositionUnavailableIcon,
      inputPlaceholder,
      preferredLayers,
      layerColorMap,
      location,
      clearButtonIcon,
      LocationIconComponent,
      locationType,
      nearbyStops,
      sessionOptionIcon,
      showClearButton,
      showUserSettings,
      sortByDistance,
      static: isStatic,
      stopOptionIcon,
      stopsIndex,
      suppressNearby,
      suggestionCount,
      UserLocationIconComponent,
      userLocationsAndRecentPlaces
    } = this.props;
    const { menuVisible, value } = this.state;
    const { activeIndex, message } = this.state;
    let { geocodedFeatures } = this.state;
    const { listBoxId } = this.state;

    let { sessionSearches } = this.props;
    if (sessionSearches.length > 5)
      sessionSearches = sessionSearches.slice(0, 5);

    // Assemble menu contents, to be displayed either as dropdown or static panel.
    // Menu items are created in four phases: (1) the current location, (2) any
    // geocoder search results; (3) nearby transit stops; and (4) saved searches

    let menuItems = []; // array of menu items for display (may include non-selectable items e.g. dividers/headings)
    let itemIndex = 0; // the index of the current location-associated menu item (excluding non-selectable items)
    this.locationSelectedLookup = {}; // maps itemIndex to a location selection handler (for use by the onKeyDown method)

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
        .filter(feature => feature.properties.source !== "transit")
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
            Stations
          </S.MenuItem>
        ),
        stationFeatures.map(feature =>
          this.renderFeature(itemIndex++, feature)
        ),

        stopFeatures.length > 0 && (
          <S.MenuItem
            bgColor={layerColorMap.stops}
            centeredText
            header
            key="gtfs-stops-header"
          >
            Stops
          </S.MenuItem>
        ),
        stopFeatures.map(feature => this.renderFeature(itemIndex++, feature)),

        transitFeaturesPresent && otherFeatures.length > 0 && (
          <S.MenuItem bgColor="#333" header centeredText key="other-header">
            Other
          </S.MenuItem>
        ),
        otherFeatures.map(feature => this.renderFeature(itemIndex++, feature))
      );
    }

    /* 2) Process nearby transit stop options */
    if (nearbyStops.length > 0 && !suppressNearby) {
      // Add the menu sub-heading (not a selectable item)
      menuItems.push(
        <S.MenuItem header centeredText key="ns-header">
          Nearby Stops
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
            this.setLocation(stopLocation, "STOP");
          };

          // Add to the selection handler lookup (for use in onKeyDown)
          this.locationSelectedLookup[itemIndex] = locationSelected;

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
          Recently Searched
        </S.MenuItem>
      );

      // Iterate through any saved locations
      menuItems = menuItems.concat(
        sessionSearches.map(sessionLocation => {
          // Create the location-selected handler
          const locationSelected = () => {
            this.setLocation(sessionLocation, "SESSION");
          };

          // Add to the selection handler lookup (for use in onKeyDown)
          this.locationSelectedLookup[itemIndex] = locationSelected;
          // Create and return the option menu item
          const option = (
            <Option
              icon={sessionOptionIcon}
              key={optionKey++}
              // just use the name if there is no main/secondary field
              title={sessionLocation.main || sessionLocation.name}
              subTitle={sessionLocation.secondary || ""}
              onClick={locationSelected}
              isActive={itemIndex === activeIndex}
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
          My Places
        </S.MenuItem>
      );

      // Iterate through any saved locations
      menuItems = menuItems.concat(
        userLocationsAndRecentPlaces.map(userLocation => {
          // Create the location-selected handler
          const locationSelected = () => {
            this.setLocation(userLocation, "SAVED");
          };

          // Add to the selection handler lookup (for use in onKeyDown)
          this.locationSelectedLookup[itemIndex] = locationSelected;

          // Create and return the option menu item
          const option = (
            <Option
              icon={<UserLocationIconComponent userLocation={userLocation} />}
              key={optionKey++}
              title={coreUtils.map.formatStoredPlaceName(userLocation)}
              onClick={locationSelected}
              isActive={itemIndex === activeIndex}
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
      locationSelected = this.useCurrentLocation;
      optionIcon = currentPositionIcon;
      optionTitle = "Use Current Location";
      positionUnavailable = false;
    } else {
      // error detecting current position
      locationSelected = this.geolocationAlert;
      optionIcon = currentPositionUnavailableIcon;
      optionTitle = "Current location not available";
      positionUnavailable = true;
    }

    // Add to the selection handler lookup (for use in onKeyDown)
    this.locationSelectedLookup[itemIndex] = locationSelected;

    if (!suppressNearby) {
      // Create and add the option item to the menu items array
      const currentLocationOption = (
        <Option
          icon={optionIcon}
          key={optionKey++}
          title={optionTitle}
          onClick={locationSelected}
          isActive={itemIndex === activeIndex}
          disabled={positionUnavailable}
        />
      );
      menuItems.push(currentLocationOption);
      itemIndex++;
    }
    if (message) {
      const messageItem = (
        <Option
          icon={<ExclamationCircle size={20} />}
          key={optionKey++}
          title={message}
          disabled
        />
      );
      menuItems.unshift(messageItem);
    }

    // Store the number of location-associated items for reference in the onKeyDown method
    this.menuItemCount = itemIndex;

    /** the text input element * */
    // Use this text for aria-label below.
    const defaultPlaceholder = inputPlaceholder || locationType;
    const placeholder =
      currentPosition && currentPosition.fetching
        ? "Fetching location..."
        : defaultPlaceholder;
    const textControl = (
      <S.Input
        aria-autocomplete="list"
        aria-controls={listBoxId}
        aria-expanded={menuVisible}
        aria-haspopup="listbox"
        aria-label={defaultPlaceholder}
        autoFocus={autoFocus}
        className={this.getFormControlClassname()}
        onChange={this.onTextInputChange}
        onClick={this.onTextInputClick}
        onKeyDown={this.onKeyDown}
        placeholder={placeholder}
        ref={ref => {
          this.inputRef = ref;
        }}
        role="combobox"
        value={value}
      />
    );

    // Only include the clear ('X') button add-on if a location is selected
    // or if the input field has text.
    const clearButton =
      showClearButton && location ? (
        <S.InputGroupAddon>
          <S.Button
            aria-label="Clear location"
            onClick={this.onClearButtonClick}
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
                Begin typing to search for locations
              </S.MenuItem>
            )}
          </S.StaticMenuItemList>
        </div>
      );
    }

    // default display mode with dropdown menu
    return (
      <S.FormGroup onBlur={this.onBlurFormGroup} className={className}>
        <S.InputGroup>
          {/* location field icon -- also serves as dropdown anchor */}
          <S.Dropdown
            listBoxIdentifier={listBoxId}
            locationType={locationType}
            onToggle={this.onDropdownToggle}
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
  }
}

LocationField.propTypes = {
  /**
   * Dispatched upon selecting a geocoded result
   * Provides an argument in the format:
   * ```js
   * { location: geocodedLocation }
   * ```
   */
  addLocationSearch: PropTypes.func,
  /**
   * Determines whether the input field of this component should auto-focus on first display.
   */
  autoFocus: PropTypes.bool,
  /**
   * Used for additional styling with styled components for example.
   */
  className: PropTypes.string,
  /**
   * Dispatched whenever the clear location button is clicked.
   * Provides an argument in the format:
   *
   * ```js
   * { locationType: string }
   * ```
   */
  clearLocation: PropTypes.func,
  /**
   * The current position of the user if it is available.
   */
  currentPosition: PropTypes.shape({
    coords: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    error: PropTypes.string,
    fetching: PropTypes.bool
  }),
  /**
   * A slot for the icon to display for the current position
   */
  currentPositionIcon: PropTypes.node,
  /**
   * A slot for the icon to display for when the current position is unavailable
   */
  currentPositionUnavailableIcon: PropTypes.node,
  /**
   * Allows the component to be rendered with pre-filled results
   */
  initialSearchResults: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      geometry: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.array
      }),
      properties: PropTypes.shape({ id: PropTypes.string })
    })
  ),
  /**
   * Results are sorted by distance, but favored layers will always appear
   * first.
   */
  preferredLayers: PropTypes.arrayOf(PropTypes.string),
  /**
   * Invoked whenever the currentPosition is set, but the nearbyStops are not.
   * Sends the following argument:
   *
   * ```js
   * {
   *   lat: currentPosition.coords.latitude,
   *   lon: currentPosition.coords.longitude,
   *   max: geocoderConfig.maxNearbyStops || 4
   * }
   * ```
   */
  findNearbyStops: PropTypes.func,
  /**
   * A slot for a component that can be used to display a custom icon for a
   * geocoded option. This component is passed a single property called
   * `feature` which will be in the geocodedFeatureType shape.
   */
  GeocodedOptionIconComponent: PropTypes.elementType,
  /**
   * A configuration object describing what geocoder should be used.
   */
  geocoderConfig: PropTypes.shape({
    baseUrl: PropTypes.string,
    boundary: PropTypes.shape({
      // TriMet-specific default
      rect: PropTypes.shape({
        minLon: PropTypes.number,
        maxLon: PropTypes.number,
        minLat: PropTypes.number,
        maxLat: PropTypes.number
      })
    }),
    maxNearbyStops: PropTypes.number,
    type: PropTypes.string.isRequired
  }).isRequired,
  /**
   * This is dispatched when the current position is null. This indicates that
   * the user has requested to use the current position, but that the current
   * position is not currently available. This method sends back the
   * locationType value supplied to the component.
   */
  getCurrentPosition: PropTypes.func.isRequired,
  /**
   * Whether the provided location (if one is provided) should not be shown upon
   * initial render.
   */
  hideExistingValue: PropTypes.bool,
  /**
   * Placeholder text to show in the input element. If the current position is
   * set to have a true fetching property, then the text "Fetching location..."
   * will display. If this value isn't provided, the locationType will be shown.
   */
  inputPlaceholder: PropTypes.string,
  /**
   * Mapping from Pelias layer to color. Allows results from different
   * Pelias sources to be shown in a different color.
   */
  layerColorMap: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
    // Explicitly include those used as headers
    stops: PropTypes.string,
    stations: PropTypes.string
  }),
  /**
   * The location that this component is currently set with.
   */
  location: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
    name: PropTypes.string,
    main: PropTypes.string,
    secondary: PropTypes.string
  }),
  /**
   * A custom component for rendering the icon displayed to the left of the text
   * input. This component is passed a single prop of `locationType`.
   */
  LocationIconComponent: PropTypes.elementType,
  /**
   * Either `from` or `to`
   */
  locationType: PropTypes.string.isRequired,
  /**
   * A list of stopIds of the stops that should be shown as being nearby. These
   * must be referencable in the stopsIndex prop.
   */
  nearbyStops: PropTypes.arrayOf(PropTypes.string),
  /**
   * Invoked whenever the text input is clicked or when the clear button is
   * clicked.
   */
  onTextInputClick: PropTypes.func,
  /**
   * A function to handle when a location is selected. This is always dispatched
   * with an object of the following form:
   *
   * ```js
   * {
   *  locationType: string,
   *  location: object,
   *  resultType: string
   * }
   * '''
   *
   * The locationType string will be either "from" or "to" as was set by the
   * locationType prop for the instance of this component.
   *
   * The location object will be an object in the form below:
   * ```js
   * {
   *  id: string, // only populated for stops and user-saved locations
   *  lat: number,
   *  lon: number,
   *  name: string
   * }
   *
   * The resultType string indicates the type of location that was selected.
   * It can be one of the following:
   *
   * "CURRENT_LOCATION": The user's current location.
   * "GEOCODE": A location that was found via a geocode search result
   * "SAVED": A location that was saved by the user.
   * "SESSION": A geocoded search result that was recently selected by the user.
   * "STOP": A transit stop
   */
  onLocationSelected: PropTypes.func.isRequired,
  /**
   * Mapping from Pelias *operator* to icon (represented as jsx). Allows results from different Pelias
   * operators to be given a unique Icon.
   */
  operatorIconMap: PropTypes.shape({ [PropTypes.string]: PropTypes.node }),
  /**
   * A boolean for whether to override the result sort order and sort by
   * distance.
   */
  sortByDistance: PropTypes.bool,
  /**
   * A slot for the icon to display for an option that was used during the
   * current session.
   */
  sessionOptionIcon: PropTypes.node,
  /**
   * A list of recent searches to show to the user. These are typically only
   * geocode results that a user has previously selected.
   */
  sessionSearches: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  /**
   * Whether or not to show the clear button
   */
  showClearButton: PropTypes.bool,
  /**
   * Whether or not to show user settings dialog
   */
  showUserSettings: PropTypes.bool,
  /**
   * show autocomplete options as fixed/inline element rather than dropdown
   */
  static: PropTypes.bool,
  /**
   * An index of stops by StopId
   */
  stopsIndex: PropTypes.objectOf(coreUtils.types.transitIndexStopWithRoutes),
  /**
   * A slot for the icon to display for a stop option
   */
  stopOptionIcon: PropTypes.node,
  /**
   * If true, do not show nearbyStops or current location as options
   */
  suppressNearby: PropTypes.bool,
  /**
   * When showing special categories of transit response, these can be capped
   * to prevent the list of responses from getting too long. This value declares
   * how many responses to show in each category
   */
  suggestionCount: PropTypes.number,
  /**
   * An array of recent locations and places a user has searched for.
   */
  userLocationsAndRecentPlaces: PropTypes.arrayOf(
    coreUtils.types.userLocationType
  ),
  /**
   * A custom component for rendering the icon for options that are either saved
   * user locations or recent places. The component will be sent a single prop
   * of `userLocation` which is a userLocationType.
   */
  UserLocationIconComponent: PropTypes.elementType,
  /** A slot for a component that can be used to display a custom icon for the
   * clear location button.
   */
  clearButtonIcon: PropTypes.node
};

LocationField.defaultProps = {
  autoFocus: false,
  addLocationSearch: () => {},
  className: null,
  clearLocation: () => {},
  clearButtonIcon: <Times size={13} />,
  currentPosition: null,
  currentPositionIcon: <LocationArrow size={13} />,
  currentPositionUnavailableIcon: <Ban size={13} />,
  initialSearchResults: null,
  preferredLayers: [],
  findNearbyStops: () => {},
  GeocodedOptionIconComponent: GeocodedOptionIcon,
  hideExistingValue: false,
  inputPlaceholder: null,
  layerColorMap: {},
  location: null,
  LocationIconComponent: DefaultLocationIcon,
  nearbyStops: [],
  onTextInputClick: null,
  operatorIconMap: {},
  sessionOptionIcon: <Search size={13} />,
  sessionSearches: [],
  sortByDistance: false,
  showClearButton: true,
  showUserSettings: false,
  static: false,
  stopOptionIcon: <Bus size={13} />,
  stopsIndex: null,
  suppressNearby: false,
  suggestionCount: 3,
  userLocationsAndRecentPlaces: [],
  UserLocationIconComponent: UserLocationIcon
};

export default LocationField;

// Rename styled components for export
export { S as Styled };
