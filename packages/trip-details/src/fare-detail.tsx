/* eslint-disable import/prefer-default-export */
import { Leg, Money } from "@opentripplanner/types";

import flatten from "flat";
import React from "react";
import styled from "styled-components";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { FareDetailsProps } from "./types";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

interface FareTypeTableProps {
  headeri18nKey: string;
  cols: {
    key: string;
    i18nKey: string;
  }[];
  legs: (Leg & { fares: { [key: string]: { price: Money } } })[];
  fareTotals: { [fareKey: string]: Money };
}

const TableHeader = styled.thead`
  th {
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
  const { headeri18nKey, fareTotals, cols, legs } = props;
  return (
    <Table>
      <TableHeader>
        <th className="main">
          <FormattedMessage
            defaultMessage={
              defaultMessages[
                `otpUi.TripDetails.fareDetailsHeaders.${headeri18nKey}`
              ]
            }
            id={`otpUi.TripDetails.fareDetailsHeaders.${headeri18nKey}`}
          />
        </th>
        {cols.map(col => {
          const fare = fareTotals[col.key];
          return (
            <th key={col.key}>
              <FormattedMessage
                defaultMessage={
                  defaultMessages[
                    `otpUi.TripDetails.fareDetailsHeaders.${col.i18nKey}`
                  ]
                }
                id={`otpUi.TripDetails.fareDetailsHeaders.${col.i18nKey}`}
              />
              <br />
              <FormattedNumber
                value={(fare?.cents || 0) / 100}
                // This isn't a "real" style prop
                // eslint-disable-next-line react/style-prop-object
                style="currency"
                currency={fare?.currency?.currencyCode}
                currencyDisplay="narrowSymbol"
              />
            </th>
          );
        })}
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
    </Table>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FareLegDetails = (props: FareDetailsProps): JSX.Element => {
  const { legs, transitFares, transitFareDetails, layout } = props;
  const fareKeys = Object.keys(transitFareDetails);

  const legsWithFares = legs
    .map((leg, index) => {
      const fares = fareKeys.reduce((prev, key) => {
        const fareForKey = transitFareDetails[key]?.find(
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
          cols={config.cols}
          headeri18nKey={config.headeri18nKey}
          key={config.headeri18nKey}
          legs={legsWithFares}
          fareTotals={transitFares}
        />
      ))}
    </div>
  );
};
