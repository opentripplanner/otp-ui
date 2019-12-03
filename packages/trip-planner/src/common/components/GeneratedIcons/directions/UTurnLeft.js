import React from "react";

const SvgUTurnLeft = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M108.5 120.5v-20c0-34.81 3.93-40.31 35.36-40s34.64 4.46 34.64 40v160h60v-160c0-74.12-22.85-97.25-94.64-97.5S48.5 25 48.5 100.5v20h-40l70 100 70-100h-40z" />
  </svg>
);

export default SvgUTurnLeft;
