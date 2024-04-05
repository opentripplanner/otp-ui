import React from "react";

const StreetcarCircle = ({ title, ...props }) => (
  <svg viewBox="0 0 390 390" {...props}>
    {title ? <title>{title}</title> : null}
    <path d="M151.7 126.6h82.8c6.9 0 12.6-5.7 12.6-12.6v-4.3c0-7-5.6-12.7-12.6-12.7h-82.8c-6.9 0-12.6 5.6-12.6 12.7v4.3c0 6.9 5.7 12.6 12.6 12.6zM214.8 75.8c3.8-9.6 10.4-26.1 11.9-29.7-8.6-.2-27-.4-32.9-.4-6 0-24.3.3-32.8.4 1.4 3.7 8 20.1 11.9 29.7h41.9zM145.9 271.2c-9.1 0-16.5 7.4-16.5 16.4s7.4 16.5 16.5 16.5 16.4-7.4 16.4-16.5-7.3-16.4-16.4-16.4zM268.5 244.9l-5.6-94.9c-.5-6.8-6.5-12.6-13.4-12.6l-111.3-.1c-6.9 0-13.3 5.9-13.7 12.8l-5.4 94.7c-.4 6.9 4.7 12.7 11.7 12.7h126c6.8.2 12.2-5.6 11.7-12.6zM240.2 271.2c-9 0-16.3 7.4-16.3 16.4s7.4 16.5 16.3 16.5c9.1 0 16.5-7.4 16.5-16.5s-7.4-16.4-16.5-16.4z" />
    <path d="M226.7 45.9c-8.6-.2-27-.4-32.9-.4-6 0-24.3.3-32.8.4 1.4 3.7 8 20.1 11.9 29.7h42c3.6-9.5 10.3-25.9 11.8-29.7zM124.4 150.3L119 245c-.4 6.9 4.7 12.7 11.7 12.7h126c6.9 0 12.3-5.8 11.8-12.7l-5.6-94.9c-.5-6.8-6.5-12.6-13.4-12.6H138.2c-6.9.1-13.4 5.8-13.8 12.8zM223.9 324l-60.7-.1-35.6 54c21 7.7 43.7 12 67.4 12 22.8 0 44.6-3.9 65-11.1L223.9 324zM139.1 109.7v4.3c0 6.9 5.7 12.6 12.6 12.6h82.8c6.9 0 12.6-5.7 12.6-12.6v-4.3c0-7-5.6-12.7-12.6-12.7h-82.8c-6.9.1-12.6 5.7-12.6 12.7z" />
    <path d="M195 .1C87.3.1 0 87.4 0 195.1 0 270.2 42.5 335.5 104.8 368l29.5-44.6c-7.7-1.9-15.7-7.2-18.8-13.9l-9.2-18.4c-3.8-8.2-7.1-22-6.4-31L109.3 99c0-11.3 12.1-23.3 25.9-23.3h24.6c-4-10.1-11-27.5-11.7-29.4-10.4.7-12.6 2.1-12.9 2.4l-.7 1.8.5-1.2c-.3 2.7-2.4 4.7-5.2 4.7s-5.9-3.2-5.9-6c0-8.4 13.1-11 24.5-12.2 8.6-1 23.7-2.2 45.3-2.2 21.6 0 36.7 1.2 45.3 2.2 11.4 1.3 24.4 3.9 24.4 12.2 0 2.8-3.1 6-6 6-2.6 0-4.8-2-5.1-4.7l.6 1.2s-.6-1.7-.6-1.8c-.4-.4-2.5-1.7-13-2.4-.7 1.9-7.7 19.3-11.7 29.4h23.2c14.5 0 25.2 11.3 25.8 23.3l10.1 160.9c.5 9.1-2.4 23.1-6.5 31.2l-9.3 18.4c-3.2 6.4-10.7 11.9-18.2 13.9L283 369c63.5-32.2 107-98 107-174C390 87.4 302.7.1 195 .1z" />
    <path d="M223.9 287.5c0 9 7.4 16.5 16.3 16.5 9.1 0 16.5-7.4 16.5-16.5 0-9-7.3-16.4-16.5-16.4-9 .1-16.3 7.4-16.3 16.4zM145.9 304c9.1 0 16.4-7.4 16.4-16.5 0-9-7.4-16.4-16.4-16.4-9.1 0-16.5 7.4-16.5 16.4.1 9 7.5 16.5 16.5 16.5z" />
  </svg>
);

export default StreetcarCircle;
