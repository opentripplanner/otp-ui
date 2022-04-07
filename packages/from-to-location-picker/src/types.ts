// eslint-disable-next-line prettier/prettier
import type { Location } from "@opentripplanner/types";

export type FromToPickerProps = {
  /**
   * A specific location to associate with this. This is only used when combined
   * with the setLocation prop.
   */
  location?: Location;
  /**
   * Triggered when the user clicks on the "from" button.
   */
  onFromClick: () => void;
  /**
   * Triggered when the user clicks on the "to" button.
   */
  onToClick: () => void;
  /**
   * Triggered when the user clicks either the "from" or "to" button and there
   * are no from/to specific handler functions defined as props.
   *
   * Passes an argument as follows:
   * { locationType: "from/to", location, reverseGeocode: false }
   */
  setLocation?: ({
    locationType: string,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    location: Location,
    reverseGeocode: boolean
  }) => void;
  /**
   * Determines whether icons are shown on the "from" and "to" buttons.
   */
  showIcons?: boolean;
};
