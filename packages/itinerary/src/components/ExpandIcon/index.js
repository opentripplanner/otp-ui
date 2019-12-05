/* Since this is a thin wrapper around a set of icons, 
we want to allow prop spreading */
/* eslint-disable react/jsx-props-no-spreading */

import React from "react";
import PropTypes from "prop-types";
import ArrowLeft from "../../common/components/GeneratedIcons/generic/ArrowLeft";
import ArrowDown from "../../common/components/GeneratedIcons/generic/ArrowDown";

const ExpandIcon = props => {
  const { expanded } = props;
  return {
    collapsed: <ArrowDown {...props} />,
    expanded: <ArrowLeft {...props} />
  }[expanded === "true" ? "expanded" : "collapsed"];
};

ExpandIcon.propTypes = {
  expanded: PropTypes.string.isRequired
};

export default ExpandIcon;
