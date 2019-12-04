/* eslint-disable import/prefer-default-export */
import styled from "styled-components";

export const ClearButton = styled.button`
  background: transparent;
  color: inherit;
  border: 0;
  text-align: inherit;
  text-decoration: none;

  &:focus {
    /* What's our hover color for the     se? */
    background-color: ${props => props.theme.tertiaryColor};
    outline: 0;
  }

  &:hover {
    background-color: ${props => props.theme.hoverColor};
  }

  &:active {
    background-color: ${props => props.theme.activeColor};
  }
`;
