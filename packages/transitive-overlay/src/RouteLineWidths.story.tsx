// eslint-disable-next-line prettier/prettier
import type { ExpressionSpecification } from "maplibre-gl";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Layer, Source } from "react-map-gl/maplibre";

import coreUtils from "@opentripplanner/core-utils";

import { withMap } from "../../../.storybook/base-map-wrapper";
import {
  OUTLINE_WIDTH_MULTIPLIER,
  ROUTE_LINE_WIDTH_BY_ZOOM,
  SELECTED_OUTLINE_WIDTH_MULTIPLIER
} from ".";

const { adjustColorForContrast } = coreUtils.colors;

// Centered on Portland to match other overlay stories
const CENTER: [number, number] = [45.519, -122.681];
const ZOOM = 14;

// Three sample horizontal lines at different latitudes
const BUS_BASE_WIDTH = 3;
const RAIL_BASE_WIDTH = 3;

type RouteLineWidthsArgs = {
  outlineWidthMultiplier: number;
  selectedOutlineWidthMultiplier: number;
};

/**
 * Demo component that renders three representative route lines side-by-side,
 * one for each case governed by the exported constants:
 *
 * 1. **Bus route** (routeType 3) – base line-width 6 px, outline = 6 × `outlineWidthMultiplier`
 * 2. **Rail route** (routeType 1) – base line-width 10 px, outline = 10 × `outlineWidthMultiplier`
 * 3. **Focused/selected route** – zoom-interpolated width from `ROUTE_LINE_WIDTH_BY_ZOOM`,
 *    outline = zoom-width × `selectedOutlineWidthMultiplier` (mirrors `FOCUSED_ROUTE_OUTLINE_WIDTH`)
 */
const RouteLineWidthsDemo = ({
  outlineWidthMultiplier,
  selectedOutlineWidthMultiplier
}: RouteLineWidthsArgs): JSX.Element => {
  const focusedOutlineWidth: ExpressionSpecification = [
    "interpolate",
    ["linear"],
    ["zoom"],
    ...Object.entries(ROUTE_LINE_WIDTH_BY_ZOOM).flatMap(([zoom, width]) => [
      Number(zoom),
      width * selectedOutlineWidthMultiplier
    ])
  ];

  const focusedLineWidth: ExpressionSpecification = [
    "interpolate",
    ["linear"],
    ["zoom"],
    ...Object.entries(ROUTE_LINE_WIDTH_BY_ZOOM).flatMap(([zoom, width]) => [Number(zoom), width])
  ];

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          kind: "bus",
          color: "#FF7777",
          contrastColor: adjustColorForContrast("#FF7777") ?? "#FF7777"
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [-122.705, 45.524],
            [-122.657, 45.524]
          ]
        }
      },
      {
        type: "Feature",
        properties: {
          kind: "rail",
          color: "#5588FF",
          contrastColor: adjustColorForContrast("#5588FF") ?? "#5588FF"
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [-122.705, 45.519],
            [-122.657, 45.519]
          ]
        }
      },
      {
        type: "Feature",
        properties: {
          kind: "focused",
          color: "#55BB55",
          contrastColor: adjustColorForContrast("#55BB55") ?? "#55BB55"
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [-122.705, 45.514],
            [-122.657, 45.514]
          ]
        }
      }
    ]
  };

  return (
    <Source data={geojson} id="route-line-widths-demo" type="geojson">
      {/* Contrast outlines rendered first so they appear beneath the route lines */}
      <Layer
        filter={["==", ["get", "kind"], "bus"]}
        id="demo-bus-outline"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": ["get", "contrastColor"],
          "line-opacity": 1,
          "line-width": BUS_BASE_WIDTH * outlineWidthMultiplier
        }}
        type="line"
      />
      <Layer
        filter={["==", ["get", "kind"], "rail"]}
        id="demo-rail-outline"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": ["get", "contrastColor"],
          "line-opacity": 1,
          "line-width": RAIL_BASE_WIDTH * outlineWidthMultiplier
        }}
        type="line"
      />
      <Layer
        filter={["==", ["get", "kind"], "focused"]}
        id="demo-focused-outline"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": ["get", "contrastColor"],
          "line-opacity": 1,
          "line-width": focusedOutlineWidth
        }}
        type="line"
      />
      {/* Colored route lines on top of outlines */}
      <Layer
        filter={["==", ["get", "kind"], "bus"]}
        id="demo-bus-line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": ["get", "color"],
          "line-opacity": 1,
          "line-width": BUS_BASE_WIDTH
        }}
        type="line"
      />
      <Layer
        filter={["==", ["get", "kind"], "rail"]}
        id="demo-rail-line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": ["get", "color"],
          "line-opacity": 1,
          "line-width": RAIL_BASE_WIDTH
        }}
        type="line"
      />
      <Layer
        filter={["==", ["get", "kind"], "focused"]}
        id="demo-focused-line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": ["get", "color"],
          "line-opacity": 1,
          "line-width": focusedLineWidth
        }}
        type="line"
      />
    </Source>
  );
};

export default {
  title: "TransitiveOverlay/RouteLineWidths",
  component: RouteLineWidthsDemo,
  decorators: [withMap(CENTER, ZOOM)],
  parameters: {
    storyshots: { disable: true },
    docs: {
      description: {
        component: `
Demonstrates the exported line-width constants used by \`TransitiveCanvasOverlay\`:

| Constant | Default | Purpose |
|---|---|---|
| \`ROUTE_LINE_WIDTH_BY_ZOOM\` | \`{8:1, 10:2, 15:4, 19:10}\` | Base zoom → px breakpoints for route lines |
| \`OUTLINE_WIDTH_MULTIPLIER\` | \`${OUTLINE_WIDTH_MULTIPLIER}\` | Contrast outline width relative to the base route width |
| \`SELECTED_OUTLINE_WIDTH_MULTIPLIER\` | \`${SELECTED_OUTLINE_WIDTH_MULTIPLIER}\` | Focused/selected route contrast outline relative to the zoom-interpolated route width |

The three lines rendered here correspond to:
1. **Red** — bus route (routeType 3, base width 6 px)
2. **Blue** — rail route (routeType 1, base width 10 px)
3. **Green** — focused/selected route (zoom-interpolated via \`ROUTE_LINE_WIDTH_BY_ZOOM\`, contrast outline computed via \`adjustColorForContrast\`)

Use the controls panel to adjust each multiplier and observe the contrast outline thickness change.
        `
      }
    }
  },
  argTypes: {
    outlineWidthMultiplier: {
      control: { type: "range", min: 1, max: 4, step: 0.1 },
      description:
        "Multiplier for the contrast outline width relative to the base route line width (`OUTLINE_WIDTH_MULTIPLIER`)"
    },
    selectedOutlineWidthMultiplier: {
      control: { type: "range", min: 1, max: 4, step: 0.1 },
      description:
        "Multiplier for the focused/selected route contrast outline relative to the zoom-interpolated route width (`SELECTED_OUTLINE_WIDTH_MULTIPLIER`)"
    }
  },
  args: {
    outlineWidthMultiplier: OUTLINE_WIDTH_MULTIPLIER,
    selectedOutlineWidthMultiplier: SELECTED_OUTLINE_WIDTH_MULTIPLIER
  }
} as Meta<typeof RouteLineWidthsDemo>;

type Story = StoryObj<typeof RouteLineWidthsDemo>;

/** Shows the default multiplier values as used in production. */
export const DefaultMultipliers: Story = {};

/** Exaggerated outline widths to make the contrast effect clearly visible. */
export const WideOutlines: Story = {
  args: {
    outlineWidthMultiplier: 3,
    selectedOutlineWidthMultiplier: 2.5
  }
};

/** Minimal outline — outline width is close to the route line itself. */
export const NarrowOutlines: Story = {
  args: {
    outlineWidthMultiplier: 1.1,
    selectedOutlineWidthMultiplier: 1.05
  }
};
