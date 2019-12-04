import React from "react";

const SvgSlightRight = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M204.5 120.5l20-120-120 20 30 30-40 40c-20 20-40 40-40 80v90h60v-90c0-20 10-30 20-40l40-40z" />
  </svg>
);

export default SvgSlightRight;
