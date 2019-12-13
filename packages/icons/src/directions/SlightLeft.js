import React from "react";

const SvgSlightLeft = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M86.5 90.5l40 40c10 10 20 20 20 40v90h60v-90c0-40-20-60-40-80l-40-40 30-30-120-20 20 120z" />
  </svg>
);

export default SvgSlightLeft;
