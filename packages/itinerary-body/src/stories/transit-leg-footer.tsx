import React, { ReactElement } from "react";

import { TransitLegFooterProps } from "../types";

export default function DemoTransitLegFooter({
  leg
}: TransitLegFooterProps): ReactElement {
  return (
    <div style={{ padding: "8px 0", fontSize: "0.95em" }}>
      Leave at {leg.to?.name}
    </div>
  );
}
