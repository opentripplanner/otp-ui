// eslint-disable-next-line prettier/prettier
import type { Meta, StoryObj } from "@storybook/react-vite"

import { TimeTableRow } from ".."

const meta = {
    component: TimeTableRow,
    title: "Timetable Row"
} satisfies Meta<typeof TimeTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const times: string[] = [
    "11:00", "11:05", "11:10"
];

const timesWithSkippedStops: string[] = [
    "11:00", "-", "11:10"
];

export const Default: Story = {
    args: {
        values: times
    }
}

export const WithSkippedStop: Story = {
    args: {
        values: timesWithSkippedStops
    }
}