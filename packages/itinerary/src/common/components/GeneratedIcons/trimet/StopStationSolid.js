import React from "react";

const SvgStopstationsolid = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M195 0C87.3 0 0 87.3 0 195s87.3 195 195 195h1.9V66.3l-4.5-22.4h29.3l-4.5 22.4v322.5C314.5 377.7 390 295.2 390 195 390 87.3 302.7 0 195 0zm-6.5 291.8c-7.9 2.2-16.2 3.4-24.8 3.4-51.3 0-92.9-41.6-92.9-92.9s41.6-92.9 92.9-92.9c8.6 0 16.9 1.2 24.8 3.4v179zm37.1-62.8V66.9C265.9 72 297 106.3 297 148c0 41.6-31.2 75.9-71.4 81z" />
  </svg>
);

export default SvgStopstationsolid;
