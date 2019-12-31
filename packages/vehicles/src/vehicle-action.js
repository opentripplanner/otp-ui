import React from "react";
// import PropTypes from "prop-types";

function VehicleAction() {
  const [vehicleData, setVehicleData] = React.useState(null);

  // the code below w/in useEffect is a simplified version of what's in vehcile-action.js / VechicleAction component
  // note: we wrap the setInterval / clearInterval w/in a useEffect, since that will work our component lifecycle.
  React.useEffect(() => {
    let getDataInterval = null;

    // when state of vehicle data is null (new) set the data updates here
    // this makes sure we only have 1 updater interval (else chaos ensues)
    // NOTE: because we're setting state below, this function is going to get called multiple times by react
    //       if we don't have the gate of vehicleData == null, then we'll get multiple setInterval calls
    if (vehicleData == null) {
      // setVehicleData(v[i]);
      getDataInterval = setInterval(() => {
        console.log(`using vehicle load X`);
        // setVehicleData(v[i]);
      }, 5000);
    }

    return () => {
      // before vehicle view component unmounts, clear the interval...
      if (getDataInterval) {
        clearInterval(getDataInterval);
        getDataInterval = null;
        setVehicleData(null);
      }
    };
  }, []);

  // const retVal = <Map center={portland} vehicles={vehicleData}></Map>;
  const retVal = null;
  return retVal;
}

/*
function Map(props) {
  const { center } = props;
  const { vehicles } = props;
  //return ();
}

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  vehicles: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
*/

export default VehicleAction;
