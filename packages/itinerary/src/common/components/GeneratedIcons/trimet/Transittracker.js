import React from "react";

const SvgTransittracker = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M285.2 264.7l-105.5-60.9V47.1h30.6v139.1l90.1 52.1z" />
    <path d="M195 20c46.7 0 90.7 18.2 123.7 51.3 33.1 33.1 51.3 77 51.3 123.7s-18.2 90.7-51.3 123.7c-33.1 33.1-77 51.3-123.7 51.3s-90.7-18.2-123.7-51.3C38.2 285.6 20 241.7 20 195s18.2-90.7 51.3-123.7c33-33.1 77-51.3 123.7-51.3m0-20C87.3 0 0 87.3 0 195s87.3 195 195 195 195-87.3 195-195S302.7 0 195 0z" />
  </svg>
);

export default SvgTransittracker;
