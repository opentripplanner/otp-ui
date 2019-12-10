import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
  Ban,
  Briefcase,
  Bus,
  Home,
  LocationArrow,
  MapMarker,
  MapPin,
  Search,
  Times
} from "styled-icons/fa-solid";
import { throttle } from "throttle-debounce";

import {
  currentPositionToLocation,
  formatStoredPlaceName
} from "@opentripplanner/core-utils/lib/map";
import { isIE } from "@opentripplanner/core-utils/lib/ui";
import getGeocoder from "@opentripplanner/geocoder";
import { humainzeDistanceStringImperial } from "@opentripplanner/humanize-distance";
import LocationIcon from "@opentripplanner/location-icon";

import * as Styled from "./styled";

// helper functions for dropdown options

let itemKey = 0;

function createOption(icon, title, onClick, isActive) {
  return (
    <Styled.MenuItem onClick={onClick} key={itemKey++} active={isActive}>
      {isIE() ? (
        // In internet explorer 11, some really weird stuff is happening where it
        // is not possible to click the text of the title, but if you click just
        // above it, then it works. So, if using IE 11, just return the title text
        // and avoid all the extra fancy stuff.
        // See https://github.com/ibi-group/trimet-mod-otp/issues/237
        title
      ) : (
        <div style={{ paddingTop: "5px", paddingBottom: "3px" }}>
          <div style={{ float: "left" }}>{icon}</div>
          <div
            style={{
              marginLeft: "30px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {title}
          </div>
        </div>
      )}
    </Styled.MenuItem>
  );
}

function createTransitStopOption(stop, onClick, isActive) {
  return (
    <Styled.MenuItem onClick={onClick} key={itemKey++} active={isActive}>
      <div>
        <div style={{ float: "left", paddingTop: "3px" }}>
          <Bus size={13} />
          <div style={{ fontSize: "8px" }}>
            {humainzeDistanceStringImperial(stop.dist, true)}
          </div>
        </div>
        <div style={{ marginLeft: "30px" }}>
          <div>
            {stop.name} ({stop.code})
          </div>
          <div style={{ fontSize: "9px" }}>
            {(stop.routes || []).map(route => {
              const name = route.shortName || route.longName;
              return (
                <Styled.RouteName key={`route-${name}`}>
                  {name}
                </Styled.RouteName>
              );
            })}
          </div>
        </div>
        <div style={{ clear: "both" }} />
      </div>
    </Styled.MenuItem>
  );
}

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
        this.setState({ geocodedFeatures: result.features });
      })
      .catch(err => {
        console.error(err);
      });
  });

  constructor(props) {
    super(props);
    this.state = {
      value:
        props.location && !props.hideExistingValue ? props.location.name : "",
      menuVisible: false,
      geocodedFeatures: [],
      activeIndex: null
    };
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
        value: location !== null ? location.name : "",
        geocodedFeatures: []
      });
    }
  }

  getFormControlClassname() {
    const { locationType } = this.props;
    return `${locationType}-form-control`;
  }

  setLocation(location) {
    const { onLocationSelected, locationType } = this.props;
    onLocationSelected({ locationType, location });
    this.setState({ menuVisible: false });
  }

  useCurrentLocation = () => {
    const {
      currentPosition,
      getCurrentPosition,
      onLocationSelected,
      locationType
    } = this.props;
    const location = currentPositionToLocation(currentPosition);
    if (location) {
      // If geolocation is successful (i.e., user has granted app geolocation
      // permission and coords exist), set location.
      onLocationSelected({ locationType, location });
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
    const { location } = this.props;
    // IE does not use relatedTarget, so this check handles cross-browser support.
    // see https://stackoverflow.com/a/49325196/915811
    const target =
      e.relatedTarget !== null ? e.relatedTarget : document.activeElement;
    if (!location && (!target || target.getAttribute("role") !== "menuitem")) {
      this.setState({ menuVisible: false, value: "", geocodedFeatures: [] });
    }
  };

  onTextInputChange = evt => {
    this.setState({ value: evt.target.value, menuVisible: true });
    this.geocodeAutocomplete(evt.target.value);
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
          this.setState({ geocodedFeatures: result.features });
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

  render() {
    const {
      addLocationSearch,
      currentPosition,
      geocoderConfig,
      inputPlaceholder,
      location,
      locationType,
      showClearButton,
      showUserSettings,
      static: isStatic,
      stopsIndex,
      suppressNearby,
      userLocationsAndRecentPlaces,
      nearbyStops
    } = this.props;
    const { menuVisible, value } = this.state;
    const { activeIndex } = this.state;
    let { geocodedFeatures } = this.state;
    if (geocodedFeatures.length > 5)
      geocodedFeatures = geocodedFeatures.slice(0, 5);

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
      // Add the menu sub-heading (not a selectable item)
      // menuItems.push(<MenuItem header key='sr-header'>Search Results</MenuItem>)

      // Iterate through the geocoder results
      menuItems = menuItems.concat(
        geocodedFeatures.map((feature, i) => {
          // Create the selection handler
          const locationSelected = () => {
            getGeocoder(geocoderConfig)
              .getLocationFromGeocodedFeature(feature)
              .then(geocodedLocation => {
                // Set the current location
                this.setLocation(geocodedLocation);
                // Add to the location search history
                addLocationSearch({ location: geocodedLocation });
              });
          };

          // Add to the selection handler lookup (for use in onKeyDown)
          this.locationSelectedLookup[itemIndex] = locationSelected;

          // Create and return the option menu item
          const option = createOption(
            <MapPin size={13} />,
            feature.properties.label,
            locationSelected,
            itemIndex === activeIndex,
            i === geocodedFeatures.length - 1
          );
          itemIndex++;
          return option;
        })
      );
    }

    /* 2) Process nearby transit stop options */
    if (nearbyStops.length > 0 && !suppressNearby) {
      // Add the menu sub-heading (not a selectable item)
      menuItems.push(
        <Styled.MenuItem header key="ns-header">
          Nearby Stops
        </Styled.MenuItem>
      );

      // Iterate through the found nearby stops
      menuItems = menuItems.concat(
        nearbyStops.map((stopId, i) => {
          // Constuct the location
          const stop = stopsIndex[stopId];
          const stopLocation = {
            name: stop.name,
            lat: stop.lat,
            lon: stop.lon
          };

          // Create the location selected handler
          const locationSelected = () => {
            this.setLocation(stopLocation);
          };

          // Add to the selection handler lookup (for use in onKeyDown)
          this.locationSelectedLookup[itemIndex] = locationSelected;

          // Create and return the option menu item
          const option = createTransitStopOption(
            stop,
            locationSelected,
            itemIndex === activeIndex,
            i === nearbyStops.length - 1
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
        <Styled.MenuItem header key="ss-header">
          Recently Searched
        </Styled.MenuItem>
      );

      // Iterate through any saved locations
      menuItems = menuItems.concat(
        sessionSearches.map((sessionLocation, i) => {
          // Create the location-selected handler
          const locationSelected = () => {
            this.setLocation(sessionLocation);
          };

          // Add to the selection handler lookup (for use in onKeyDown)
          this.locationSelectedLookup[itemIndex] = locationSelected;

          // Create and return the option menu item
          const option = createOption(
            <Search size={13} />,
            sessionLocation.name,
            locationSelected,
            itemIndex === activeIndex,
            i === sessionSearches.length - 1
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
        <Styled.MenuItem header key="mp-header">
          My Places
        </Styled.MenuItem>
      );

      // Iterate through any saved locations
      menuItems = menuItems.concat(
        userLocationsAndRecentPlaces.map((userLocation, i) => {
          // Create the location-selected handler
          const locationSelected = () => {
            this.setLocation(location);
          };

          // Add to the selection handler lookup (for use in onKeyDown)
          this.locationSelectedLookup[itemIndex] = locationSelected;

          let icon = <MapMarker size={13} />;
          if (userLocation.icon === "work") icon = <Briefcase size={13} />;
          else if (userLocation.icon === "home") icon = <Home size={13} />;

          // Create and return the option menu item
          const option = createOption(
            icon,
            formatStoredPlaceName(userLocation),
            locationSelected,
            itemIndex === activeIndex,
            i === userLocationsAndRecentPlaces.length - 1
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

    if (!currentPosition.error) {
      // current position detected successfully
      locationSelected = this.useCurrentLocation;
      optionIcon = <LocationArrow size={13} />;
      optionTitle = "Use Current Location";
    } else {
      // error detecting current position
      locationSelected = this.geolocationAlert;
      optionIcon = <Ban size={13} />;
      optionTitle = "Current location not available";
    }

    // Add to the selection handler lookup (for use in onKeyDown)
    this.locationSelectedLookup[itemIndex] = locationSelected;

    if (!suppressNearby) {
      // Create and add the option item to the menu items array
      const currentLocationOption = createOption(
        optionIcon,
        optionTitle,
        locationSelected,
        itemIndex === activeIndex
      );
      menuItems.push(currentLocationOption);
      itemIndex++;
    }

    // Store the number of location-associated items for reference in the onKeyDown method
    this.menuItemCount = itemIndex;

    /** the text input element * */
    const placeholder = currentPosition.fetching
      ? "Fetching location..."
      : inputPlaceholder || locationType;
    const textControl = (
      <Styled.Input
        ref={ref => {
          this.inputRef = ref;
        }}
        className={this.getFormControlClassname()}
        value={value}
        placeholder={placeholder}
        onChange={this.onTextInputChange}
        onClick={this.onTextInputClick}
        onKeyDown={this.onKeyDown}
      />
    );

    // Only include the clear ('X') button add-on if a location is selected
    // or if the input field has text.
    const clearButton =
      showClearButton && location ? (
        <Styled.InputGroupAddon>
          <Styled.Button onClick={this.onClearButtonClick}>
            <Times size={13} />
          </Styled.Button>
        </Styled.InputGroupAddon>
      ) : null;
    if (isStatic) {
      // 'static' mode (menu is displayed alongside input, e.g., for mobile view)
      return (
        <div>
          <Styled.FormGroup>
            <Styled.InputGroup>
              <Styled.InputGroupAddon>
                <LocationIcon size={13} type={locationType} />
              </Styled.InputGroupAddon>
              {textControl}
              {clearButton}
            </Styled.InputGroup>
          </Styled.FormGroup>
          <Styled.StaticMenuItemList>
            {menuItems.length > 0 ? ( // Show typing prompt to avoid empty screen
              menuItems
            ) : (
              <Styled.MenuItem header centeredText>
                Begin typing to search for locations
              </Styled.MenuItem>
            )}
          </Styled.StaticMenuItemList>
        </div>
      );
    }

    // default display mode with dropdown menu
    return (
      <Styled.FormGroup
        onBlur={this.onBlurFormGroup}
        className="location-field"
      >
        <Styled.InputGroup>
          {/* location field icon -- also serves as dropdown anchor */}
          <Styled.Dropdown
            open={menuVisible}
            onToggle={this.onDropdownToggle}
            title={<LocationIcon size={13} type={locationType} />}
          >
            {menuItems}
          </Styled.Dropdown>
          {textControl}
          {clearButton}
        </Styled.InputGroup>
      </Styled.FormGroup>
    );
  }
}

LocationField.propTypes = {
  /**
   * Dispatched upon selecting a geocoded result
   * Provides an argument in the format:
   *
   * ```js
   * { location: geocodedLocation }
   * ```
   */
  addLocationSearch: PropTypes.func,
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
    coords: PropTypes.arrayOf(PropTypes.number),
    error: PropTypes.string,
    fetching: PropTypes.bool.isRequired
  }),
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
   * The location that this component is currently set with.
   */
  location: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
    name: PropTypes.string
  }),
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
   *  location: object
   * }
   * '''
   */
  onLocationSelected: PropTypes.func.isRequired,
  /**
   * A list of recent searches to show to the user
   */
  sessionSearches: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number,
      lon: PropTypes.number,
      name: PropTypes.string
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
  /*
   * show autocomplete options as fixed/inline element rather than dropdown
   */
  static: PropTypes.bool,
  /**
   * An index of stops by StopId
   */
  stopsIndex: PropTypes.objectOf(
    PropTypes.shape({
      /**
       * The stop code if the stop has one
       */
      code: PropTypes.string,
      /**
       * The distance from the user to the stop in meters
       */
      dist: PropTypes.number,
      lat: PropTypes.number,
      lon: PropTypes.number,
      name: PropTypes.string,
      routes: PropTypes.arrayOf(
        PropTypes.shape({
          longName: PropTypes.string,
          shortName: PropTypes.string
        })
      )
    })
  ),
  /**
   * If true, do not show nearbyStops or current location as options
   */
  suppressNearby: PropTypes.bool,
  userLocationsAndRecentPlaces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      /**
       * Can be either 'home', 'work', or null
       */
      icon: PropTypes.string,
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      /**
       * This represents the last time that this location was selected in a
       * search
       */
      timestamp: PropTypes.number.isRequired,
      /**
       * One of: 'home', 'work', 'stop' or 'recent'
       */
      type: PropTypes.string.isRequired
    })
  )
};

LocationField.defaultProps = {
  addLocationSearch: () => {},
  clearLocation: () => {},
  currentPosition: null,
  findNearbyStops: () => {},
  hideExistingValue: false,
  inputPlaceholder: null,
  location: null,
  nearbyStops: [],
  onTextInputClick: null,
  sessionSearches: [],
  showClearButton: true,
  showUserSettings: false,
  static: false,
  stopsIndex: null,
  suppressNearby: false,
  userLocationsAndRecentPlaces: []
};

export default LocationField;
