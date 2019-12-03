import React from "react";
import styled from "styled-components";

// Main style decorator for use with storybook

const MainStyle = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
  font-family: "Hind", Helvetica, Arial, sans-serif;

  button {
    font-family: inherit !important;
  }
`;

const MainStyleDecorator = storyFn => (
  <MainStyle>
    {storyFn()}
    <style>
      {" "}
      {
        '@import "https://fonts.googleapis.com/css?family=Hind:300,400,500,600,700"'
      }
    </style>
  </MainStyle>
);
export default MainStyleDecorator;
