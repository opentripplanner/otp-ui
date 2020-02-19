## Usage

```html
<Vehicles
 
 visible="true or false: programmatic prop control over the display and fetch of vehicle data"
 name="optional string: This name will appear in the leaflet layer switcher."
   note: not including the 'name' attribute will not list the vehicles in the layer switcher (often desirable). 
         In this case, the component can be controlled by the visbile property, where layer display and interval 
         fetches are controlled programmatically (see storybook for examples)
          
 geometryUrl="required base URL to GeoJSON transit pattern data -- the url is filled out internally via tracking a vehicle, using the vehicle rec. pattern id, etc"
 vehicleUrl="required base URL to vehicle data service"
 vehicleQuery="optional string: (default 'routes/all'): eg: 'routes/90,100,190,200,290' will show just MAX route vehicles " 
 refreshDelay="how often are new vehicles fetched from the service (default 5000 ms)."
 
 tracked="optional string: either a blockId (better) or tripId used to follow a given vehicle's progress" 
   note: the tracked vehicle must be in the list of queried vehicles, and running the specified trip ... for example, a 
         vehicle that's on a layover might not yet be running with the tripId you'd want to track using blockId is better than 
         trip, since a blockId will track a vehicle over multiple trips recenterMap="optional boolean (default true)
         pans the map to the selected vehicle as it move along its trip
 panOffsetX="shift map center point left or right X pixels of the tracked vehicle (see recenterMap == true)" 
 panOffsetY="shift map center point up or down Y pixels of the tracked vehicle (see recenterMap == true)" 
                                                                                                         
 hasPopup="optional boolean (default true) ... show vehicle marker popups" 
   note: advice is to set this once prior to the component being instantiated, since resetting this to false
         after a true will result in an empty popup artifact (you can see this on Storybook)                                      
 hasTooltip="optional boolean (default true) ... show tooltip on desktop (leaflet's idea of what is desktop vs mobile) 
 
 color="optional string (defaults to black): changes the color of the vehicle markers"
 highlightColor="optional string (defaults to cyan/blue): for tracked vehicle marker and the route geom the vehicle is proceeding along"
 lowlightColor="optional string (defaults to grey): for showing the partial route geometry previously travelled by the tracked vehicle" 
 highlight="line geom css for tracked route" lowlight="line geom css for tracked route previously travelled"
                                                                                  
 onTrackedVehicleUpdate="function callback to share the tracked vehicle record with the parent ... a new record is sent on each fetch, thus sharing position and other changes" 
 onVehicleListUpdate="function callback to share the list of vehicles fetched from the service every N seconds (see refreshDelay)" 
                                                                                  
/>
```

The backend calls for the vehicle and pattern geometries are based on GTFS and GTFS-RT data, via the use of the OSS http://gtfsdb.com and associated services (e.g., implementations are not limited to any proprietary service).

```
Vehicle Apps & Services:
--
 - https://maps.trimet.org/gtfs/rt/vehicles/routes/100,90,190,200,290
 - https://maps.trimet.org/gtfs/rt/vehicles/routes/all
```
