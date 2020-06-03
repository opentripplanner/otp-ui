import React, { Component } from "react";
import PropTypes from "prop-types";
import { LayersControl, Map, Popup, TileLayer } from "react-leaflet";
import utils from "@opentripplanner/core-utils";
import L from "leaflet";

import callIfValid from "./util";

/**
 * panToOffset will allow you to pan the map and adjust for something like a floating
 * left nav bar, or a page header with an offset center
 *
 * @note adapted from Peter's code: https://gist.github.com/missinglink/7620340
 *
 * @param latlng
 * @param offsetX & offsetY: defaults to [0, 0] ([X, Y] pixel offsets center) a positive x
 * offset to shift the center to the right, and a positive y offset to shift the center to the
 * bottom. Negatives will move to the center point left and top.
 * @param options: pan options https://leafletjs.com/reference.html#pan-options
 * @return return value from a call to https://leafletjs.com/reference.html#map-panto
 */
L.Map.prototype.panToOffset = function(latlng, offsetX, offsetY, options) {
  const x =
    this.latLngToContainerPoint(latlng).x - (parseInt(offsetX, 10) || 0);
  const y =
    this.latLngToContainerPoint(latlng).y - (parseInt(offsetY, 10) || 0);
  const point = this.containerPointToLatLng([x, y]);
  /* eslint-disable-next-line no-underscore-dangle */
  return this.setView(point, this._zoom, { pan: options });
};

// eslint-disable-next-line func-names
L.Evented.addInitHook(function() {
  if (this) this.singleClickTimeout = null;
  this.on("click", this.scheduleSingleClick, this);
  this.on("dblclick dragstart zoomstart", this.cancelSingleClick, this);
});

L.Evented.include({
  cancelSingleClick() {
    // This timeout is key to workaround an issue where double-click events
    // are fired in this order on some touch browsers: ['click', 'dblclick', 'click']
    // instead of ['click', 'click', 'dblclick']
    setTimeout(this.clearSingleClickTimeout.bind(this), 0);
  },

  scheduleSingleClick(e) {
    this.clearSingleClickTimeout();

    this.singleClickTimeout = setTimeout(
      this.fireSingleClick.bind(this, e),
      this.options.singleClickTimeout || 500
    );
  },

  fireSingleClick(e) {
    // eslint-disable-next-line no-underscore-dangle
    if (!e.originalEvent._stopped) {
      this.fire("singleclick", L.Util.extend(e, { type: "singleclick" }));
    }
  },

  clearSingleClickTimeout() {
    if (this.singleClickTimeout !== null) {
      clearTimeout(this.singleClickTimeout);
      this.singleClickTimeout = null;
    }
  }
});

/**
 * The base OpenTripPlanner map on which everything else is rendered.
 */
class BaseMap extends Component {
  overlays = [];

  componentDidMount() {
    const lmap = this.refs.map.leafletElement;
    lmap.options.singleClickTimeout = 250;
    lmap.on("singleclick", this.onLeftClick);
  }

  componentDidUpdate() {}

  // remove custom overlays on unmount
  // TODO: Is this needed? It may have something to do with mobile vs desktop views
  componentWillUnmount() {
    const lmap = this.refs.map.leafletElement;
    lmap.eachLayer(layer => {
      // Do not inline, there is a 'this' implied.
      lmap.removeLayer(layer);
    });
  }

  onLeftClick = e => {
    const { onClick } = this.props;
    callIfValid(onClick)(e);
  };

  forwardOne = (eventName, e) => {
    // Call the event handler, if implemented, on the layer for which this event applies.
    const layer = this.overlays.find(child => child.props.name === e.name);
    if (layer) callIfValid(layer[eventName])(e);

    // Call the event handler on this control's parent element.
    // eslint-disable-next-line react/destructuring-assignment
    callIfValid(this.props[eventName])(e);
  };

  forwardAll = (eventName, e) => {
    // Call the event handler, if implemented, on each registered overlay.
    this.overlays.forEach(layer => {
      callIfValid(layer[eventName])(e);
    });

    // Call the event handler on this control's parent element.
    // eslint-disable-next-line react/destructuring-assignment
    callIfValid(this.props[eventName])(e);
  };

  handleOverlayAdded = e => {
    this.forwardOne("onOverlayAdded", e);
  };

  handleOverlayRemoved = e => {
    this.forwardOne("onOverlayRemoved", e);
  };

  handleViewportChanged = e => {
    this.forwardAll("onViewportChanged", e);
  };

  registerOverlay = overlay => {
    this.overlays.push(overlay);
  };

  render() {
    const {
      baseLayers,
      center,
      children,
      maxZoom,
      popup,
      onContextMenu,
      onPopupClosed,
      zoom
    } = this.props;

    // Separate overlay layers into user-controlled (those with a checkbox in
    // the layer control) and those that are needed by the app (e.g., stop viewer
    // and itinerary overlay).
    const userControlledOverlays = [];
    const fixedOverlays = [];
    React.Children.toArray(children).forEach(child => {
      if (child.props.name) {
        const newChild = React.cloneElement(child, {
          // Inject registerOverlay prop to each custom overlay.
          registerOverlay: this.registerOverlay
        });
        userControlledOverlays.push(newChild);
      } else fixedOverlays.push(child);
    });

    return (
      <Map
        ref="map"
        className="map"
        center={center}
        zoom={zoom}
        maxZoom={maxZoom}
        // onClick={this.onLeftClick}
        // Note: Map-click is handled via single-click plugin, set up in componentDidMount()
        onContextMenu={onContextMenu}
        onOverlayAdd={this.handleOverlayAdded}
        onOverlayRemove={this.handleOverlayRemoved}
        onViewportChanged={this.handleViewportChanged}
      >
        {/* Create the layers control, including base map layers and any
         * user-controlled overlays. */}
        <LayersControl position="topright">
          {/* base layers */}
          {baseLayers &&
            baseLayers.map((layer, i) => {
              return (
                <LayersControl.BaseLayer
                  name={layer.name}
                  checked={i === 0}
                  key={i}
                >
                  {
                    // Fix tile size/zoom offset: https://stackoverflow.com/a/37043490/915811
                    // Also, split the declaration between the two
                    // outcomes to avoid error 'attempted to load an infinite number of tiles'
                    // if the tiles cannot be loaded for any reason.
                  }
                  {layer.retina ? (
                    <TileLayer
                      url={layer.url}
                      attribution={layer.attribution}
                      retina={layer.retina}
                      maxZoom={layer.maxZoom}
                      tileSize={512}
                      zoomOffset={-1}
                      detectRetina={layer.detectRetina}
                    />
                  ) : (
                    <TileLayer
                      url={layer.url}
                      attribution={layer.attribution}
                      maxZoom={layer.maxZoom}
                      detectRetina={layer.detectRetina}
                    />
                  )}
                </LayersControl.BaseLayer>
              );
            })}

          {/* user-controlled overlay layers (e.g., vehicle locations, stops) */}
          {userControlledOverlays.map((child, i) => (
            <LayersControl.Overlay
              key={i}
              name={child.props.name}
              checked={child.props.visible}
            >
              {child}
            </LayersControl.Overlay>
          ))}
        </LayersControl>

        {/* Add the fixed, i.e. non-user-controllable, overlays (e.g., itinerary overlay) */}
        {fixedOverlays}

        {/* Add the location selection popup and content, if both are set. */}
        {popup && popup.location && popup.contents && (
          <Popup position={popup.location} onClose={onPopupClosed}>
            {popup.contents}
          </Popup>
        )}
      </Map>
    );
  }
}

BaseMap.propTypes = {
  /**
   * Zero, one, or multiple components that extend { MapLayer } from 'react-leaflet'.
   * Children can be overlays or loose markers.
   */
  children: PropTypes.oneOfType([
    // Ideally, the types below should be MapLayer,
    // however, during type validation in the browser,
    // MapLayer components all seem to resolve to Object.
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  /**
   * The base (background) layers for the map.
   */
  baseLayers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      subdomains: PropTypes.string,
      attribution: PropTypes.string,
      maxZoom: PropTypes.number,
      hasRetinaSupport: PropTypes.bool
    })
  ),
  /**
   * The center of the map, as a [lat, lng] array.
   */
  center: utils.types.latlngType.isRequired,
  /**
   * The maximum zoom level allowed on the map.
   */
  maxZoom: PropTypes.number,
  /**
   * Triggered when the user clicks on the map.
   * See https://leafletjs.com/reference-1.6.0.html#map-click for details.
   */
  onClick: PropTypes.func,
  /**
   * Triggered when the user right-clicks on the map or, on a mobile device, presses the map for a second ("long-press").
   * See https://leafletjs.com/reference-1.6.0.html#map-contextmenu for details.
   */
  onContextMenu: PropTypes.func,
  /**
   * Triggered when the user makes an overlay visible using the map's layers control.
   * See https://leafletjs.com/reference-1.6.0.html#map-overlayadd for details.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onOverlayAdded: PropTypes.func,
  /**
   * Triggered when the user hides an overlay using the map's layers control.
   * See https://leafletjs.com/reference-1.6.0.html#map-overlayremove for details.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onOverlayRemoved: PropTypes.func,
  /**
   * Triggered when the user closes the popup (if `popupLocation` and `popupContent` have been set).
   */
  onPopupClosed: PropTypes.func,
  /**
   * Triggered when the user pans the map or changes zoom level.
   * See https://github.com/PaulLeCam/react-leaflet/blob/master/example/components/viewport.js for more details.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onViewportChanged: PropTypes.func,
  /**
   * The contents and location (in [lat, lng] format) of the popup to display, or null if no popup is displayed.
   */
  popup: PropTypes.shape({
    contents: PropTypes.node.isRequired,
    location: utils.types.latlngType.isRequired
  }),
  /**
   * The zoom level of the map.
   */
  zoom: PropTypes.number
};

BaseMap.defaultProps = {
  children: null,
  baseLayers: [
    {
      name: "Streets",
      url:
        "//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png",
      attribution:
        'Map tiles: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20

      // FIXME?? CartoDB displays characters proportionally too large
      // on regular monitors (1080p or lower) when using the "retina" parameters below.
      // (That does not happen on "retina" displays such as Macbook or mobile phones.)
      // url:
      //  "//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{retina}.png",
      // retina: "@2x",
      // detectRetina: true
    }
  ],
  maxZoom: 20,
  onClick: null,
  onContextMenu: null,
  onOverlayAdded: null,
  onOverlayRemoved: null,
  onPopupClosed: null,
  onViewportChanged: null,
  popup: null,
  zoom: 13
};

export default BaseMap;
