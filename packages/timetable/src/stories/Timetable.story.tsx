// eslint-disable-next-line prettier/prettier
import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react";

import TimeTable, { AdditionalColumn } from ".."

import twinCitiesRouteMock from "../../__mocks__/route-mock.json"

let oldSet = new Set();
const additionalColumnsCheckTime = new Map<string, Date>()

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
        additionalColumns: {
            control: "check",
            options: ["Block ID", "Notices", "Trip Headsign", "Trip ID", "Trip Short Name"],
            mapping: {
                "Block ID": "BLOCK_ID",
                "Notices": "NOTICES",
                "Trip Headsign": "TRIP_HEADSIGN",
                "Trip ID": "TRIP_ID",
                "Trip Short Name": "TRIP_SHORT_NAME"
            }
        }
    }
} satisfies Meta<typeof TimeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    // eslint-disable-next-line react/display-name
    render: (args) => {
        const { closedStops, additionalColumns } = args;
        const newSet = new Set(additionalColumns)
        if (newSet.size > oldSet.size) {
            newSet.forEach(i => {
                if (!oldSet.has(i)) {
                    additionalColumnsCheckTime.set(i, new Date())
                }
            })
        } else if (newSet.size < oldSet.size) {
            oldSet.forEach(i => {
                if (!newSet.has(i)) {
                    additionalColumnsCheckTime.delete(i)
                }
            })
        }
        oldSet = newSet;
        const sorted = Array.from(additionalColumnsCheckTime.entries()).sort((a, b) => a[1] - b[1]).map(e => e[0])
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <TimeTable {...args} closedStops={new Set(closedStops)} additionalColumns={sorted as unknown as AdditionalColumn[]} />
    },
    args: {
        directionId: 0,
        route: twinCitiesRouteMock.data.route,
        timepointsOnly: true,
        timeZone: "America/New_York"
    }
}