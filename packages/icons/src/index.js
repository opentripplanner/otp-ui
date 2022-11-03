import * as classic from "./classic";
import * as companies from "./companies";
import * as directions from "./directions";
import * as generic from "./generic";
import IconRenderer from "./icon-renderer";
import * as standard from "./standard";
import * as trimet from "./trimet";
import ClassicLegIcon from "./classic-leg-icon";
import ClassicModeIcon from "./classic-mode-icon";
import LegIcon from "./leg-icon";
import StandardLegIcon from "./standard-leg-icon";
import StandardModeIcon from "./standard-mode-icon";
import TriMetLegIcon from "./trimet-leg-icon";
import TriMetModeIcon from "./trimet-mode-icon";
import TriMetModeIcon2021 from "./trimet-mode-icon-2021";

const {
  ClassicBike,
  ClassicBus,
  ClassicCar,
  ClassicFerry,
  ClassicGondola,
  ClassicMicromobility,
  ClassicTram,
  ClassicWalk
} = classic;

const { getCompanyIcon } = companies;

const {
  CircleClockwise,
  CircleCounterclockwise,
  DirectionIcon,
  Elevator,
  HardLeft,
  HardRight,
  Left,
  Right,
  SlightLeft,
  SlightRight,
  Straight,
  UTurnLeft,
  UTurnRight
} = directions;

const { ArrowDown, ArrowLeft, Refresh, Star } = generic;

const {
  StandardBike,
  StandardBus,
  StandardGondola,
  StandardRail,
  StandardStreetcar,
  StandardTram,
  StandardWalk
} = standard;

const {
  Accessible,
  AerialTram,
  Alert,
  AlertSolid,
  App,
  Bicycle,
  Bike,
  BikeAndRide,
  BikeLocker,
  BikeParking,
  BikeStaple,
  Bus,
  BusCircle,
  Car,
  Circle,
  Email,
  Feedback,
  Ferry,
  Help,
  HelpSolid,
  Info,
  Map,
  MapMarker,
  MapMarkerSolid,
  Max,
  MaxCircle,
  Micromobility,
  Parking,
  Phone,
  Plane,
  Schedule,
  Snow,
  StopStation,
  StopStationSolid,
  Streetcar,
  StreetcarCircle,
  Transittracker,
  TransittrackerSolid,
  TriMet,
  TripPlanner,
  TripPlannerSolid,
  Walk,
  Wes,
  WesCircle,
  Zoom,
  ZoomAngle
} = trimet;

export {
  Accessible,
  AerialTram,
  Alert,
  AlertSolid,
  App,
  ArrowDown,
  ArrowLeft,
  Bicycle,
  Bike,
  BikeAndRide,
  BikeLocker,
  BikeParking,
  BikeStaple,
  Bus,
  BusCircle,
  Car,
  Circle,
  CircleClockwise,
  CircleCounterclockwise,
  ClassicBike,
  ClassicBus,
  ClassicCar,
  ClassicFerry,
  ClassicGondola,
  ClassicLegIcon,
  ClassicMicromobility,
  ClassicModeIcon,
  ClassicTram,
  ClassicWalk,
  DirectionIcon,
  Elevator,
  Email,
  Feedback,
  Ferry,
  getCompanyIcon,
  HardLeft,
  HardRight,
  Help,
  HelpSolid,
  IconRenderer,
  Info,
  Left,
  LegIcon,
  Map,
  MapMarker,
  MapMarkerSolid,
  Max,
  MaxCircle,
  Micromobility,
  Parking,
  Phone,
  Plane,
  Refresh,
  Right,
  Schedule,
  SlightLeft,
  SlightRight,
  Snow,
  StandardBike,
  StandardBus,
  StandardGondola,
  StandardLegIcon,
  StandardModeIcon,
  StandardRail,
  StandardStreetcar,
  StandardTram,
  StandardWalk,
  Star,
  StopStation,
  StopStationSolid,
  Straight,
  Streetcar,
  StreetcarCircle,
  Transittracker,
  TransittrackerSolid,
  TriMet,
  TriMetLegIcon,
  TriMetModeIcon,
  TriMetModeIcon2021,
  TripPlanner,
  TripPlannerSolid,
  UTurnLeft,
  UTurnRight,
  Walk,
  Wes,
  WesCircle,
  Zoom,
  ZoomAngle
};
