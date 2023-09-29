import React from "react";

import styled from "styled-components";
import { getMostReadableTextColor } from "@opentripplanner/core-utils/lib/route";

interface Hue {
  [key: number]: string;
}

interface Props {
  color: Hue;
}

const ColorBlock = styled.div<{ hex: string }>`
  align-items: center;
  background-color: ${props => props.hex};
  color: ${props => getMostReadableTextColor(props.hex, "#ffffff")};
  display: flex;
  font-family: Arial, Helvetica, sans-serif;
  height: 40px;
  justify-content: space-between;
  margin: 0;
  padding: 10px;
  width: 300px;

  &:first-of-type {
    border-radius: 8px 8px 0 0;
  }
  &:last-of-type {
    border-radius: 0 0 8px 8px;
  }
`;

const ColorPalette = ({ color }: Props): JSX.Element => {
  const colorArray: Array<Hue> = Object.entries(color);

  return (
    <>
      {colorArray.map(
        (hue: Hue): JSX.Element => {
          return (
            <ColorBlock key={hue[0]} hex={hue[1]}>
              <p>{hue[0]}</p>
              <p>{hue[1]}</p>
            </ColorBlock>
          );
        }
      )}
    </>
  );
};
export default ColorPalette;
