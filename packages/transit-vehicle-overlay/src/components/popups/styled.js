/** some shared styles used in the popups and tooltips */
import styled from "styled-components";

export const TooltipStyle = styled.span``;

TooltipStyle.Title = styled.span`
  font-size: 110%;
  font-weight: bold;
`;

export const PopupStyle = styled.div`
  display: inline-block;
  box-sizing: border-box;
  > * {
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
  }
`;

PopupStyle.Title = styled.div`
  font-size: 110%;
  font-weight: bold;
  text-align: center;
`;

PopupStyle.Span = styled.span`
  font-size: 90%;
  display: block;
`;

PopupStyle.Button = styled.button`
  cursor: pointer;
  width: 100%;
  height: 100%;
  svg,
  img {
    vertical-align: middle;
    max-width: 1.25em;
    margin: 0 0.25em;
    height: 1.25em;
  }
  &.active {
    font-weight: 600;
    box-shadow: 0 0 2px 2px rgba(0, 64, 255, 0.5);
  }
  &.disabled {
    cursor: default;
  }
  &.disabled svg {
    fill: #ccc;
  }
`;
