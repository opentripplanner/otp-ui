import { Leg, Money } from "@opentripplanner/types";
import flatten from "flat";
import React from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Transfer } from "@styled-icons/boxicons-regular/Transfer";

import { renderFare } from "./utils";

import { FareDetailsLayout, FareDetailsProps } from "./types";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

type LegAndFare = Leg & {
  fares: Record<string, { price: Money; isTransfer?: boolean }>;
};

interface FareTypeTableProps extends FareDetailsLayout {
  legs: LegAndFare[];
  fareTotals: Record<string, Money>;
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
    background: #333333;
    color: #ffffffcc;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  display: block;
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

const TransferIcon = styled(Transfer)`
  padding-left: 4px;
`;

const FareTypeTable = ({
  cols,
  fareTotals,
  headeri18nKey,
  legs
}: FareTypeTableProps): JSX.Element => {
  const colsToRender = cols.filter(col => fareTotals[col.key]);
  if (colsToRender.length) {
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
          {colsToRender.map(col => {
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
                {renderFare(
                  fare?.currency?.currencyCode,
                  (fare?.cents || 0) / 100
                )}
              </th>
            );
          })}
        </TableHeader>
        {legs.map((leg, index) => (
          <tr key={index}>
            <td className="no-zebra">{leg.routeShortName}</td>
            {colsToRender.map(col => {
              const fare = leg.fares[col.key];
              return (
                <td key={col.key}>
                  {renderFare(
                    fare?.price.currency?.currencyCode,
                    (fare?.price.cents || 0) / 100
                  )}
                  {fare?.isTransfer && <TransferIcon size={16} />}
                </td>
              );
            })}
          </tr>
        ))}
      </Table>
    );
  }
  return null;
};

const FareLegDetails = (props: FareDetailsProps): JSX.Element => {
  const { layout, transitFareDetails, transitFares, legs } = props;
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
          fareTotals={transitFares}
          headeri18nKey={config.headeri18nKey}
          key={config.headeri18nKey}
          legs={legsWithFares}
        />
      ))}
    </div>
  );
};

export default FareLegDetails;
