import styled from "styled-components";

export const DropdownSelectorWrap = styled.div`
  > div {
    width: 50%;
    display: inline-block;
    box-sizing: border-box;
    position: relative;

    :last-child::after {
      content: "▼";
      font-size: 75%;
      color: #000;
      right: 8px;
      top: 10px;
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
    }
  }
  select {
    width: 100%;
    box-sizing: border-box;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    margin-bottom: 15px;
  }
`;

export const SelectCtrl = styled.select`
  -webkit-appearance: none;
  background: none;
  border-radius: 3px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  height: 34px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.42857;
  color: #555;
`;
