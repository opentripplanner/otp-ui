import { Meta, StoryObj } from "@storybook/react-vite";

import { Distance } from ".";

const meta = {
  component: Distance,
  render: Distance,
  title: "Distance"
} as Meta<typeof Distance>;

type Story = StoryObj<typeof meta>;

export default meta;

export const metersShort: Story = {
  args: { meters: 124.5 }
};

export const metersLong: Story = {
  args: { long: true, meters: 124.5 }
};

export const feetShort: Story = {
  args: { meters: 124.5, units: "imperial" }
};

export const feetLong: Story = {
  args: { long: true, meters: 124.5, units: "imperial" }
};

export const kilometersShort: Story = {
  args: { meters: 12450 }
};

export const kilometersLong: Story = {
  args: { long: true, meters: 12450 }
};

export const milesShort: Story = {
  args: { meters: 12450, units: "imperial" }
};

export const milesLong: Story = {
  args: { long: true, meters: 12450, units: "imperial" }
};

export const milesFraction: Story = {
  args: { meters: 1245, units: "imperial" }
};
