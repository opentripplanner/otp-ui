import React from "react";
import PropTypes from "prop-types";
import { MapLayer, FeatureGroup, withLeaflet } from "react-leaflet";

import { leafletPathType } from "@opentripplanner/core-utils/lib/types";
import { throttle } from 'throttle-debounce';

import VehicleLayer from "./VehicleLayer";
import VehicleGeometry from "./VehicleGeometry";
import * as utils from "./utils";

/**
 * TODO: describe
 * TODO: talk about gtfsdb and opensource
 */
class Vehicles extends MapLayer {
  state = {
    mapZoom: 0,
    vehicleData: null,
    trackedVehicle: null,
    trackedGeometry: null
  };

  componentDidMount() {
    // register this layer with base-map, so it will call the onOverlayX and onViewportZ methods
    const { registerOverlay } = this.props;
    utils.callIfValid(registerOverlay)(this);

    if (this.props.visible) {
      this._startRefreshing();
    }

    // initialize zoom state here? (may trigger render again.)
    const zoom = this.getLeafletContext().map.getZoom();
    this.setMapZoom(zoom);
  }

  componentWillUnmount() {
    this._stopRefreshing();
  }

  componentDidUpdate() {
    //this.trackVehicle();
  }

  // limit the number of times we'll call this method
  setMapZoom = throttle(500, (zoom) => {
    console.log("HI");
    this.setState({ mapZoom: zoom });
  });

  _refreshTimer = null;

  _startRefreshing() {
    if (this._refreshTimer === null) {
      utils.fetchVehicles(this.setVehicleData, this.getTrackedVehicleId(), this.props.vehicleUrl);
      this._refreshTimer = setInterval(() => {
        utils.fetchVehicles(this.setVehicleData, this.getTrackedVehicleId(), this.props.vehicleUrl);
      }, this.props.refreshDelay);
    }
  };

  _stopRefreshing() {
    if(this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
    if(this.state.trackedVehicle !== null) {
      this.state.trackedVehicle = null;
    }
  }

  // onOverlayAdded will notifiy this layer whenever this layer gets added to BaseMap
  onOverlayAdded = e => {
    this._startRefreshing();
  };

  // onOverlayRemoved will notify this layer when removed to BaseMap
  onOverlayRemoved = e => {
    this._stopRefreshing();
  };

  // onViewportChanged notified whenever the BaseMap's center or zoom changes
  onViewportChanged = viewport => {
    this.setMapZoom(viewport.zoom);
  };

  getLeafletContext() {return this.props.leaflet;}

  setTracked = (t) => { };

  getTrackedVehicleId = () => {
    //this.props.tracked
    return null;
  };

  setVehicleData = (d) => {
    this.setState({ vehicleData: d });
  };


  // need to implement create interface (and update interface for older React-Leaflet versions)
  createLeafletElement(/* props */) {}

  updateLeafletElement(/* props */) {}

  render() {
    return (
      <FeatureGroup>
        <VehicleLayer
          vehicles={this.state.vehicleData}
          trackedVehicle={this.state.trackedVehicle}
          setTracked={this.setTracked}
          color={this.props.color}
        />
        <VehicleGeometry
          trackedVehicle={this.state.trackedVehicle}
          pattern={this.state.trackedGeometry}
          color={this.props.color}
          highlight={this.props.highlight}
          lowlight={this.props.lowlight}
        />
      </FeatureGroup>
    );
  }
}


Vehicles.defaultProps = {
  highlight: VehicleGeometry.defaultProps.highlight,
  lowlight: VehicleGeometry.defaultProps.lowlight,
  color: null,

  geometryUrl: "https://newplanner.trimet.org/ws/ti/v0/index",
  vehicleUrl: "https://maps.trimet.org/gtfs/rt/vehicles/routes/all",
  vehicleRoutes: "all",
  refreshDelay: 5000,
  tracked: null,
  recenterMap: false
};

Vehicles.propTypes = {
  highlight: leafletPathType,
  lowlight: leafletPathType,
  color: PropTypes.string,
  geometryUrl: PropTypes.string,
  vehicleUrl: PropTypes.string,
  vehicleRoutes: PropTypes.string,
  refreshDelay: PropTypes.number,
  tracked: PropTypes.string,
  recenterMap: PropTypes.bool
};

export default withLeaflet(Vehicles);



function xVehicles(props) {
  const { vehicleUrl } = props;
  const { geometryUrl } = props;

  const refreshDelay = utils.checkRefreshInteval(props.refreshDelay);

  const [vehicleData, setVehicleData] = React.useState(null);

  const [trackedVehicle, setTrackedVehicle] = React.useState(null);
  const trackedVehicleRef = React.useRef(trackedVehicle);
  React.useEffect(() => {
    trackedVehicleRef.current = trackedVehicle;
  }, [trackedVehicle]); // allows us to get a current handle on the trackedVehicle state

  const [trackedGeometry, setTrackedGeometry] = React.useState(null);
  const trackedGeometryRef = React.useRef(trackedGeometry);
  React.useEffect(() => {
    trackedGeometryRef.current = trackedGeometry;
  }, [trackedGeometry]);

  /** callback function where the tracked geometry stored */
  function setTrackedGeomData(patternId, data) {
    setTrackedGeometry({ id: patternId, data });
  }

  function isPatternCached(patternId) {
    let retVal = false;
    if (trackedGeometryRef && trackedGeometryRef.current) {
      if (patternId === trackedGeometryRef.current.id) retVal = true;
    }
    return retVal;
  }

  /** callback function where the setVehicleData & setTrackedVehicle is stored */
  function setData(vehicleList, trackedId) {
    // step 1: set vehicle data
    setVehicleData(vehicleList);

    // step 2: tracked vehicle
    const vehicle = utils.findVehicleById(vehicleList, trackedId);
    if (vehicle) {
      setTrackedVehicle(vehicle);

      // step 3: tracked vehicle geometry
      if (vehicle.shapeId) {
        try {
          const patternId = `${vehicle.agencyId}:${vehicle.shapeId}`;
          if (!isPatternCached(patternId)) {
            console.log(">>>>>>>>>>>>>>>>>>");
            console.log(patternId);
            utils.fetchVehiclePattern(
              setTrackedGeomData,
              patternId,
              geometryUrl
            );
            console.log(trackedGeometryRef);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  function setTracked(vehId, geomData) {
    setTrackedVehicle(vehId);
    // TODO: add cache scheme and then do a shortcut for setting geom data
    // if (vehId && geomData === null) geomData = geomCache.find(vehId);
    setTrackedGeometry(geomData);
  }

  function getTrackedVehicle() {
    let retVal = null;
    if (trackedVehicleRef && trackedVehicleRef.current)
      retVal = trackedVehicleRef.current;
    return retVal;
  }

  function getTrackedVehicleId() {
    let retVal = null;
    const t = getTrackedVehicle();
    if (t && t.vehicleId) retVal = t.vehicleId;
    return retVal;
  }

  // note: we wrap the setInterval / clearInterval w/in a useEffect, since that will work our component lifecycle.
  React.useEffect(() => {
    // when state of vehicle data is null (new) set the data updates here
    // this makes sure we only have 1 updater interval (else chaos ensues)
    // NOTE: because we're setting state below, this function is going to get called multiple times by react
    //       if we don't have the gate of vehicleData == null, then we'll get multiple setInterval calls
    let interval = null;
    if (vehicleData === null) {
      utils.fetchVehicles(setData, props.tracked, vehicleUrl);
      interval = setInterval(() => {
        utils.fetchVehicles(setData, getTrackedVehicleId(), vehicleUrl);
      }, refreshDelay);
    }

    return () => {
      // before vehicle view component un-mounts, clear the interval...
      if (interval) {
        clearInterval(interval);
        setTracked(null, null);
        interval = null;
      }
    };
  }, []);

  const retVal = (
    <FeatureGroup>
      <VehicleLayer
        vehicles={vehicleData}
        trackedVehicle={trackedVehicle}
        setTracked={setTracked}
        color={props.color}
      />
      <VehicleGeometry
        trackedVehicle={trackedVehicle}
        pattern={trackedGeometry}
        color={props.color}
        highlight={props.highlight}
        lowlight={props.lowlight}
      />
    </FeatureGroup>
  );
  return retVal;
}


//export default Vehicles;
