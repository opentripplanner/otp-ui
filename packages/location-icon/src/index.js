import React from "react";
import PropTypes from "prop-types";

import * as Styled from "./styled";

const LocationIcon = ({ type }) => {
  switch (type) {
    case "from":
      return <Styled.FromIcon />;
    case "to":
      return <Styled.ToIcon />;
    default:
      throw new Error("invalid type");
  }
};

LocationIcon.propTypes = {
  /**
   * Either `from` or `to`
   */
  type: PropTypes.string.isRequired
};

export default LocationIcon;
