import React from "react";

const SvgMap = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M260.4 54.2L129.6 0 6.6 50.9v335.8l123-50.9L260.4 390l123-50.9V3.3l-123 50.9zM139.2 25l111.5 46.2v294L139.2 319V25zM25.9 63.9l94.1-39v294l-94.1 39v-294zm338.2 262.2l-94.1 39V71.2l94.1-39v293.9z" />
  </svg>
);

export default SvgMap;
