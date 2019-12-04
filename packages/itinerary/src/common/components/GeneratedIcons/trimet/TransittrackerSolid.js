import React from "react";

const SvgTransittrackersolid = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M195 0C87.3 0 0 87.3 0 195s87.3 195 195 195 195-87.3 195-195S302.7 0 195 0zm90.2 264.7l-105.4-60.9V47.1h30.5v139.1l90.2 52.1-15.3 26.4z" />
  </svg>
);

export default SvgTransittrackersolid;
