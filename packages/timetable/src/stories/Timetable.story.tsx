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
            control: "check",
            mapping: {
                "Grand St NE & 29th Ave NE (Direction: 1)": "2:14634",
                "46th St & I-35W (Direction: 0)": "2:53545"
            }
        },
        directionId: {
            control: "radio",
            options: [0, 1]
        },
        tripNotes: {
            control: "boolean",
        }
    }
} satisfies Meta<typeof TimeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const tripNotesMock = new Map<string, string[]>([
        ["38863", ["Example notice", "Trips run late on game days"]],
        ["37153", ["This is a trip notice", "Exit through front door", "Trip serves elementary school"]]
    ]
)

export const Default: Story = {
    // eslint-disable-next-line react/display-name
    render: (args) => {
        const { closedStops, tripNotes } = args;
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <TimeTable {...args} closedStops={new Set(closedStops)} tripNotes={tripNotes ? tripNotesMock : undefined} />
    },
    args: {
        directionId: 0,
        route: twinCitiesRouteMock.data.route,
        timepointsOnly: true,
        timeZone: "America/New_York"
    }
}