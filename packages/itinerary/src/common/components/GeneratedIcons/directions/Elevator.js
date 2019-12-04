import React from "react";

const SvgElevator = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M116.93.5v43.28H80.41A36.79 36.79 0 0043.69 80.5v140a36.77 36.77 0 0036.72 36.69h100a36.74 36.74 0 0036.69-36.69v-140a36.77 36.77 0 00-36.69-36.72h-35.62V.5h-27.86zM84.41 61.19h92a23.1 23.1 0 0123.28 23.31v132a23.08 23.08 0 01-23.28 23.28h-92A23.1 23.1 0 0161.1 216.5v-132a23.13 23.13 0 0123.31-23.31zm1 24.31v75h-20l35.06 60 34.94-60h-20v-75h-30zm75.06-5l-35.06 60h20v75h30v-75h20z" />
  </svg>
);

export default SvgElevator;
