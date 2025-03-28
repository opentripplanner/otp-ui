import React, { useState } from "react";
import styled from "styled-components";
import {
  alphabeticShortNameComparator,
  getMostReadableTextColor,
  getRouteSortOrderValue,
  makeMultiCriteriaSort,
  makeNumericValueComparator,
  makeStringValueComparator,
  makeTransitOperatorComparator,
  routeTypeComparator
} from "./route";
import { routes } from "./__mocks__/fake-route-data.story.json";
import { fakeTransitOperators } from "./__mocks__/fake-transit-operators.story.json";

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
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;

const StyledTable = styled.table`
  td,
  th {
    border: 1px solid black;
    padding: 2px;
  }

  tr {
    background-color: white;
    display: grid;
    grid-template-columns: 1fr 2fr 2fr 4fr 2fr 2fr;
    width: 75%;
    img {
      height: 30px;
      width: 30px;
    }
  }
`;

function makeRouteComparator(sortArray): (a: number, b: number) => number {
  return makeMultiCriteriaSort(
    ...(sortArray as Array<(a: any, b: any) => number>)
  );
}

/**
 * This is based on the logic in the makeRouteComparator function in route.ts
 * If another route comparator is added to makeRouteComparator, this component
 * will need to be updated to reflect the new comparator.
 */
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
    ? makeNumericValueComparator(obj => getRouteSortOrderValue(obj))
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

  const sortedRoutes = Array.from(routes as Array<any>).sort(
    makeRouteComparator(sortArray)
  );

  return (
    <Columns>
      <StyledTable>
        <tr>
          <th>Logo</th>
          <th>Mode</th>
          <th>Short Name</th>
          <th>Long Name</th>
          <th>Agency Order</th>
          <th>Sort Order</th>
        </tr>
        {sortedRoutes.map(r => {
          const operator = fakeTransitOperators.find(
            x => x.agencyId === r.agency?.id
          );
          return (
            <tr key={r.id}>
              <td>
                <img src={operator?.logo} alt={r.agency?.name || ""} />
              </td>
              <td>{r.mode}</td>
              <td>{r.shortName}</td>
              <td>{r.longName}</td>
              <td>{operator?.order}</td>
              <td>{r.sortOrder}</td>
            </tr>
          );
        })}
      </StyledTable>
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
            checked={useOperatorComparator}
            id="operator-comparator"
            onChange={() => setUseOperatorComparator(!useOperatorComparator)}
            type="checkbox"
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
