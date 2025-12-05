import React from "react";
import styled from "styled-components";
import { BlvdDirect, LucyGold, LucyGreen } from "../septa";

export default {
  title: "Icons/SeptaRouteIcons"
};

const Table = styled.table`
  tr {
    font-weight: 600;
  }
  td svg {
    height: 68px;
    width: 100px;
  }
`;

export const SeptaRouteIconExamples = () => (
  <Table>
    <tr>
      <td>Blvd Direct</td>
      <td>
        <BlvdDirect />
      </td>
    </tr>
    <tr>
      <td>Lucy Green</td>
      <td>
        <LucyGreen />
      </td>
    </tr>
    <tr>
      <td>Lucy Gold</td>
      <td>
        <LucyGold />
      </td>
    </tr>
  </Table>
);
