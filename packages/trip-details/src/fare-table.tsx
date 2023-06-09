import { Leg } from "@opentripplanner/types";
import React from "react";
import styled from "styled-components";
import { Transfer } from "@styled-icons/boxicons-regular/Transfer";

import {
  getItineraryCost,
  getLegCost
} from "@opentripplanner/core-utils/lib/itinerary";
import { useIntl } from "react-intl";
import { flatten } from "flat";
import { boldText, renderFare } from "./utils";

import { FareLegTableProps, FareTableLayout } from "./types";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

interface FareTypeTableProps extends FareTableLayout {
  legs: Leg[];
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

const useGetHeaderString = (headerKey: string): string => {
  const intl = useIntl();
  return intl.formatMessage({
    id: `otpUi.TripDetails.FareTable.${headerKey}`,
    description: `Fare leg table header for key ${headerKey}`,
    defaultMessage:
      defaultEnglishMessages[`otpUi.TripDetails.FareTable.${headerKey}`]
  });
};

const FareTypeTable = ({
  cols,
  headerKey,
  legs
}: FareTypeTableProps): JSX.Element => {
  const intl = useIntl();
  // FIXME: Is there a nicer way to do this?
  const colsToRender = cols
    .filter(col => getItineraryCost(legs, col.riderCategoryId, col.mediumId))
    .map(col => ({
      ...col,
      total: getItineraryCost(legs, col.riderCategoryId, col.mediumId)
    }));

  const headerString = useGetHeaderString(headerKey);

  const filteredLegs = legs.filter(leg => leg.fareProducts?.length > 0);
  if (colsToRender.length) {
    return (
      <Table>
        <TableHeader>
          <th className="main" scope="col">
            {boldText(headerString)}
          </th>
          {colsToRender.map(col => {
            const fare = col.total;
            return (
              <th
                scope="col"
                key={
                  col.columnHeaderKey ||
                  `${col.mediumId}-${col.riderCategoryId}`
                }
              >
                {boldText(useGetHeaderString(col.columnHeaderKey))}
                <br />
                {renderFare(
                  fare?.currency?.code,
                  (fare?.amount || 0) / 10 ** fare?.currency?.digits
                )}
              </th>
            );
          })}
        </TableHeader>
        {filteredLegs.map((leg, index) => (
          <tr key={index}>
            <td className="no-zebra">
              {leg.routeShortName || leg.route || leg.routeLongName}
            </td>
            {colsToRender.map(col => {
              const fare = getLegCost(leg, col.mediumId, col.riderCategoryId);
              return (
                <td
                  key={col.columnHeaderKey}
                  title={
                    "transferAmount" in fare &&
                    fare?.transferAmount?.amount > 0 &&
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
                          fare?.transferAmount?.amount /
                            10 ** fare?.transferAmount?.currency.digits,
                          {
                            currency: fare?.price?.currency?.code,
                            currencyDisplay: "narrowSymbol",
                            style: "currency"
                          }
                        )
                      }
                    )
                  }
                >
                  {"transferAmount" in fare &&
                    fare?.transferAmount?.amount > 0 && (
                      <>
                        <TransferIcon size={16} />{" "}
                      </>
                    )}
                  {renderFare(
                    fare?.price?.currency?.code,
                    (fare?.price?.amount || 0) /
                      10 ** fare?.price?.currency?.digits
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

const FareLegTable = ({ layout, legs }: FareLegTableProps): JSX.Element => {
  // the layout argument contains an object for every table to be displayed
  return (
    <div>
      {layout.map(config => (
        <FareTypeTable
          cols={config.cols}
          headerKey={config.headerKey}
          key={config.headerKey}
          legs={legs}
        />
      ))}
    </div>
  );
};

export default FareLegTable;
