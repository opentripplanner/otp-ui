import React from "react";

const SvgArrowDown = ({ title, ...props }) => (
  <svg viewBox="0 0 24 24" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M0 7.33L2.829 4.5l9.175 9.339L21.171 4.5 24 7.33 12.004 19.5z" />
  </svg>
);

export default SvgArrowDown;
