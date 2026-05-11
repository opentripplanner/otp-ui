// eslint-disable-next-line prettier/prettier
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Stop, TimeTable, Trip } from ".."

const meta = {
    component: TimeTable,
    title: "Timetable"
} satisfies Meta<typeof TimeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const stopsForPattern: Stop[] = [
    {
        id: "stop1",
        name: "Stop 1",
        sequence: 1,
        timepoint: true
    },
    {
        id: "stop3",
        name: "Stop 3",
        sequence: 3,
        timepoint: true
    },
    {
        id: "stop2",
        name: "Stop 2",
        sequence: 2,
    }
]

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

const skipAStop: Stop[] = [
    {
        id: "stop1",
        sequence: 1,
        time: "12:00"
    },
    {
        sequence: 2
    },
    {
        id: "stop3",
        sequence: 3,
        time: "12:10"
    }
]

const standardTrip: Trip = {
    id: "trip1",
    sequence: 1,
    stops: standardStops
}

const tripWithSkippedStops: Trip = {
    id: "trip2",
    sequence: 2,
    stops: skipAStop
}

export const Default: Story = {
    args: {
        stops: stopsForPattern,
        trips: [standardTrip]
    }
}

export const SkipStops: Story = {
    name: "With Trips That Skip Stops",
    args: {
        stops: stopsForPattern,
        trips: [standardTrip, tripWithSkippedStops]
    }
}