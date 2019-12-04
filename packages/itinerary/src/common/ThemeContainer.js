import React from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.primaryFontColor};
  }
`;

const ThemeContainer = ({ children }) => {
  const theme = useSelector(s => s.user.theme);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

ThemeContainer.propTypes = {
  children: PropTypes.node
};

ThemeContainer.defaultProps = {
  children: null
};

export default ThemeContainer;
