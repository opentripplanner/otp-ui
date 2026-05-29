// eslint-disable-next-line prettier/prettier
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Route, TimeTable } from ".."

import twinCitiesRouteMock from "../../__mocks__/route-mock.json"

const meta = {
    component: TimeTable,
    title: "Timetable"
} satisfies Meta<typeof TimeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        route: twinCitiesRouteMock.data.route as unknown as Route
    }
}

export const WithBlockIds: Story = {
    args: {
        route: twinCitiesRouteMock.data.route as unknown as Route,
        showBlockId: true
    }
}

export const WithDwellStopsAndBlockIds: Story = {
    args: {
        route: twinCitiesRouteMock.data.route as unknown as Route,
        showBlockId: true,
        includeDwellStops: true
    }
}