import React from "react";
import styled from "styled-components";

export const StyledTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  font-family: system-ui;
  vertical-align: middle;

  div {
    width: 50px;
  }

  td,
  th {
    padding: 10px;
  }

  tr {
    border: 1px solid gray;
  }

  tbody tr:nth-child(even) {
    background-color: #eaeaea;
  }
`;

export default function IconRenderer({
  examples,
  renderComponentFn,
  typeTitle
}) {
  return (
    <StyledTable>
      <thead>
        <tr>
          <th>{typeTitle}</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {examples.map((example, index) => (
          <tr key={index}>
            <td>{example.type || example}</td>
            <td>
              <div>{renderComponentFn(example)}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}
