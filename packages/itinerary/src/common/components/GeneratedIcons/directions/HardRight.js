import React from "react";

const SvgHardRight = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M218.5 70.5l20 120-120-20 30-30-50-50c-10-10-10 0-10 10v160h-60v-160c0-70 70-90 110-50l50 50z" />
  </svg>
);

export default SvgHardRight;
