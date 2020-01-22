import React from "react";
import PropTypes from "prop-types";

import * as Styled from "../styled";

const RouteBadge = ({ color, abbreviation, name }) => {
  return (
    <Styled.RouteBadge routeColor={color}>
      <Styled.SRHidden>{abbreviation}</Styled.SRHidden>
      <Styled.SROnly>{name}</Styled.SROnly>
    </Styled.RouteBadge>
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
