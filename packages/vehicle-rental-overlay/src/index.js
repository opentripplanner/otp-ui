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
// FIXME: Change to the correct @opentripplanner import.
import ZoomBasedMarkers from "../../zoom-based-markers/lib";

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
    const { refreshVehicles } = this.props;

    // Create the timer only if refreshVehicles is a valid function.
    if (typeof refreshVehicles === "function") {
      // initial station retrieval
      refreshVehicles();

      // set up timer to refresh stations periodically
      this.refreshTimer = setInterval(() => {
        refreshVehicles();
      }, 30000); // defaults to every 30 sec. TODO: make this configurable?
    }
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
            <b>Plan a trip:</b>
            <FromToLocationPicker
              location={location}
              setLocation={setLocation}
            />
          </BaseMapStyled.PopupRow>
        </BaseMapStyled.MapOverlayPopup>
      </Popup>
    );
  };

  renderStationAsCircle = symbolDef => ({ entity: station }) => {
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

  StationAsHubAndFloatingBike = ({ entity: station }) => {
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

  renderStationAsMarker = symbolDef => ({ entity: station }) => {
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

  renderStation = symbolDef => {
    switch (symbolDef.type) {
      case "circle":
        return this.renderStationAsCircle(symbolDef);
      case "hubAndFloatingBike":
        return this.StationAsHubAndFloatingBike;
      default:
        return this.renderStationAsMarker(symbolDef);
    }
  };

  render() {
    const { mapSymbols, stations, companies } = this.props;
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

    // get zoom to check which symbol to render
    const zoom = this.props.leaflet.map.getZoom();

    if (mapSymbols) {
      // Convert map symbols for this overlay to zoomBasedSymbolType.
      const symbols = mapSymbols.map(mapSymbol => ({
        minZoom: mapSymbol.minZoom,
        symbol: this.renderStation(mapSymbol)
      }));

      return (
        <FeatureGroup>
          <ZoomBasedMarkers
            entities={filteredStations}
            symbols={symbols}
            zoom={zoom}
          />
        </FeatureGroup>
      );
    }

    // no config set, just render a default marker
    return (
      <FeatureGroup>
        {filteredStations.map(this.renderStationAsMarker)}
      </FeatureGroup>
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
   * If specified, a function that will be triggered every 30 seconds whenever this layer is
   * visible.
   */
  refreshVehicles: PropTypes.func,
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
  visible: PropTypes.bool
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
  refreshVehicles: null,
  stations: [],
  visible: false
};

export default withLeaflet(VehicleRentalOverlay);
