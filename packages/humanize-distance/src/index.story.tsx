import React, { ReactElement } from "react";

import { Distance } from ".";

export default {
  component: Distance,
  title: "Distance"
};

export const metersShort = (): ReactElement => <Distance meters={124.5} />;

export const metersLong = (): ReactElement => <Distance long meters={124.5} />;

export const feetShort = (): ReactElement => (
  <Distance imperial meters={124.5} />
);

export const feetLong = (): ReactElement => (
  <Distance imperial long meters={124.5} />
);

export const kilometersShort = (): ReactElement => <Distance meters={12450} />;

export const kilometersLong = (): ReactElement => (
  <Distance long meters={12450} />
);

export const milesShort = (): ReactElement => (
  <Distance imperial meters={12450} />
);

export const milesLong = (): ReactElement => (
  <Distance imperial long meters={12450} />
);

export const milesFractionShort = (): ReactElement => (
  <Distance imperial meters={1245} />
);

export const milesFractionLong = (): ReactElement => (
  <Distance imperial long meters={1245} />
);
