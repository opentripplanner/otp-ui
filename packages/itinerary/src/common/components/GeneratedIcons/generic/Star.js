import React from "react";

const SvgStar = ({ title, ...props }) => (
  <svg viewBox="0 0 50 50" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M25 1l6 17h18L35 29l5 17-15-10-15 10 5-17L1 18h18z" />
  </svg>
);

export default SvgStar;
