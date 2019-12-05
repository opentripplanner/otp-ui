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
                <span key={`route-${name}`} className="route">
                  {name}
                </span>
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
    const { type } = this.props;
    return `${type}-form-control`;
  }

  setLocation(location) {
    const { onLocationSelected, type } = this.props;
    onLocationSelected({ type, location });
  }

  useCurrentLocation = () => {
    const {
      currentPosition,
      getCurrentPosition,
      onLocationSelected,
      type
    } = this.props;
    const location = currentPositionToLocation(currentPosition);
    if (location) {
      // If geolocation is successful (i.e., user has granted app geolocation
      // permission and coords exist), set location.
      onLocationSelected({ type, location });
    } else {
      // Call geolocation.getCurrentPosition and set as from/to type
      // FIXME? getCurrentPosition needs to add payload to onLocationSelected
      getCurrentPosition(type, onLocationSelected);
    }
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
    const { clearLocation, type } = this.props;
    clearLocation({ type });
    this.setState({
      value: "",
      geocodedFeatures: []
    });
    /* eslint-disable-next-line */
    ReactDOM.findDOMNode(this.inputRef).focus();
    this.onTextInputClick();
  };

  onDropdownToggle = (v, e) => {
    const { menuVisible } = this.state;
    // if clicked on input form control, keep dropdown open; otherwise, toggle
    const targetIsInput =
      e.target.className.indexOf(this.getFormControlClassname()) !== -1;
    this.setState({ menuVisible: targetIsInput ? true : !menuVisible });
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
      onClick
    } = this.props;
    if (typeof onClick === "function") onClick();
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
      label,
      location,
      showClearButton,
      showUserSettings,
      static: isStatic,
      stopsIndex,
      suppressNearby,
      type,
      userLocations,
      userRecentPlaces,
      nearbyStops
    } = this.props;
    const { menuVisible, value } = this.state;
    const userLocationsAndRecentPlaces = [
      ...userLocations,
      ...userRecentPlaces
    ];
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
            formatStoredPlaceName(location),
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
    const placeholder =
      currentPosition.fetching === type
        ? "Fetching location..."
        : label || type;
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
        <div className="location-field static">
          <form>
            <Styled.FormGroup>
              <Styled.InputGroup>
                <Styled.InputGroupAddon>
                  <LocationIcon type={type} />
                </Styled.InputGroupAddon>
                {textControl}
                {clearButton}
              </Styled.InputGroup>
            </Styled.FormGroup>
          </form>
          <ul className="dropdown-menu" style={{ width: "100%" }}>
            {menuItems.length > 0 ? ( // Show typing prompt to avoid empty screen
              menuItems
            ) : (
              <Styled.MenuItem header centeredText>
                Begin typing to search for locations
              </Styled.MenuItem>
            )}
          </ul>
        </div>
      );
    }
    // default display mode with dropdown menu
    return (
      <form>
        <Styled.FormGroup
          onBlur={this.onBlurFormGroup}
          className="location-field"
        >
          <Styled.InputGroup>
            {/* location field icon -- also serves as dropdown anchor */}
            <Styled.Dropdown
              open={menuVisible}
              onToggle={this.onDropdownToggle}
              title={<LocationIcon type={type} />}
            >
              {menuItems}
            </Styled.Dropdown>
            {textControl}
            {clearButton}
          </Styled.InputGroup>
        </Styled.FormGroup>
      </form>
    );
  }
}

LocationField.propTypes = {
  currentPosition: PropTypes.shape({
    coords: PropTypes.arrayOf(PropTypes.number),
    error: PropTypes.string,
    fetching: PropTypes.bool.isRequired
  }),
  findNearbyStops: PropTypes.func,
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
  }),
  getCurrentPosition: PropTypes.func,
  hideExistingValue: PropTypes.bool,
  location: PropTypes.shape({
    name: PropTypes.string
  }),
  label: PropTypes.string,
  nearbyStops: PropTypes.arrayOf(PropTypes.shape({})),
  sessionSearches: PropTypes.arrayOf(PropTypes.shape({})),
  showClearButton: PropTypes.bool,
  showUserSettings: PropTypes.bool,
  static: PropTypes.bool, // show autocomplete options as fixed/inline element rather than dropdown
  stopsIndex: PropTypes.shape({}),
  suppressNearby: PropTypes.bool,
  type: PropTypes.string.isRequired, // replace with locationType?
  userLocations: PropTypes.arrayOf(PropTypes.shape({})),
  userRecentPlaces: PropTypes.arrayOf(PropTypes.shape({})),

  // callbacks
  onClick: PropTypes.func,
  onLocationSelected: PropTypes.func,

  // dispatch
  addLocationSearch: PropTypes.func,
  clearLocation: PropTypes.func
};

LocationField.defaultProps = {
  addLocationSearch: () => {},
  clearLocation: () => {},
  currentPosition: {
    coords: null,
    error: null,
    fetching: false
  },
  findNearbyStops: () => {},
  geocoderConfig: {
    baseUrl: "https://ws-st.trimet.org/pelias/v1", // TriMet-specific default
    boundary: {
      // TriMet-specific default
      rect: {
        minLon: -123.2034,
        maxLon: -122.135,
        minLat: 45.273,
        maxLat: 45.7445
      }
    },
    maxNearbyStops: 4,
    type: "PELIAS"
  },
  getCurrentPosition: () => {},
  hideExistingValue: false,
  label: null,
  location: null,
  nearbyStops: [],
  onClick: () => {},
  onLocationSelected: payload => console.log("location selected", payload),
  sessionSearches: [],
  showClearButton: true,
  showUserSettings: false,
  static: false,
  stopsIndex: null,
  suppressNearby: false,
  userLocations: [],
  userRecentPlaces: []
};

export default LocationField;
