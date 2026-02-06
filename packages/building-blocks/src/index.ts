import blue from "./colors/blue";
import red from "./colors/red";
import grey from "./colors/grey";
import Dropdown from "./dropdown";
import FocusTrapWrapper, {
  getNextSibling,
  getPreviousSibling
} from "./focus-trap-wrapper";
import Alert from "./alert/Alert";

// TODO: Fix exports
export {
  Alert,
  Dropdown,
  FocusTrapWrapper,
  getNextSibling,
  getPreviousSibling
};
export default { blue, red, grey };
