import React, { ReactElement } from "react";

import { AccessLegFooterProps } from "../types";

export default function DemoAccessLegFooter({
  leg
}: AccessLegFooterProps): ReactElement {
  return (
    <div style={{ padding: "8px 0", fontSize: "0.95em" }}>
      Next stop: {leg.to?.name}
    </div>
  );
}
