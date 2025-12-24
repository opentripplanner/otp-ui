/* eslint-disable no-underscore-dangle */
import React from "react";
import { Leg } from "@opentripplanner/types";
import coreUtils from "@opentripplanner/core-utils";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { Transfer } from "@styled-icons/boxicons-regular/Transfer";

import { renderFare } from "../utils";
import { InvisibleA11yCaption, InvisibleA11yLabel } from "../styled";

// TODO: inline this import? (@opentripplanner/core-utils/src/itinerary)
const {
  getLegCost,
  getItineraryCost,
  descope,
  getLegRouteName
} = coreUtils.itinerary;

const FailDash = (
  <>
    -
    <InvisibleA11yLabel>
      <FormattedMessage id="otpUi.TripDetails.legMissingFareInfo" />
    </InvisibleA11yLabel>
  </>
);

const TransferIcon = styled(Transfer)`
  padding-right: 0.25ch;
`;

const StripedTable = styled.table`
  text-align: right;

  tr td,
  tr th {
    padding: 4px;
  }

  tr td:nth-of-type(2n + 1),
  tr th:nth-of-type(2n) {
    background: #cccccc55;
    border-color: #cccccc55;
  }
`;

type IdNamePair = { id: string; name: string };

// Removes duplicates
const categoryReducer = (acc: IdNamePair[], cur: IdNamePair) => {
  if (!acc.some(m => descope(m?.id) === descope(cur?.id))) {
    acc.push(cur);
  }
  return acc;
};

// Put the preferred medium first, and then all the others alphabetical
const categorySorter = (favoriteId?: string) => (
  a: IdNamePair,
  b: IdNamePair
): number => {
  const aId = descope(a?.id);
  const bId = descope(b?.id);

  if (favoriteId && aId === favoriteId) {
    return -1;
  }
  if (favoriteId && bId === favoriteId) {
    return 1;
  }

  return aId > bId ? 1 : -1;
};

// TODO: This component currently can only show one type of fare per medium
const FaresV2Table = ({
  legs,
  favoriteMediumId,
  favoriteRiderCategoryId
}: {
  legs: Leg[];
  favoriteMediumId?: string;
  favoriteRiderCategoryId?: string;
}): JSX.Element => {
  const intl = useIntl();

  const transitLegs = legs.filter(leg => leg.transitLeg);

  // Get all fare products across all legs
  const fareProducts = transitLegs.flatMap(leg => leg.fareProducts);

  // Reduce these into mediums and riders
  const mediums = fareProducts
    .map(fp => fp.product?.medium)
    .reduce(categoryReducer, [])
    .sort(categorySorter(favoriteMediumId));
  const riders = fareProducts
    .map(fp => fp.product?.riderCategory)
    .reduce(categoryReducer, [])
    .sort(categorySorter(favoriteRiderCategoryId));

  // Generate the pairs of riders and mediums, but filter out ones
  // that never occur in the FareProducts
  const riderMediumPairs = mediums
    .flatMap(medium =>
      riders.map(rider => ({
        medium,
        rider
      }))
    )
    .filter(rmp =>
      fareProducts.some(
        fp =>
          fp.product?.riderCategory?.id === rmp.rider?.id &&
          fp.product?.medium?.id === rmp.medium?.id
      )
    );

  // Ensure we have at least one rider/medium
  if (riders.length === 0) {
    riders.push({ name: "Fare", id: null });
  }
  if (mediums.length === 0) {
    mediums.push({ name: "Regular", id: null });
  }

  // Keep track of seen fare ids to indicate transfers
  const productUseIds: Set<string> = new Set();

  const rows = [
    [
      <th key="faretitle" style={{ textAlign: "left" }} scope="col">
        <InvisibleA11yLabel>
          <FormattedMessage id="otpUi.TripDetails.fareCategory" />
        </InvisibleA11yLabel>
      </th>,
      ...transitLegs.map(leg => (
        <th key={leg.tripId} scope="col">
          {getLegRouteName(leg)}
        </th>
      )),
      transitLegs.length > 1 ? (
        <th key="total" style={{ textAlign: "right" }} scope="col">
          <em>
            <FormattedMessage id="otpUi.TripDetails.total" />
          </em>
        </th>
      ) : (
        <></>
      )
    ]
  ];

  // non-transit legs don't have fares
  transitLegs.forEach((leg, index) => {
    riderMediumPairs.forEach((rmp, currentRowIndex) => {
      const { medium, rider } = rmp;
      const {
        alternateFareProducts,
        isDependent,
        appliedFareProduct,
        productUseId
      } = getLegCost(
        leg,
        descope(medium?.id),
        descope(rider?.id),
        Array.from(productUseIds)
      );
      const legPrice = appliedFareProduct?.legPrice;

      productUseIds.add(productUseId);

      // Only consider alternateFareProducts if current product is dependent
      const dependentAlternateFareProducts =
        isDependent && alternateFareProducts;

      // Calculate pre-tranfer amount either via alternate fare or fare-id matching (price.originalAmount)
      const originalAmount =
        dependentAlternateFareProducts?.[0]?.price.amount - legPrice?.amount ||
        appliedFareProduct?.price.amount - legPrice?.amount;

      const newCell = (
        <>
          {/* Only render the list of fare types once */}
          {index === 0 && (
            <th style={{ textAlign: "left" }} scope="row">
              {medium?.id && (
                <FormattedMessage
                  id={`config.fares.media.${descope(medium.id)}`}
                  defaultMessage={medium.name}
                />
              )}{" "}
              {rider?.id && (
                <FormattedMessage
                  id={`config.fares.riderCategory.${descope(rider.id)}`}
                  defaultMessage={rider.name}
                />
              )}
            </th>
          )}
          <td
            style={{ textAlign: legPrice ? "right" : "center" }}
            title={
              !Number.isNaN(originalAmount) &&
              originalAmount > 0 &&
              index > 0 &&
              intl.formatMessage(
                {
                  description:
                    "Text explaining the transfer discount applied to this fare.",
                  id: "otpUi.TripDetails.transferDiscountExplanation"
                },
                {
                  transferAmount: intl.formatNumber(originalAmount, {
                    currency: legPrice?.currency?.code,
                    currencyDisplay: "narrowSymbol",
                    style: "currency"
                  })
                }
              )
            }
          >
            {!Number.isNaN(originalAmount) &&
              originalAmount > 0 &&
              index > 0 && <TransferIcon size={16} />}
            {/* Leg Price will always be defined if the fare product has a price */}
            {legPrice
              ? renderFare(legPrice?.currency?.code, legPrice?.amount)
              : FailDash}
          </td>
        </>
      );
      const nextRowIndex = currentRowIndex + 1;
      if (!rows[nextRowIndex]) {
        rows[nextRowIndex] = [];
      }
      rows[nextRowIndex].push(newCell);

      // Generate final column
      if (index === transitLegs.length - 1 && transitLegs.length > 1) {
        const fare = getItineraryCost(
          legs,
          descope(medium?.id) || null,
          descope(rider?.id) || null
        );
        rows[nextRowIndex].push(
          <td
            style={{ textAlign: fare?.amount ? "right" : "center" }}
            title={
              !fare?.amount &&
              intl.formatMessage({
                id: "otpUi.TripDetails.missingFareTotal"
              })
            }
          >
            <em>
              {fare?.amount
                ? renderFare(fare?.currency.code, fare?.amount)
                : FailDash}
            </em>
          </td>
        );
      }
    });
  });

  return (
    <StripedTable>
      <InvisibleA11yCaption>
        <FormattedMessage id="otpUi.TripDetails.transitFareTable" />
      </InvisibleA11yCaption>
      {rows.map((r, index) => (
        <tr key={index}>{r}</tr>
      ))}
    </StripedTable>
  );
};

export default FaresV2Table;
