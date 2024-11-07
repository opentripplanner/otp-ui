import React from "react";

const SvgArrowLeft = ({ title, ...props }) => (
  <svg viewBox="0 0 24 24" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167L16.67 24 4.5 12.004z" />
  </svg>
);

export default SvgArrowLeft;
