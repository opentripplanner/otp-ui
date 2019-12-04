import React from "react";

const SvgApp = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M284.5 0h-179C87 0 71.8 15.2 71.8 33.8v322.5c0 18.5 15.2 33.8 33.8 33.8h178.9c18.5 0 33.8-15.2 33.8-33.8V33.8C316.6 15.2 303 0 284.5 0zm11.8 354.6c0 6.7-5.1 11.8-11.8 11.8h-179c-6.7 0-11.8-5.1-11.8-11.8V33.8c0-6.7 5.1-11.8 11.8-11.8h178.9c6.7 0 11.8 5.1 11.8 11.8v320.8z" />
    <circle cx={195} cy={335.9} r={22} />
    <path d="M117.3 45.6H271v260.1H117.3z" />
  </svg>
);

export default SvgApp;
