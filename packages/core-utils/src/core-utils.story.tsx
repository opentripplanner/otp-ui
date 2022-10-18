import React, { useState } from "react";
import styled from "styled-components";
import { getMostReadableTextColor } from "./route";

export default {
  title: "core-utils"
};

const ColorBlock = styled.div<{ bg: string; fg: string }>`
  background: ${props => props.bg};
  color: ${props => props.fg};
  padding: 10px;
`;

const ColorBlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ColorPair = ({ fg, bg }: { fg: string; bg: string }) => {
  return (
    <ColorBlockWrapper>
      <ColorBlock fg={fg} bg={bg}>
        Provided color pair
      </ColorBlock>
      <ColorBlock fg={getMostReadableTextColor(bg, fg)} bg={bg}>
        Corrected color pair
      </ColorBlock>
    </ColorBlockWrapper>
  );
};

export const RouteColorTester = (): JSX.Element => {
  const [fg, setFg] = useState("#333333");
  const [bg, setBg] = useState("#cbeb55");
  return (
    <>
      <ColorPair bg={bg} fg={fg}></ColorPair>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        Foreground Color
        <input
          type="color"
          value={fg}
          onChange={e => setFg(e.target.value)}
        ></input>
      </label>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        Background Color
        <input
          type="color"
          value={bg}
          onChange={e => setBg(e.target.value)}
        ></input>
      </label>
    </>
  );
};
// Disable color contrast checking for the uncorrected color pairs
RouteColorTester.parameters = {
  a11y: { config: { rules: [{ id: "color-contrast", reviewOnFail: true }] } },
  storyshots: { disable: true }
};
