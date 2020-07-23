import * as BaseMapStyled from "@opentripplanner/base-map/lib/styled";
import { getCompaniesLabelFromNetworks } from "@opentripplanner/core-utils/lib/itinerary";
import {
  companyType,
  stationType,
  zoomBasedSymbolType
} from "@opentripplanner/core-utils/lib/types";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import ZoomBasedMarkers from "@opentripplanner/zoom-based-markers";
import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup, MapLayer, Popup, withLeaflet } from "react-leaflet";

import Markers from "./Markers";

/**
 * This vehicle rental overlay can be used to render vehicle rentals of various
 * types. This layer can be configured to show different styles of markers at
 * different zoom levels.
 */
class VehicleRentalOverlay extends MapLayer {
  /**
   * This helper method will be passed to the ZoomBasedMarkers symbolTranform prop.
   * It creates a component that inserts a popup
   * as a child of the specified symbol from the symbols prop.
   */
  insertPopup = Symbol => {
    const SymbolWrapper = ({ entity: station, zoom }) => (
      <Symbol entity={station} zoom={zoom}>
        {this.renderPopupForStation(
          station,
          Symbol === Markers.HubAndFloatingBike && !station.isFloatingBike
        )}
      </Symbol>
    );
    SymbolWrapper.propTypes = {
      entity: stationType.isRequired
    };

    return SymbolWrapper;
  };

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
    const { companies, name, symbols, visible } = this.props;
    if (visible) this.startRefreshing();
    if (!symbols)
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

  render() {
    const { companies, stations, symbols } = this.props;
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

    // If no config set, just render a default marker
    const effectiveSymbols = symbols || [
      {
        zoom: 0,
        symbol: Markers.Marker
      }
    ];

    return (
      <FeatureGroup>
        <ZoomBasedMarkers
          entities={filteredStations}
          symbols={effectiveSymbols}
          symbolTransform={this.insertPopup}
          zoom={zoom}
        />
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
   * A list of symbol definitions for the vehicles to be rendered.
   */
  symbols: PropTypes.arrayOf(zoomBasedSymbolType),
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
  refreshVehicles: null,
  stations: [],
  symbols: null,
  visible: false
};

export default withLeaflet(VehicleRentalOverlay);
