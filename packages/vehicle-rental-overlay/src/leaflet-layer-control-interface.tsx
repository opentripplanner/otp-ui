import React, { Component } from "react";

import VehicleRentalOverlay from ".";

type Props = {
  /**
   * This method is created by the @opentripplanner/base-map package when
   * mounting user-defined layers. This will allow the component to subscribe to
   * various leaflet events that then get forwarded on to this component.
   */
  registerOverlay: (component: Component) => void;
  /**
   * Whether or not to initially display the rental vehicles. Once the component
   * is mounted the subscribed events of a user toggling on or off the layer via
   * the layer control item will subsequently control the display of the
   * component.
   */
  visible?: boolean;
};

type State = {
  /**
   * An internal state variable used to determine whether or not to display the
   * rental vehicles for this layer.
   */
  visible: boolean;
};

/**
 * This class is a necessary intermediary to handle events from the Leaflet map
 * existing in the parent element. See more notes on the other properties and
 * methods for how everything interacts.
 */
export default class LeafletLayerControlInterface extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = { visible: props.visible };
  }

  /**
   * Upon mounting, this class calls the register overlay property that the
   * @opentripplanner/base-map package has injected into the props.
   */
  componentDidMount() {
    const { registerOverlay } = this.props;
    registerOverlay(this);
  }

  /**
   * A handler function for when this layer is toggled on by the user via the
   * leaflet layer control.
   */
  onOverlayAdded = () => {
    this.setState({ visible: true });
  };

  /**
   * A handler function for when this layer is toggled off by the user via the
   * leaflet layer control.
   */
  onOverlayRemoved = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <VehicleRentalOverlay {...this.props} visible={visible} />
    );
  }
}
