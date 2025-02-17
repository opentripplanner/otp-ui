import React from "react";

const Info = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M195 0C87.3 0 0 87.3 0 195s87.3 195 195 195 195-87.3 195-195S302.7 0 195 0zm18.7 49.1c5.9-6.4 13.1-9.7 21.5-9.7 6.7 0 12.3 2.3 16.7 6.8 4.4 4.4 6.6 10.1 6.6 16.9 0 8.8-3.1 16.6-9.2 23.2-6.2 6.8-13.4 10.2-21.4 10.2-6.6 0-12.1-2.3-16.5-6.9-4.3-4.6-6.5-10.5-6.5-17.5-.1-9 2.9-16.7 8.8-23zm41.7 247.7c-24.4 23-41.8 37.3-53.1 43.8-11.8 6.8-21.4 10.1-29.3 10.1-7.5 0-13.6-2.4-18.1-7.2-4.4-4.7-6.7-11.1-6.7-19.1 0-22.4 12.9-75 39.5-160.7 1-3.4 1.6-6.5 1.6-9-2.5.1-5.5 1.2-9.1 3.4-2.8 1.8-10.1 7.7-28.9 25.8l-3.1 3-19-14.6 3.6-4c17.6-19.3 34-33.2 48.7-41.4 15-8.4 28.1-12.7 39-12.7 6.6 0 11.9 1.5 15.8 4.5 4.1 3.2 6.3 7.8 6.3 13.2 0 3.6-1.8 14.3-17 65.5-18.1 60.9-27.3 98-27.3 110.1 0 1.3.3 2.4.8 3.1.1.2.2.3.3.4 2-.5 10.3-4.1 38.7-31l3.4-3.2 17.8 16.3-3.9 3.7z" />
  </svg>
);

export default Info;
