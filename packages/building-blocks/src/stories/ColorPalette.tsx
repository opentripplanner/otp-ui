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
  height: 40px;
  width: 300px;
  background-color: ${props => props.hex};
  color: ${props => getMostReadableTextColor(props.hex, "#ffffff")};
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 10px;
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
