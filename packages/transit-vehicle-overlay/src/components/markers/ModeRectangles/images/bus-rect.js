import * as React from "react";

export default function BusRect(props) {
  return (
    <svg viewBox="0 0 200 300" {...props}>
      <style>{".bus_blue{fill:#28639c} .bus_white{fill:#fff}"}</style>
      <path className="bus_blue" d="M67.5 62.5h65v175h-65z" />
    </svg>
  );
}
