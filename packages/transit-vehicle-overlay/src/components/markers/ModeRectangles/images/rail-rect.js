import * as React from "react";

export default function RailRect(props) {
  return (
    <svg viewBox="0 0 200 300" {...props}>
      <style>{".rail_blue{fill:#28639c} .rail_white{fill:#fff}"}</style>
      <path className="rail_blue" fill="#28639c" d="M67.5 25h65v250h-65z" />
    </svg>
  );
}
