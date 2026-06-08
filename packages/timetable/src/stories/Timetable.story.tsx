// eslint-disable-next-line prettier/prettier
import type { Meta, StoryObj } from "@storybook/react-vite"

import TimeTable from ".."

import twinCitiesRouteMock from "../../__mocks__/route-mock.json"

const meta = {
    component: TimeTable,
    title: "Timetable"
} satisfies Meta<typeof TimeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        directionId: 0,
        route: twinCitiesRouteMock.data.route
    }
}