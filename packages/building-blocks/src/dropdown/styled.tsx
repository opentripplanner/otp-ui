import styled from "styled-components";
import grey from "../colors/grey";

export const DropdownButton = styled.button`
  background: #fff;
  border: 1px solid black;
  border-radius: 5px;
  color: inherit;
  padding: 5px 7px;
  transition: all 0.1s ease-in-out;

  span.caret {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid;
    color: inherit;
    display: inline-block;
    height: 0;
    margin-left: 5px;
    vertical-align: middle;
    width: 0;
  }

  &:hover,
  &[aria-expanded="true"] {
    background: ${grey[50]};
    color: black;
    cursor: pointer;
  }
`;

export const DropdownMenu = styled.div<{ alignLeft?: boolean }>`
  background-clip: padding-box;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  color: #333;
  list-style: none;
  margin: 2px 0 0;
  min-width: 160px;
  padding: 5px 0;
  position: absolute;
  ${props => (props.alignLeft ? "left: 0;" : "right: 0;")}
  top: 100%;
  width: 100%;
  z-index: 1000;

  hr {
    margin: 0;
    padding: 0;
  }
  a,
  button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px 15px;
    text-align: start;
    width: 100%;

    &:hover {
      background: ${grey[50]};
    }
  }
`;

export const DropdownWrapper = styled.span<{ pullRight?: boolean }>`
  float: ${props => (props.pullRight ? "right" : "left")};
  position: relative;
`;
