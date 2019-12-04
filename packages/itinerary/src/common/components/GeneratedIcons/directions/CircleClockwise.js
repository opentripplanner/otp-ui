import React from "react";

const SvgCircleClockwise = ({ title, ...props }) => (
  <svg viewBox="0 0 261 261" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M30.5 120.5h60a40 40 0 0180 0c0 20.22-10.51 37.32-30 40 15 5 25 20 25 50 37.37-14.48 65-47.51 65-90a100 100 0 00-200 0z" />
    <path d="M.5 140.5h32a100.12 100.12 0 0068 75.41v44.59h60v-60c0-20-15-40-40-40-10.05 0-20.09-8-25.62-20h25.62l-60-60z" />
  </svg>
);

export default SvgCircleClockwise;
