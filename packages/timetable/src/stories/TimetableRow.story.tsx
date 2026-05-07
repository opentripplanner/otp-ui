// eslint-disable-next-line prettier/prettier
import type { Meta, StoryObj } from "@storybook/react-vite"

import TimeTableRow, { Stop, Trip } from ".."

const meta = {
    component: TimeTableRow,
    title: "Timetable Row"
} satisfies Meta<typeof TimeTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const standardStops: Stop[] = [
    {
        id: "stop1",
        sequence: 1,
        time: "11:00"
    },
    {
        id: "stop3",
        sequence: 3,
        time: "11:10"
    },
    {
        id: "stop2",
        sequence: 2,
        time: "11:05"
    }
]

const standardTrip: Trip = {
    id: "trip1",
    sequence: 1,
    stops: standardStops
}

const tripWithSkippedStop: Trip = {
    id: "trip2",
    sequence: 2,
    stops: [
        ...standardStops,
        {
            id: "skipped",
            sequence: 4
        }
    ]
}

export const Default: Story = {
    args: {
        trip: standardTrip
    }
}

export const WithSkippedStop: Story = {
    args: {
        trip: tripWithSkippedStop
    }
}