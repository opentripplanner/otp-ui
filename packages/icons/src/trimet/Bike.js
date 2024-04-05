import React from "react";

const Bike = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M84.7 188.3C38 188.5 0 226.3 0 273s37.9 84.5 84.7 84.7c46.6-.2 84.5-38.1 84.5-84.7s-38.1-84.5-84.5-84.7zm45 129.8c-11.5 11.7-27.4 19-45.1 19s-33.6-7.3-45.3-19c-11.5-11.5-18.8-27.4-18.8-45.1 0-17.6 7.3-33.6 18.8-45.1C51 216.2 67 209.1 84.6 209.1s33.6 7 45.1 18.8c11.7 11.5 18.8 27.4 18.8 45.1.1 17.7-7 33.6-18.8 45.1zM234.3 94.1c17 0 31-14 31-31s-14-30.8-31-30.8c-16.9 0-30.8 13.8-30.8 30.8 0 17.2 13.9 31 30.8 31z" />
    <path d="M291.5 168.9c18.5 0 18.5-24.4-.8-24.4h-49.3l-33.5-55.6c-7.3-10-28.2-11.2-36.7-1.1l-59.8 59.6c-13.4 14.5-5.4 36 9.9 40.9l55.4 34.6V279c0 12.6 9.5 19.1 18.2 19.1 8.6 0 18.3-6.4 18.3-19.6v-71.7c0-6.5-.9-14.1-6.4-16.3l-36.4-23 30.3-32 18.2 24.3c3.1 7.8 11.4 9.2 18 9.2l54.6-.1z" />
    <path d="M305.4 187c-46.7 0-84.7 37.9-84.7 84.6.2 46.7 37.9 84.7 84.7 84.7 46.6 0 84.6-38 84.6-84.7S352 187 305.4 187zm45.2 129.8c-11.5 11.6-27.4 18.8-45.1 18.8s-33.6-7.2-45.3-18.8c-11.5-11.6-18.8-27.7-18.8-45.2 0-17.7 7.3-33.6 18.8-45.1 11.7-11.7 27.7-18.8 45.3-18.8 17.7 0 33.6 7 45.1 18.8 11.7 11.7 18.8 27.4 18.8 45.1 0 17.5-7.1 33.5-18.8 45.2z" />
  </svg>
);

export default Bike;
