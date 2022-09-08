# Vector Tiles Migration Guide

Due to otp-ui's `base-map` package, the migration to [MapLibreGL](https://maplibre.org/projects/maplibre-gl-js/) is quite smooth for those implementing an otp-ui map.

Key props in `base-map` have stayed the same. After updating your tile URL to a vector tile json file (any vector tile set compatible with MapBoxGL will work), things should work with minimal changes. MapLibreGL allows for some new settings, and others are deprecated. Some props throughout all layers have changed. All packages are now typescripted, which means that it is easy to see which props have changed.
