import React from "react";

const SvgMapmarker = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M195 390l-10.1-12.5c-4.8-6-117.6-147-117.6-249.8C67.3 57.3 124.6 0 195 0s127.7 57.3 127.7 127.7c0 102.8-112.8 243.9-117.6 249.8L195 390zm0-364.1c-56.1 0-101.8 45.7-101.8 101.8 0 76.8 74.3 183.6 101.8 220.5 27.5-36.9 101.8-143.7 101.8-220.5 0-56.2-45.7-101.8-101.8-101.8z" />
    <circle cx={195} cy={129.3} r={53.5} />
  </svg>
);

export default SvgMapmarker;
