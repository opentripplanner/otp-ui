import React from "react";

const SvgStraight = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M100.5 110.5v150h60v-150h40l-70-110-70 110h40z" />
  </svg>
);

export default SvgStraight;
