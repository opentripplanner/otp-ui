// eslint-disable-next-line prettier/prettier
import type { Meta, StoryObj } from "@storybook/react-vite"

import { PatternStop, TimeTable, Trip } from ".."

const meta = {
    component: TimeTable,
    title: "Timetable"
} satisfies Meta<typeof TimeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const createTime = (hours: number, minutes: number, seconds: number) => new Date(1970, 0, 1, hours, minutes, seconds)
const minutesInMs = (minutes: number) => minutes * 60 * 1000

const createStopsForTrip = (start: Date): Map<string, Date> => new Map([
    [ "1", new Date(start.getTime() + minutesInMs(0)) ],
    [ "2", new Date(start.getTime() + minutesInMs(5)) ],
    [ "3", new Date(start.getTime() + minutesInMs(9)) ],
])

const patternStops: PatternStop[] = [
    {
        id: "1",
        name: "A St.",
        sequence: 1,
        timepoint: true
    },
    {
        id: "3",
        name: "C St.",
        sequence: 3,
        timepoint: true
    },
    {
        id: "2",
        name: "B St.",
        sequence: 2,
        timepoint: false
    },
    {
        id: "4",
        name: "D St.",
        sequence: 4,
        timepoint: false
    },
    {
        id: "5",
        name: "E St.",
        sequence: 5,
        timepoint: true
    }
]

const trips: Trip[] = [
    {
        id: "1",
        blockId: "123",
        sequence: 1,
        stops: createStopsForTrip(createTime(8, 0, 0))
    },
    {
        id: "3",
        blockId: "789",
        sequence: 3,
        stops: createStopsForTrip(createTime(10, 0, 0))
    },
    {
        id: "2",
        blockId: "456",
        sequence: 2,
        stops: createStopsForTrip(createTime(9, 0, 0))
    }
]

export const Default: Story = {
    args: {
        patternStops,
        trips
    }
}

export const SkipStops: Story = {
    name: "With Trips That Skip Stops",
    args: {
        patternStops,
        trips
    }
}