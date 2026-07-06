// eslint-disable-next-line prettier/prettier
import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react";

import TimeTable from ".."

import twinCitiesRouteMock from "../../__mocks__/route-mock.json"

const meta = {
    component: TimeTable,
    title: "Timetable",
    argTypes: {
        closedStops: {
            options: ["Grand St NE & 29th Ave NE (Direction: 1)", "46th St & I-35W (Direction: 0)"],
            control: { type: "check" },
            mapping: {
                "Grand St NE & 29th Ave NE (Direction: 1)": "2:14634",
                "46th St & I-35W (Direction: 0)": "2:53545"
            }
        },
        directionId: {
            control: { type: "radio" },
            options: [0, 1]
        }
    }
} satisfies Meta<typeof TimeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    // eslint-disable-next-line react/display-name
    render: (args) => {
        const { closedStops } = args;
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <TimeTable {...args} closedStops={new Set(closedStops)} />
    },
    args: {
        directionId: 0,
        route: twinCitiesRouteMock.data.route,
        timepointsOnly: true,
        timeZone: "America/New_York"
    }
}