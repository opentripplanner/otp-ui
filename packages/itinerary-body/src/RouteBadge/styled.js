import styled from "styled-components";

import { toSafeRouteColor } from "../util";

export default styled.div`
  text-align: center;
  min-width: 30px;
  min-height: 30px;
  font-size: 1.2em;
  background-color: ${props =>
    toSafeRouteColor(props.routeColor) || props.theme.mainColor};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1px;
  /* Add in border for dark mode */
  border: 1px solid ${props => props.theme.badgeBorderColor};
  user-select: none;
  cursor: default;
`;
