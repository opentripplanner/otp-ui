import React from "react";
import PropTypes from "prop-types";

import StyledRouteBadge from "./styled";
import * as Accessibility from "./styled-accessibility";

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
  color: "#084c8d"
};

export default RouteBadge;
