import React from "react";

const SvgUTurnRight = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M112.5 120.5l70 100 70-100h-40v-20c0-75.5-23.57-97.75-95.36-97.5S22.5 26.38 22.5 100.5v160h60v-160c0-35.54 3.21-39.69 34.64-40s35.36 5.19 35.36 40v20h-40z" />
  </svg>
);

export default SvgUTurnRight;
