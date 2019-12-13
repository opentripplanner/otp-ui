import React from "react";

const SvgHardLeft = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M72.5 100.5l50-50c40-40 110-20 110 50v160h-60v-160c0-10 0-20-10-10l-50 50 30 30-120 20 20-120z" />
  </svg>
);

export default SvgHardLeft;
