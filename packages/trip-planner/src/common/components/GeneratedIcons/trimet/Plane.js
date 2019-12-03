import React from "react";

const SvgPlane = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M355.3 366.5L232.8 228.4l-47.5 82.3 18.3 47.1L185 390l-44.8-48.2-63.7-14.5L95 295.2l49.9-7.8 47.4-82.2L11.5 168l23.4-40.6 204.1-5 64.1-110.8c15.2-26.6 55.9-2.8 40.4 24L279.7 146l98.8 179.8-23.2 40.7z" />
  </svg>
);

export default SvgPlane;
