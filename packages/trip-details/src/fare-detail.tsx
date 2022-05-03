/* eslint-disable import/prefer-default-export */
import React, { useState } from "react";
import { FareDetailsProps } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FareDetails = (props: FareDetailsProps): JSX.Element => {
  const { legs, transitFares } = props;
  const fareKeys = Object.keys(transitFares.details);
  const faresWithLegs = fareKeys.reduce((prev, key) => {
    prev[key] = transitFares.details[key].map(fare => ({
      ...fare,
      leg: legs[fare.legIndex]
    }));
    return prev;
  }, {});
  // const legsWithFares = legs.map((leg, index) => {
  //   const fares = fareKeys.reduce((prev, key) => {
  //     const fareForKey = transitFares.details[key]?.find(
  //       detail => detail.legIndex === index
  //     );
  //     if (fareForKey) {
  //       prev[key] = fareForKey;
  //     }
  //     return prev;
  //   }, {});
  //   return {
  //     ...leg,
  //     fares
  //   };
  // });

  const [selectedFareType, setSelectedFareType] = useState(fareKeys[0]);

  const onSelectFareType = e => setSelectedFareType(e.target.value);

  const fareList = faresWithLegs[selectedFareType].map(fare => (
    <li key={fare.legIndex}>
      {fare.leg.routeShortName}: ${fare.price.cents / 100}
    </li>
  ));

  return (
    <div>
      <select
        name="fareTypes"
        id="fareType"
        value={selectedFareType}
        onChange={onSelectFareType}
      >
        {fareKeys.map(key => (
          <option key={key}>{key}</option>
        ))}
      </select>
      {fareList}
    </div>
  );
};
