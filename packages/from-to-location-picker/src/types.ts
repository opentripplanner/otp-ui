export type Location = {
  lat: number;
  lon: number;
  name: string;
  /**
   * This is only used location that a user has saved. Can be either:
   * "home" or "work"
   */
  type?: string;
};

export type FromToPickerProps = {
  /**
   * The text to display on the "from" button for setting the origin of a trip.
   */
  fromText?: string;
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
   * The text to display on the "to" button for setting the destination of a trip.
   */
  toText?: string;
  /**
   * Triggered when the user clicks either the "from" or "to" button and there
   * are no from/to specific handler functions defined as props.
   *
   * Passes an argument as follows:
   * { locationType: "from/to", location, reverseGeocode: false }
   */
  setLocation?: ({
    locationType: string,
    location: Location,
    reverseGeocode: boolean
  }) => void;
  /**
   * Determines whether icons are shown on the "from" and "to" buttons.
   */
  showIcons?: boolean;
};
