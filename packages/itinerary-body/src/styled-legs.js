import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { CaretDown, CaretUp } from "styled-icons/fa-solid";

export const CaretToggle = ({ expanded }) =>
  expanded ? <CaretUp size={15} /> : <CaretDown size={15} />;

CaretToggle.propTypes = {
  expanded: PropTypes.bool.isRequired
};

export const TransparentButton = styled.button`
  background: transparent;
  color: inherit;
  border: 0;
  text-decoration: none;
`;

export const LegClickable = styled(TransparentButton)`
  cursor: pointer;
  display: table;
`;

export const LegBody = styled.div`
  color: #999;
  font-size: 13px;
  padding: 12px 0 18px 4px;
`;
