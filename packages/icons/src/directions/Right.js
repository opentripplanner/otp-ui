import React from "react";

const SvgRight = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M146.5 140.5l100-70.86L146.5.5v40h-70c-30 0-50 20-50 50v170h60v-160h60v40z" />
  </svg>
);

export default SvgRight;
