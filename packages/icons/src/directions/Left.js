import React from "react";

const SvgLeft = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M114.5 100.5h60v160h60v-170c0-30-20-50-50-50h-70V.5l-100 69.14 100 70.86v-40z" />
  </svg>
);

export default SvgLeft;
