import React, { useState } from "react";
import styled from "styled-components";
import {
  alphabeticShortNameComparator,
  getMostReadableTextColor,
  getOTP1RouteSortOrderValue,
  makeMultiCriteriaSort,
  makeNumericValueComparator,
  makeStringValueComparator,
  makeTransitOperatorComparator,
  routeTypeComparator
} from "./route";
import { routes } from "./fake-route-data.json";
import { fakeTransitOperators } from "./fake-transit-operators.json";

export default {
  title: "core-utils"
};

const ColorBlock = styled.div<{ bg: string; fg: string }>`
  background: ${props => props.bg};
  color: ${props => props.fg};
  padding: 10px;
`;

const ColorBlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ColorPair = ({ fg, bg }: { fg: string; bg: string }) => {
  return (
    <ColorBlockWrapper>
      <ColorBlock fg={fg} bg={bg}>
        Provided color pair
      </ColorBlock>
      <ColorBlock fg={getMostReadableTextColor(bg, fg)} bg={bg}>
        Corrected color pair
      </ColorBlock>
    </ColorBlockWrapper>
  );
};

export const RouteColorTester = (): JSX.Element => {
  const [fg, setFg] = useState("#333333");
  const [bg, setBg] = useState("#cbeb55");
  return (
    <>
      <ColorPair bg={bg} fg={fg}></ColorPair>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        Foreground Color
        <input onChange={e => setFg(e.target.value)} type="color" value={fg} />
      </label>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        Background Color
        <input onChange={e => setBg(e.target.value)} type="color" value={bg} />
      </label>
    </>
  );
};
// Disable color contrast checking for the uncorrected color pairs
RouteColorTester.parameters = {
  a11y: { config: { rules: [{ id: "color-contrast", reviewOnFail: true }] } },
  storyshots: { disable: true }
};

// Route sort logic story:

const Columns = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const RouteRow = styled.div`
  background-color: white;
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 4fr 2fr 2fr;
  width: 75%;

  img {
    height: 30px;
    width: 30px;
  }
`;

const GridCell = styled.span`
  border: 1px solid black;
  padding: 2px;
`;
export const RouteSortingLogic = (): JSX.Element => {
  const [useOperatorComparator, setUseOperatorComparator] = useState(true);
  const [useSortOrderComparator, setUseSortOrderComparator] = useState(true);
  const [useRouteComparator, setUseRouteComparator] = useState(true);
  const [useAlphaSortName, setUseAlphaSortName] = useState(true);
  const [useNumericShortName, setUseNumericShortName] = useState(true);
  const [useStringShortName, setUseStringShortName] = useState(true);
  const [useStringLongName, setUseLongName] = useState(true);

  const transitOperatorComparator = useOperatorComparator
    ? makeTransitOperatorComparator(fakeTransitOperators)
    : null;
  const sortOrderComparator = useSortOrderComparator
    ? makeNumericValueComparator(obj =>
        getOTP1RouteSortOrderValue(obj.sortOrder)
      )
    : null;
  const routeComparator = useRouteComparator ? routeTypeComparator : null;
  const alphaShortName = useAlphaSortName
    ? alphabeticShortNameComparator
    : null;
  const numericShortName = useNumericShortName
    ? makeNumericValueComparator(obj => parseInt(obj.shortName, 10))
    : null;
  const stringShortName = useStringShortName
    ? makeStringValueComparator(obj => obj.shortName)
    : null;
  const stringLongName = useStringLongName
    ? makeStringValueComparator(obj => obj.longName || "")
    : null;

  const sortArray = [
    transitOperatorComparator,
    sortOrderComparator,
    routeComparator,
    alphaShortName,
    numericShortName,
    stringShortName,
    stringLongName
  ].filter(x => x !== null);

  function makeRouteComparator(): (a: number, b: number) => number {
    return makeMultiCriteriaSort(
      ...(sortArray as Array<(a: any, b: any) => number>)
    );
  }

  const sortedRoutes = Array.from(routes as Array<any>).sort(
    makeRouteComparator()
  );

  return (
    <Columns>
      <div
        style={{
          display: "flex",
          flexDirection: "column",

          width: "100%"
        }}
      >
        <RouteRow>
          <GridCell>Logo</GridCell>
          <GridCell>Mode</GridCell>
          <GridCell>Short Name</GridCell>
          <GridCell>Long Name</GridCell>
          <GridCell>Agency Order</GridCell>
          <GridCell>Sort Order</GridCell>
        </RouteRow>
        <div>
          {sortedRoutes.map(r => {
            const operator = fakeTransitOperators.find(
              x => x.agencyId === r.agency.id
            );
            return (
              <RouteRow key={r.id}>
                <GridCell>
                  <img src={operator?.logo} alt={r.agency.name} />
                </GridCell>
                <GridCell>{r.mode}</GridCell>
                <GridCell>{r.shortName}</GridCell>
                <GridCell>{r.longName}</GridCell>
                <GridCell>{operator?.order}</GridCell>
                <GridCell>{r.sortOrder}</GridCell>
              </RouteRow>
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          right: 0,
          width: "25%"
        }}
      >
        <label htmlFor="operator-comparator">
          <input
            id="operator-comparator"
            type="checkbox"
            checked={useOperatorComparator}
            onChange={() => setUseOperatorComparator(!useOperatorComparator)}
          />
          Transit Operator Comparator
        </label>
        <label htmlFor="sort-order-comparator">
          <input
            id="sort-order-comparator"
            type="checkbox"
            checked={useSortOrderComparator}
            onChange={() => setUseSortOrderComparator(!useSortOrderComparator)}
          />
          SortOrder Comparator
        </label>
        <label htmlFor="route-comparator">
          <input
            id="route-comparator"
            type="checkbox"
            checked={useRouteComparator}
            onChange={() => setUseRouteComparator(!useRouteComparator)}
          />
          Route Comparator
        </label>
        <label htmlFor="alpha-sort-name">
          <input
            id="alpha-sort-name"
            type="checkbox"
            checked={useAlphaSortName}
            onChange={() => setUseAlphaSortName(!useAlphaSortName)}
          />
          Alpha Short Name
        </label>
        <label htmlFor="numeric-short-name">
          <input
            id="numeric-short-name"
            type="checkbox"
            checked={useNumericShortName}
            onChange={() => setUseNumericShortName(!useNumericShortName)}
          />
          Numeric Short Name
        </label>
        <label htmlFor="string-short-name">
          <input
            id="string-short-name"
            type="checkbox"
            checked={useStringShortName}
            onChange={() => setUseStringShortName(!useStringShortName)}
          />
          String Short Name
        </label>
        <label htmlFor="string-long-name">
          <input
            id="string-long-name"
            type="checkbox"
            checked={useStringLongName}
            onChange={() => setUseLongName(!useStringLongName)}
          />
          String Long Name
        </label>
      </div>
    </Columns>
  );
};
