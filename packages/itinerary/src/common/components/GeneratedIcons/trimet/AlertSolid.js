import React from "react";

const SvgAlertsolid = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M194.9 0L0 390h390L194.9 0zm-15.3 143.9h30.7v133.7h-30.7V143.9zm15.3 191.9c-10.1 0-18.3-8.2-18.3-18.3 0-10.1 8.2-18.3 18.3-18.3s18.3 8.2 18.3 18.3c.1 10.1-8.1 18.3-18.3 18.3z" />
  </svg>
);

export default SvgAlertsolid;
