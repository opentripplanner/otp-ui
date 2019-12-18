import React from "react";

const SvgMapmarkersolid = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M195 0C124.6 0 67.3 57.3 67.3 127.7c0 102.8 112.8 243.9 117.6 249.8L195 390l10.1-12.5c4.8-6 117.6-147 117.6-249.8C322.7 57.3 265.4 0 195 0zm0 182.8c-29.5 0-53.5-24-53.5-53.5s24-53.5 53.5-53.5 53.5 24 53.5 53.5-24 53.5-53.5 53.5z" />
  </svg>
);

export default SvgMapmarkersolid;
