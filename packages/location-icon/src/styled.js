import styled from "styled-components";
import { Circle, DotCircle } from "styled-icons/fa-regular";
import { MapMarkerAlt } from "styled-icons/fa-solid";

const FromIcon = styled(DotCircle)`
  color: #333;
`;

const PlaceIcon = styled(Circle)`
  color: #333;
`;

const ToIcon = styled(MapMarkerAlt)`
  color: #f44256;
`;

export { FromIcon, PlaceIcon, ToIcon };
