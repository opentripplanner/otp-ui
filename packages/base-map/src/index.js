import React, { Component } from "react";
import PropTypes from "prop-types";
import { LayersControl, Map, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

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

class BaseMap extends Component {
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
    if (typeof onClick === "function") onClick(e);
  };

  render() {
    const {
      mapConfig,
      children,
      popupLocation,
      popupContent,
      onPopupClosed,
      onOverlayAdded,
      onOverlayRemoved,
      onViewportChanged
    } = this.props;
    const { baseLayers } = mapConfig;

    // Separate overlay layers into user-controlled (those with a checkbox in
    // the layer control) and those that are needed by the app (e.g., stop viewer
    // and itinerary overlay).
    const userControlledOverlays = [];
    const fixedOverlays = [];
    React.Children.toArray(children).forEach(child => {
      if (child.props.name) userControlledOverlays.push(child);
      else fixedOverlays.push(child);
    });

    const center = mapConfig &&
      mapConfig.initLat &&
      mapConfig.initLon && [mapConfig.initLat, mapConfig.initLon];

    return (
      <Map
        ref="map"
        className="map"
        center={center}
        zoom={mapConfig.initZoom || 13}
        maxZoom={mapConfig.maxZoom}
        // onClick={this.onLeftClick}
        // Note: Map-click is handled via single-click plugin, set up in componentDidMount()
        onOverlayAdd={onOverlayAdded}
        onOverlayRemove={onOverlayRemoved}
        onViewportChanged={onViewportChanged}
      >
        {/* Create the layers control, including base map layers and any
         * user-controlled overlays. */}
        <LayersControl position="topright">
          {/* base layers */}
          {baseLayers &&
            baseLayers.map((layer, i) => {
              // Fix tile size/zoom offset: https://stackoverflow.com/a/37043490/915811
              const { tileSize, zoomOffset } =
                L.Browser.retina && layer.hasRetinaSupport
                  ? { tileSize: 512, zoomOffset: -1 }
                  : { tileSize: null, zoomOffset: null };
              return (
                <LayersControl.BaseLayer
                  name={layer.name}
                  checked={i === 0}
                  key={i}
                >
                  <TileLayer
                    url={layer.url}
                    attribution={layer.attribution}
                    maxZoom={layer.maxZoom}
                    tileSize={tileSize}
                    zoomOffset={zoomOffset}
                    detectRetina
                  />
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
        {popupLocation && popupContent && (
          <Popup position={popupLocation} onClose={onPopupClosed}>
            {popupContent}
          </Popup>
        )}
      </Map>
    );
  }
}

BaseMap.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  /**
   * The configuration properties for the map.
   */
  mapConfig: PropTypes.shape({
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
    initLat: PropTypes.number,
    initLon: PropTypes.number,
    initZoom: PropTypes.number,
    maxZoom: PropTypes.number
  }),
  /**
   * Triggered when the user clicks on the map.
   * See https://leafletjs.com/reference-1.6.0.html#map-click for details.
   */
  onClick: PropTypes.func,
  /**
   * Triggered when the user makes an overlay visible using the map's layers control.
   * See https://leafletjs.com/reference-1.6.0.html#map-overlayadd for details.
   */
  onOverlayAdded: PropTypes.func,
  /**
   * Triggered when the user hides an overlay using the map's layers control.
   * See https://leafletjs.com/reference-1.6.0.html#map-overlayremove for details.
   */
  onOverlayRemoved: PropTypes.func,
  /**
   * Triggered when the user closes the popup (if `popupLocation` and `popupContent` have been set).
   */
  onPopupClosed: PropTypes.func,
  /**
   * Triggered when the user pans the map or changes zoom level.
   * See https://github.com/PaulLeCam/react-leaflet/blob/master/example/components/viewport.js for more details.
   */
  onViewportChanged: PropTypes.func,
  /**
   * The contents to render in the popup.
   */
  popupContent: PropTypes.node,
  /**
   * The coordinates of the popup object to display, as a [lat, lng] array.
   */
  popupLocation: PropTypes.arrayOf(PropTypes.number)
};

BaseMap.defaultProps = {
  children: null,
  mapConfig: {
    initLat: 45.52,
    initLon: -122.682,
    baseLayers: [
      {
        name: "Streets",
        url:
          "//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png",
        attribution:
          'Map tiles: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20,
        hasRetinaSupport: true
      }
    ],
    initZoom: 13
  },
  onClick: null,
  onOverlayAdded: null,
  onOverlayRemoved: null,
  onPopupClosed: null,
  onViewportChanged: null,
  popupContent: null,
  popupLocation: null
};

export default BaseMap;
