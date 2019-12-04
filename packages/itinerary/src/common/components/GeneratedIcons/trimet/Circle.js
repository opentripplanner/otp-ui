import React from "react";

const SvgCircle = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M195 0C87.3 0 0 87.3 0 195s87.3 195 195 195 195-87.3 195-195S302.7 0 195 0z" />
  </svg>
);

export default SvgCircle;
