import React from "react";
import styled from "styled-components";
// The below eslint-disable is due to https://github.com/storybookjs/storybook/issues/13408
// eslint-disable-next-line import/no-named-as-default
import LocationIcon from ".";

export default {
  title: "LocationIcon",
  component: LocationIcon
};

export const From = () => <LocationIcon type="from" size={25} />;
export const To = () => <LocationIcon type="to" size={25} />;
export const GenericPlace = () => (
  <LocationIcon type="intermediate-place-1" size="25" />
);
export const CustomStyleForTo = () => {
  const StyledLocationIcon = styled(LocationIcon)`
    color: blue;
  `;
  return <StyledLocationIcon type="to" size={25} />;
};
