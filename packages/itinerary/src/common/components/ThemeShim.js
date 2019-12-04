import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Div = styled.div`
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.primaryFontColor};
  padding: 15px;

  button {
    color: ${props => props.theme.primaryFontColor};
  }
`;

const ThemeShim = ({ children }) => <Div>{children}</Div>;

ThemeShim.propTypes = {
  /** Child elements to wrap with the provided theme. */
  children: PropTypes.node
};

ThemeShim.defaultProps = {
  children: null
};

export default ThemeShim;
