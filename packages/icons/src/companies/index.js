/* eslint-disable import/prefer-default-export */
import { lazy } from "react";

const companyLookup = {
  biketown: lazy(() => import("./biketown-icon")),
  lyft_pdx: lazy(() => import("./biketown-icon")),
  bird: lazy(() => import("./bird-icon")),
  bolt: lazy(() => import("./bolt-icon")),
  boltEu: lazy(() => import("./bolt-eu-icon")),
  car2go: lazy(() => import("./car2go-icon")),
  gruv: lazy(() => import("./gruv-icon")),
  hopr: lazy(() => import("./hopr-icon")),
  lime: lazy(() => import("./lime-icon")),
  lyft: lazy(() => import("./lime-icon")),
  razor: lazy(() => import("./razor-icon")),
  reachnow: lazy(() => import("./reachnow-icon")),
  shared: lazy(() => import("./shared-icon")),
  spin: lazy(() => import("./spin-icon")),
  uber: lazy(() => import("./uber-icon"))
};

function getCompanyIcon(name) {
  const icon =
    companyLookup[name.toLowerCase()] ||
    /*
    Some company names are lyft_pdx instead of just Lyft. 
    This PR matches based on the first 4 characters to hopefully 
    match more company icons.
    */
    companyLookup[name.toLowerCase().slice(0, 4)];
  if (!icon) {
    console.warn(`No Company Icon found for: '${name}'!`);
  }
  return icon;
}

export { getCompanyIcon };
