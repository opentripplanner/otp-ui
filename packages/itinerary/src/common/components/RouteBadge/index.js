import React from "react";
import PropTypes from "prop-types";
import StyledRouteBadge from "./styled";
import * as Accessibility from "../Accessibility";
import { DEFAULT_ROUTE_COLOR } from "../../constants";

const RouteBadge = ({ color, abbreviation, name }) => {
  return (
    <StyledRouteBadge routeColor={color}>
      <Accessibility.SRHidden>{abbreviation}</Accessibility.SRHidden>
      <Accessibility.SROnly>{name}</Accessibility.SROnly>
    </StyledRouteBadge>
  );
};

RouteBadge.propTypes = {
  color: PropTypes.string,
  abbreviation: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

RouteBadge.defaultProps = {
  color: DEFAULT_ROUTE_COLOR
};

export default RouteBadge;
