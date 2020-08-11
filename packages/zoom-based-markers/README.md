## Usage

Place a `ZoomBasedMarkers` component inside a react-leaflet `FeatureGroup`, `Map` or an OTP-UI's `BaseMap`
to render `entities` with different `symbols` depending on the `zoom` level.

Example using a `FeatureGroup`:

```jsx
import { CircleMarker } from "react-leaflet";

const entities = [
  { id: 1, lat: 23.45, lon: 67.89 },
  { id: 2, lat: 23.46, lon: 67.88 }
];

const MySymbol = ({ entity }) => (
  <CircleMarker
    center={[entity.lat, entity.lon]}
    fillColor="#00FF00"
    radius={30}
  />
);

const symbols = [{
  minZoom: 10,
  symbol: MySymbol
}];

...

<FeatureGroup>
  <ZoomBasedMarkers
    entities={entities}
    symbols={symbols}
    zoom={zoom} // obtain zoom from the map's zoom.
  />
</FeatureGroup>
```

For other examples, including rendering symbols for different types of entities (e.g. bus vs. trains),
or more advanced handling of symbols, please refer to the examples in the component Storybook.
