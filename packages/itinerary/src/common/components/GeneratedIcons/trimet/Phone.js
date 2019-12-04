import React from "react";

const SvgPhone = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M114.8 195.5c0 110.9 43.9 194.5 102 194.5v-94.4c-15.1 0-41.3-21.6-41.3-100.2 0-78.5 26.2-102.7 41.3-102.7V1c-58 0-102 83.6-102 194.5M232.6 92.5h20c12.4 0 22.5-7.3 22.5-16.3V16.3c0-9-10.1-16.3-22.5-16.3h-20v92.5zM232.6 389.3h20c12.4 0 22.5-7.3 22.5-16.3v-59.9c0-9-10.1-16.3-22.5-16.3h-20v92.5z" />
  </svg>
);

export default SvgPhone;
