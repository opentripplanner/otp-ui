## Usage

```html
<Vehicles
   name="string: This name will appear in the leaflet layer switcher" 
   vehicleQuery="optional string: (default 'routes/all'): eg: 'routes/90,100,190,200,290' will show just MAX route vehicles "
   tracked="optional string: change prop value dynamically with either a tripId (readily available) or vehicleId (not
            readily available...except via the RT feed) to set / change what vehicle is selected"
      note: you can set tracked to "blah" when instantiating Vehicles, and the use it later to highlight a vehicle. 
      note: the tracked vehicle must be in the list of queried vehicles, and running the specified trip ... 
            for example, a vehicle that's on a layover might not yet be running with the tripId you'd want to track
   color="optional string: changes the color of the tracked vehicle marker and route geom"
   recenterMap=optional boolean (default true) pans the map to the selected vehicle as it move along its trip
   hasPopup=optional boolean (default true) ... show vehicle marker popups 
      note: advice is to set once prior to the component being instantiated, since resetting this to false  
            after a true will result in an empty popup artifact (you can see this on Storybook) 
   hasTooltip=optional boolean (default true) ... show tooltip on desktop (leaflet's idea of what is desktop vs mobile)
   visible
/>
```
The backend calls for the vehicle and pattern geometries are based on GTFS and GTFS-RT data, via the use of the OSS http://gtfsdb.com and associated services (e.g., implementations are not limited to any proprietary service).

```
Vehicle Apps & Services:
--
 - https://maps.trimet.org/gtfs/rt/vehicles/routes/100,90,190,200,290
 - https://maps.trimet.org/gtfs/rt/vehicles/routes/all
```
