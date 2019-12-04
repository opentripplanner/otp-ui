import React from "react";

const SvgAlert = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M195.1 44.9L357.6 370H32.5L195.1 44.9m0-44.9L0 390h390L195.1 0z" />
    <circle cx={195.1} cy={317.4} r={18.4} />
    <path d="M179.7 143.8h30.6v133.7h-30.6z" />
  </svg>
);

export default SvgAlert;
