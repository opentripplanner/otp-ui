import { divIcon } from "leaflet";
import memoize from "lodash.memoize";
import * as BaseMapStyled from "@opentripplanner/base-map/lib/styled";
import { getCompaniesLabelFromNetworks } from "@opentripplanner/core-utils/lib/itinerary";
import {
  companyType,
  vehicleRentalMapOverlaySymbolsType,
  stationType
} from "@opentripplanner/core-utils/lib/types";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import PropTypes from "prop-types";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  CircleMarker,
  FeatureGroup,
  Marker,
  MapLayer,
  Popup,
  withLeaflet
} from "react-leaflet";

import { floatingBikeIcon, hubIcons } from "./bike-icons";
import * as Styled from "./styled";

const getStationMarkerByColor = memoize(color =>
  divIcon({
    className: "",
    iconSize: [11, 16],
    popupAnchor: [0, -6],
    html: ReactDOMServer.renderToStaticMarkup(
      <Styled.StationMarker color={color} />
    )
  })
);

/**
 * This vehicle rental overlay can be used to render vehicle rentals of various
 * types. This layer can be configured to show different styles of markers at
 * different zoom levels.
 */
class VehicleRentalOverlay extends MapLayer {
  createLeafletElement() {}

  updateLeafletElement() {}

  startRefreshing() {
    // initial station retrieval
    this.props.refreshVehicles();

    // set up timer to refresh stations periodically
    this.refreshTimer = setInterval(() => {
      this.props.refreshVehicles();
    }, 30000); // defaults to every 30 sec. TODO: make this configurable?*/
  }

  stopRefreshing() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  componentDidMount() {
    const { companies, mapSymbols, name, visible } = this.props;
    if (visible) this.startRefreshing();
    if (!mapSymbols)
      console.warn(`No map symbols provided for layer ${name}`, companies);
  }

  componentWillUnmount() {
    this.stopRefreshing();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.startRefreshing();
    } else if (prevProps.visible && !this.props.visible) {
      this.stopRefreshing();
    }
  }

  /**
   * Render some popup html for a station. This contains custom logic for
   * displaying rental vehicles in the TriMet MOD website that might not be
   * applicable to other regions.
   */
  renderPopupForStation = (station, stationIsHub = false) => {
    const { configCompanies, getStationName, setLocation } = this.props;
    const stationName = getStationName(configCompanies, station);
    const location = {
      lat: station.y,
      lon: station.x,
      name: stationName
    };
    return (
      <Popup>
        <BaseMapStyled.MapOverlayPopup>
          <BaseMapStyled.PopupTitle>{stationName}</BaseMapStyled.PopupTitle>

          {/* render dock info if it is available */}
          {stationIsHub && (
            <BaseMapStyled.PopupRow>
              <div>Available bikes: {station.bikesAvailable}</div>
              <div>Available docks: {station.spacesAvailable}</div>
            </BaseMapStyled.PopupRow>
          )}

          {/* Set as from/to toolbar */}
          <BaseMapStyled.PopupRow>
            <FromToLocationPicker
              location={location}
              setLocation={setLocation}
            />
          </BaseMapStyled.PopupRow>
        </BaseMapStyled.MapOverlayPopup>
      </Popup>
    );
  };

  renderStationAsCircle = (station, symbolDef) => {
    let strokeColor = symbolDef.strokeColor || symbolDef.fillColor;
    if (!station.isFloatingBike) {
      strokeColor = symbolDef.dockStrokeColor || strokeColor;
    }
    return (
      <CircleMarker
        key={station.id}
        center={[station.y, station.x]}
        color={strokeColor}
        fillColor={symbolDef.fillColor}
        fillOpacity={1}
        radius={symbolDef.pixels - (station.isFloatingBike ? 1 : 0)}
        weight={1}
      >
        {this.renderPopupForStation(station)}
      </CircleMarker>
    );
  };

  renderStationAsHubAndFloatingBike = station => {
    let icon;
    if (station.isFloatingBike) {
      icon = floatingBikeIcon;
    } else {
      const pctFull =
        station.bikesAvailable /
        (station.bikesAvailable + station.spacesAvailable);
      const i = Math.round(pctFull * 9);
      icon = hubIcons[i];
    }
    return (
      <Marker icon={icon} key={station.id} position={[station.y, station.x]}>
        {this.renderPopupForStation(station, !station.isFloatingBike)}
      </Marker>
    );
  };

  renderStationAsMarker = (station, symbolDef) => {
    const color =
      symbolDef && symbolDef.fillColor ? symbolDef.fillColor : "gray";
    const markerIcon = getStationMarkerByColor(color);

    return (
      <Marker
        icon={markerIcon}
        key={station.id}
        position={[station.y, station.x]}
      >
        {this.renderPopupForStation(station)}
      </Marker>
    );
  };

  renderStation = station => {
    // render the station according to any map symbol configuration
    const { mapSymbols } = this.props;

    // no config set, just render a default marker
    if (!mapSymbols) return this.renderStationAsMarker(station);

    // get zoom to check which symbol to render
    const zoom = this.props.leaflet.map.getZoom();

    for (let i = 0; i < mapSymbols.length; i++) {
      const symbolDef = mapSymbols[i];
      if (symbolDef.minZoom <= zoom && symbolDef.maxZoom >= zoom) {
        switch (symbolDef.type) {
          case "circle":
            return this.renderStationAsCircle(station, symbolDef);
          case "hubAndFloatingBike":
            return this.renderStationAsHubAndFloatingBike(station);
          default:
            return this.renderStationAsMarker(station, symbolDef);
        }
      }
    }

    // no matching symbol definition, render default marker
    return this.renderStationAsMarker(station);
  };

  render() {
    const { stations, companies } = this.props;
    let filteredStations = stations;
    if (companies) {
      filteredStations = stations.filter(
        station =>
          station.networks.filter(value => companies.includes(value)).length > 0
      );
    }

    if (!filteredStations || filteredStations.length === 0) {
      return <FeatureGroup />;
    }

    return (
      <FeatureGroup>{filteredStations.map(this.renderStation)}</FeatureGroup>
    );
  }
}

VehicleRentalOverlay.props = {
  /**
   * The entire companies config array.
   */
  configCompanies: PropTypes.arrayOf(companyType.isRequired).isRequired,
  /**
   * A list of companies that are applicable to just this instance of the
   * overlay.
   */
  companies: PropTypes.arrayOf(PropTypes.string.isRequired),
  /**
   * An optional custom function to create a string name of a particular vehicle
   * rental station. This function takes two arguments of the configCompanies
   * prop and a vehicle rental station. The function must return a string.
   */
  getStationName: PropTypes.func,
  /**
   * A configuration of what map markers or symbols to show at various zoom
   * levels.
   */
  mapSymbols: vehicleRentalMapOverlaySymbolsType,
  /**
   * A function that will be triggered every 30 seconds whenever this layer is
   * visible.
   */
  refreshVehicles: PropTypes.func.isRequired,
  /**
   * A callback for when a user clicks on setting this stop as either the from
   * or to location of a new search.
   *
   * This will be dispatched with the following argument:
   *
   * ```js
   *  {
   *    location: {
   *      lat: number,
   *      lon: number,
   *      name: string
   *    },
   *    locationType: "from" or "to"
   *  }
   * ```
   */
  setLocation: PropTypes.func.isRequired,
  /**
   * A list of the vehicle rental stations specific to this overlay instance.
   */
  stations: PropTypes.arrayOf(stationType),
  /**
   * Whether the overlay is currently visible.
   */
  visible: PropTypes.bool,
  /**
   * The current map zoom level.
   */
  zoom: PropTypes.number.isRequired
};

VehicleRentalOverlay.defaultProps = {
  getStationName: (configCompanies, station) => {
    const stationNetworks = getCompaniesLabelFromNetworks(
      station.networks,
      configCompanies
    );
    let stationName = station.name || station.id;
    if (station.isFloatingBike) {
      stationName = `Free-floating bike: ${stationName}`;
    } else if (station.isFloatingCar) {
      stationName = `${stationNetworks} ${stationName}`;
    } else if (station.isFloatingVehicle) {
      // assumes that all floating vehicles are E-scooters
      stationName = `${stationNetworks} E-scooter`;
    }
    return stationName;
  },
  mapSymbols: null,
  stations: [],
  visible: false
};

export default withLeaflet(VehicleRentalOverlay);
