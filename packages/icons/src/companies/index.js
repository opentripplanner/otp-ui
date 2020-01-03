import Biketown from "./biketown-icon";
import Bird from "./bird-icon";
import Bolt from "./bolt-icon";
import BoltEu from "./bolt-eu-icon";
import Car2go from "./car2go-icon";
import Gruv from "./gruv-icon";
import Hopr from "./hopr-icon";
import Lime from "./lime-icon";
import Lyft from "./lyft-icon";
import Razor from "./razor-icon";
import Reachnow from "./reachnow-icon";
import Shared from "./shared-icon";
import Spin from "./spin-icon";
import Uber from "./uber-icon";

const companyLookup = {
  biketown: Biketown,
  bird: Bird,
  bolt: Bolt,
  boltEu: BoltEu,
  car2go: Car2go,
  gruv: Gruv,
  hopr: Hopr,
  lime: Lime,
  lyft: Lyft,
  razor: Razor,
  reachnow: Reachnow,
  shared: Shared,
  spin: Spin,
  uber: Uber
};

function getCompanyIcon(name) {
  return companyLookup[name.toLowerCase()];
}

export {
  Biketown,
  Bird,
  Bolt,
  BoltEu,
  Car2go,
  getCompanyIcon,
  Gruv,
  Hopr,
  Lime,
  Lyft,
  Razor,
  Reachnow,
  Shared,
  Spin,
  Uber
};
