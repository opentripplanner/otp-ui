import React from "react";
import { storiesOf } from "@storybook/react";

import * as Icons from ".";

function Container({ children }) {
  return <div style={{ width: 40 }}>{children}</div>;
}

storiesOf("Icons", module)
  .add("Accessible", () => (
    <Container>
      <Icons.Accessible />
    </Container>
  ))
  .add("AerialTram", () => (
    <Container>
      <Icons.AerialTram />
    </Container>
  ))
  .add("Alert", () => (
    <Container>
      <Icons.Alert />
    </Container>
  ))
  .add("AlertSolid", () => (
    <Container>
      <Icons.AlertSolid />
    </Container>
  ))
  .add("App", () => (
    <Container>
      <Icons.App />
    </Container>
  ))
  .add("ArrowDown", () => (
    <Container>
      <Icons.ArrowDown />
    </Container>
  ))
  .add("ArrowLeft", () => (
    <Container>
      <Icons.ArrowLeft />
    </Container>
  ))
  .add("Bicycle", () => (
    <Container>
      <Icons.Bicycle />
    </Container>
  ))
  .add("Bike", () => (
    <Container>
      <Icons.Bike />
    </Container>
  ))
  .add("BikeAndRide", () => (
    <Container>
      <Icons.BikeAndRide />
    </Container>
  ))
  .add("BikeLocker", () => (
    <Container>
      <Icons.BikeLocker />
    </Container>
  ))
  .add("BikeParking", () => (
    <Container>
      <Icons.BikeParking />
    </Container>
  ))
  .add("BikeStaple", () => (
    <Container>
      <Icons.BikeStaple />
    </Container>
  ))
  .add("Bird", () => (
    <Container>
      <Icons.Bird />
    </Container>
  ))
  .add("Bolt", () => (
    <Container>
      <Icons.Bolt />
    </Container>
  ))
  .add("Bus", () => (
    <Container>
      <Icons.Bus />
    </Container>
  ))
  .add("BusCircle", () => (
    <Container>
      <Icons.BusCircle />
    </Container>
  ))
  .add("Car", () => (
    <Container>
      <Icons.Car />
    </Container>
  ))
  .add("Car2go", () => (
    <Container>
      <Icons.Car2go />
    </Container>
  ))
  .add("Circle", () => (
    <Container>
      <Icons.Circle />
    </Container>
  ))
  .add("CircleClockwise", () => (
    <Container>
      <Icons.CircleClockwise />
    </Container>
  ))
  .add("CircleCounterclockwise", () => (
    <Container>
      <Icons.CircleCounterclockwise />
    </Container>
  ))
  .add("Elevator", () => (
    <Container>
      <Icons.Elevator />
    </Container>
  ))
  .add("Email", () => (
    <Container>
      <Icons.Email />
    </Container>
  ))
  .add("Feedback", () => (
    <Container>
      <Icons.Feedback />
    </Container>
  ))
  .add("Ferry", () => (
    <Container>
      <Icons.Ferry />
    </Container>
  ))
  .add("Gruv", () => (
    <Container>
      <Icons.Gruv />
    </Container>
  ))
  .add("HardLeft", () => (
    <Container>
      <Icons.HardLeft />
    </Container>
  ))
  .add("HardRight", () => (
    <Container>
      <Icons.HardRight />
    </Container>
  ))
  .add("Help", () => (
    <Container>
      <Icons.Help />
    </Container>
  ))
  .add("HelpSolid", () => (
    <Container>
      <Icons.HelpSolid />
    </Container>
  ))
  .add("Hopr", () => (
    <Container>
      <Icons.Hopr />
    </Container>
  ))
  .add("Info", () => (
    <Container>
      <Icons.Info />
    </Container>
  ))
  .add("Left", () => (
    <Container>
      <Icons.Left />
    </Container>
  ))
  .add("Lime", () => (
    <Container>
      <Icons.Lime />
    </Container>
  ))
  .add("Lyft", () => (
    <Container>
      <Icons.Lyft />
    </Container>
  ))
  .add("Map", () => (
    <Container>
      <Icons.Map />
    </Container>
  ))
  .add("MapMarker", () => (
    <Container>
      <Icons.MapMarker />
    </Container>
  ))
  .add("MapMarkerSolid", () => (
    <Container>
      <Icons.MapMarkerSolid />
    </Container>
  ))
  .add("Max", () => (
    <Container>
      <Icons.Max />
    </Container>
  ))
  .add("MaxCircle", () => (
    <Container>
      <Icons.MaxCircle />
    </Container>
  ))
  .add("Micromobility", () => (
    <Container>
      <Icons.Micromobility />
    </Container>
  ))
  .add("Parking", () => (
    <Container>
      <Icons.Parking />
    </Container>
  ))
  .add("Phone", () => (
    <Container>
      <Icons.Phone />
    </Container>
  ))
  .add("Plane", () => (
    <Container>
      <Icons.Plane />
    </Container>
  ))
  .add("Razor", () => (
    <Container>
      <Icons.Razor />
    </Container>
  ))
  .add("Reachnow", () => (
    <Container>
      <Icons.Reachnow />
    </Container>
  ))
  .add("Refresh", () => (
    <Container>
      <Icons.Refresh />
    </Container>
  ))
  .add("Right", () => (
    <Container>
      <Icons.Right />
    </Container>
  ))
  .add("Schedule", () => (
    <Container>
      <Icons.Schedule />
    </Container>
  ))
  .add("Shared", () => (
    <Container>
      <Icons.Shared />
    </Container>
  ))
  .add("SlightLeft", () => (
    <Container>
      <Icons.SlightLeft />
    </Container>
  ))
  .add("SlightRight", () => (
    <Container>
      <Icons.SlightRight />
    </Container>
  ))
  .add("Snow", () => (
    <Container>
      <Icons.Snow />
    </Container>
  ))
  .add("Spin", () => (
    <Container>
      <Icons.Spin />
    </Container>
  ))
  .add("Star", () => (
    <Container>
      <Icons.Star />
    </Container>
  ))
  .add("StopStation", () => (
    <Container>
      <Icons.StopStation />
    </Container>
  ))
  .add("StopStationSolid", () => (
    <Container>
      <Icons.StopStationSolid />
    </Container>
  ))
  .add("Straight", () => (
    <Container>
      <Icons.Straight />
    </Container>
  ))
  .add("Streetcar", () => (
    <Container>
      <Icons.Streetcar />
    </Container>
  ))
  .add("StreetcarCircle", () => (
    <Container>
      <Icons.StreetcarCircle />
    </Container>
  ))
  .add("Transittracker", () => (
    <Container>
      <Icons.Transittracker />
    </Container>
  ))
  .add("TransittrackerSolid", () => (
    <Container>
      <Icons.TransittrackerSolid />
    </Container>
  ))
  .add("TripPlanner", () => (
    <Container>
      <Icons.TripPlanner />
    </Container>
  ))
  .add("TripPlannerSolid", () => (
    <Container>
      <Icons.TripPlannerSolid />
    </Container>
  ))
  .add("UTurnLeft", () => (
    <Container>
      <Icons.UTurnLeft />
    </Container>
  ))
  .add("UTurnRight", () => (
    <Container>
      <Icons.UTurnRight />
    </Container>
  ))
  .add("Uber", () => (
    <Container>
      <Icons.Uber />
    </Container>
  ))
  .add("Walk", () => (
    <Container>
      <Icons.Walk />
    </Container>
  ))
  .add("Wes", () => (
    <Container>
      <Icons.Wes />
    </Container>
  ))
  .add("WesCircle", () => (
    <Container>
      <Icons.WesCircle />
    </Container>
  ))
  .add("Zoom", () => (
    <Container>
      <Icons.Zoom />
    </Container>
  ))
  .add("ZoomAngle", () => (
    <Container>
      <Icons.ZoomAngle />
    </Container>
  ));
