import React from "react";

const SvgCircleCounterclockwise = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M130.5 20.5a100 100 0 00-100 100c0 42.49 27.63 75.52 65 90 0-30 10-45 25-50-19.49-2.68-30-19.78-30-40a40 40 0 0180 0h60a100 100 0 00-100-100z" />
    <path d="M200.5 80.5l-60 60h25.63c-5.54 12-15.57 20-25.62 20-25 0-40 20-40 40v60h60v-44.59a100.12 100.12 0 0068-75.41h32z" />
  </svg>
);

export default SvgCircleCounterclockwise;
