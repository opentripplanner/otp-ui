import { Leg, Money } from "@opentripplanner/types";
import React from "react";
import styled from "styled-components";
import { Transfer } from "@styled-icons/boxicons-regular/Transfer";

import {
  getItineraryCost,
  getLegCost,
  getLegsWithFares
} from "@opentripplanner/core-utils/lib/itinerary";
import { useIntl } from "react-intl";
import { flatten } from "flat";
import { boldText, getFormattedTextForConfigKey, renderFare } from "./utils";

import { FareLegTableProps, FareTableLayout } from "./types";

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

interface FareTypeTableProps extends FareTableLayout {
  fareTotals: Record<string, Money>;
  legs: LegAndFare[];
  hasLegProducts?: boolean;
}

const TableHeader = styled.thead`
  th {
    font-weight: normal;
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
  margin-bottom: 16px;
  padding: 0;

  td {
    text-align: right;
  }
  td:nth-of-type(2n + 1) {
    background: #cccccc22;
  }
  td.no-zebra {
    background: none;
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
  header,
  legs,
  hasLegProducts
}: FareTypeTableProps): JSX.Element => {
  const colsToRender = cols.filter(col =>
    hasLegProducts
      ? getItineraryCost(legs, col.riderCategory, col.fareContainer)
      : fareTotals[col.key]
  );

  const intl = useIntl();

  if (colsToRender.length) {
    return (
      <Table>
        <TableHeader>
          <th className="main">
            {boldText(getFormattedTextForConfigKey(header))}
          </th>
          {colsToRender.map(col => {
            const fare = hasLegProducts
              ? getItineraryCost(legs, col.riderCategory, col.fareContainer)
              : fareTotals[col.key];
            return (
              <th key={col.key || `${col.fareContainer}-${col.riderCategory}`}>
                {boldText(getFormattedTextForConfigKey(col.header))}
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
            <td className="no-zebra">
              {leg.routeShortName || leg.route || leg.routeLongName}
            </td>
            {colsToRender.map(col => {
              const fare = hasLegProducts
                ? getLegCost(leg, col.riderCategory, col.fareContainer)
                : leg.fares[col.key];

              return (
                <td
                  key={col.key}
                  title={
                    "transferAmount" in fare &&
                    fare?.transferAmount &&
                    intl.formatMessage(
                      {
                        defaultMessage:
                          defaultMessages[
                            "otpUi.TripDetails.transferDiscountExplanation"
                          ],
                        description:
                          "Text explaining the transfer discount applied to this fare.",
                        id: "otpUi.TripDetails.transferDiscountExplanation"
                      },
                      {
                        transferAmount: intl.formatNumber(
                          fare.transferAmount / 100,
                          {
                            currency: fare?.price?.currency?.currencyCode,
                            currencyDisplay: "narrowSymbol",
                            style: "currency"
                          }
                        )
                      }
                    )
                  }
                >
                  {(("isTransfer" in fare && fare?.isTransfer) ||
                    ("transferAmount" in fare && fare?.transferAmount)) && (
                    <>
                      <TransferIcon size={16} />{" "}
                    </>
                  )}
                  {renderFare(
                    fare?.price?.currency?.currencyCode,
                    (fare?.price?.cents || 0) / 100
                  )}
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

const FareLegDetails = ({
  layout,
  itinerary
}: FareLegTableProps): JSX.Element => {
  const hasLegProducts = !!itinerary?.fare?.legProducts;
  const fareKeys = Object.keys(itinerary?.fare?.details);

  let legsWithFares;

  if (!hasLegProducts) {
    // OTP1 Logic
    legsWithFares = itinerary.legs
      .map((leg, index) => {
        const fares = fareKeys.reduce((prev, key) => {
          const fareForKey = itinerary.fare.details[key]?.find(
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
  } else {
    // OTP2 Logic using core-utils function
    legsWithFares = getLegsWithFares(itinerary).filter(leg => leg.transitLeg);
  }

  return (
    <div>
      {layout.map(config => (
        <FareTypeTable
          cols={config.cols}
          fareTotals={itinerary.fare.fare}
          header={config.header}
          key={config.header}
          legs={legsWithFares}
          hasLegProducts={hasLegProducts}
        />
      ))}
    </div>
  );
};

export default FareLegDetails;
