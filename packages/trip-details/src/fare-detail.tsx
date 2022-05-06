/* eslint-disable import/prefer-default-export */
import { Leg, Money } from "@opentripplanner/types";

import React from "react";
import styled from "styled-components";
import { FormattedNumber } from "react-intl";
import { FareDetailsProps } from "./types";

interface FareTypeTableProps {
  header: string;
  cols: {
    key: string;
    header: string;
  }[];
  legs: Leg & { fares: { [key: string]: { price: Money } } }[];
  fareTotals: { [fareKey: string]: Money };
}

const TableHeader = styled.thead`
  th {
    max-width: 5ch;
    min-width: 5ch;
    padding: 0.75em 1.5em;
    text-align: center;
  }
  th:nth-of-type(2n + 1) {
    background: #cccccc22;
  }
  th.main {
    color: #ffffffcc;
    background: #333333;
  }
`;

const TotalRow = styled.tr`
  border-top: 2px solid #333;
  font-weight: 600;
`;

const Table = styled.table`
  border-collapse: collapse;
  display: block;
  font-family: sans-serif;
  margin: -8px;
  /* This line can not be sorted alphabetically, because it must come after the margin rule */
  margin-bottom: 16px;
  padding: 0;

  td {
    text-align: right;
  }
  td:nth-of-type(2n + 1) {
    background: #cccccc22;
  }
  td.no-zebra {
    background: transparent;
  }
  th:first-of-type {
    height: 40px;
  }
`;

const FareTypeTable = (props: FareTypeTableProps): JSX.Element => {
  const { header, fareTotals, cols, legs } = props;
  return (
    <Table>
      <TableHeader>
        <th className="main">{header}</th>
        {cols.map(col => (
          <th key={col.header}>{col.header}</th>
        ))}
      </TableHeader>
      {legs.map((leg, index) => (
        <tr key={index}>
          <td className="no-zebra">{leg.routeShortName}</td>
          {cols.map(col => {
            const fare = leg.fares[col.key];
            return (
              <td key={col.key}>
                <FormattedNumber
                  value={fare?.price?.cents / 100 || 0}
                  // This isn't a "real" style prop
                  // eslint-disable-next-line react/style-prop-object
                  style="currency"
                  currency={
                    fare?.price.currency.currencyCode ||
                    // This is how the itinerary-wide currency code is calculated on the back-end
                    legs?.[0].fares?.[col.key]?.price?.currency.currencyCode
                  }
                  currencyDisplay="narrowSymbol"
                />
              </td>
            );
          })}
        </tr>
      ))}
      <TotalRow>
        <td className="no-zebra">Total</td>
        {cols.map(col => {
          const fare = fareTotals[col.key];
          return (
            <td key={col.key}>
              <FormattedNumber
                value={(fare?.cents || 0) / 100}
                // This isn't a "real" style prop
                // eslint-disable-next-line react/style-prop-object
                style="currency"
                currency={fare?.currency?.currencyCode}
                currencyDisplay="narrowSymbol"
              />
            </td>
          );
        })}
      </TotalRow>
    </Table>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FareDetails = (props: FareDetailsProps): JSX.Element => {
  const { legs, transitFares, layout } = props;
  const fareKeys = Object.keys(transitFares.details);

  const legsWithFares = legs
    .map((leg, index) => {
      const fares = fareKeys.reduce((prev, key) => {
        const fareForKey = transitFares.details[key]?.find(
          detail => detail.legIndex === index
        );
        if (fareForKey) {
          prev[key] = fareForKey;
        }
        return prev;
      }, {});
      return {
        ...leg,
        fares
      };
    })
    .filter(leg => leg.transitLeg);

  return (
    <div>
      {layout.map(config => (
        <FareTypeTable
          header={config.header}
          cols={config.cols}
          key={config.header}
          legs={legsWithFares}
          fareTotals={transitFares.fare}
        />
      ))}
    </div>
  );
};
