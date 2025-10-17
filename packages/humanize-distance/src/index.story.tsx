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
  args: { imperial: true, meters: 124.5 }
};

export const feetLong: Story = {
  args: { imperial: true, long: true, meters: 124.5 }
};

export const kilometersShort: Story = {
  args: { meters: 12450 }
};

export const kilometersLong: Story = {
  args: { long: true, meters: 12450 }
};

export const milesShort: Story = {
  args: { imperial: true, meters: 12450 }
};

export const milesLong: Story = {
  args: { imperial: true, long: true, meters: 12450 }
};

export const milesFraction: Story = {
  args: { imperial: true, meters: 1245 }
};
