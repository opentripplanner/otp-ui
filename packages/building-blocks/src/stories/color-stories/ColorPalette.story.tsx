import React, { useEffect, useState } from "react";

import styled, { css } from "styled-components";
import { getMostReadableTextColor } from "@opentripplanner/core-utils/lib/route";
import WcagChecker from "./WCAGChecker.story";
import ColorPickerInput from "./ColorPickerInput.story";
import blue from "../../colors/blue";
import grey from "../../colors/grey";
import SelectedColorOptions from "./SelectedColorOptions.story";
import { Hue } from "../../types/hue";

interface Props {
  color: Hue;
  label: string;
}

export const borderStyles = css`
  border: 1px solid ${grey[100]};
  border-radius: 7px;
`;

const Info = styled.div`
  background-color: ${blue[50]};
  line-height: 1.5;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;

  p {
    margin: 0;
  }

  a {
    color: ${blue[700]};
    font-weight: 700;
    text-decoration: none;

    &:hover {
      color: ${blue[900]};
    }
  }
`;

const ColorContainer = styled.div`
  display: flex;
  gap: 15px;
  font-family: Arial, Helvetica, sans-serif;
  margin: 0 auto;
`;

const ColorPaletteContainer = styled.div``;

const ColorBlock = styled.div<{ hex: string }>`
  align-items: center;
  background-color: ${props => props.hex};
  color: ${props => getMostReadableTextColor(props.hex, "#ffffff")};
  text-shadow: ${props =>
    getMostReadableTextColor(props.hex, "#ffffff") === "#ffffff"
      ? "1px 1px 2px black"
      : ""};
  display: flex;
  height: 40px;
  justify-content: space-between;
  margin: 0;
  padding: 10px;
  transition: all 0.2s ease-in;
  width: 300px;

  &:first-of-type {
    border-radius: 8px 8px 0 0;
  }
  &:last-of-type {
    border-radius: 0 0 8px 8px;
  }

  &:hover {
    transform: scale(1.012);
    transition: all 0.2s ease-in;
    cursor: pointer;
  }
`;

const ColorPickForm = styled.form`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const WCAGContainer = styled.div`
  max-width: 425px;
`;

const ColorPalette = ({ color, label }: Props): JSX.Element => {
  const colorArray: Array<Hue> = Object.entries(color);
  const [selectedColor, setSelectedColor] = useState(colorArray[0]);
  const [foregroundColor, setForegroundColor] = useState(colorArray[0][1]);
  const [foregroundColorInput, setForegroundColorInput] = useState(
    colorArray[0][1]
  );
  const [backgroundColorInput, setBackgroundColorInput] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [foregroundError, setForegroundError] = useState(false);
  const [backgroundError, setBackgroundError] = useState(false);

  const REX_EXP = /(^#[0-9A-F]{6}$)/i;

  const isValidHexCode = code => {
    let hexcode = code;
    if (!code.startsWith("#")) hexcode = `#${code}`;
    return REX_EXP.test(hexcode);
  };

  const backgroundHandleChange = event => {
    const value = event.target.value;
    setBackgroundColorInput(value);
  };

  const foregroundHandleChange = event => {
    const value = event.target.value;
    setForegroundColorInput(value);
  };
  const hexArray = colorArray.map(x => x[1]);
  const foregroundColorIsInPalette = () => {
    if (foregroundColorInput && hexArray.includes(foregroundColorInput)) {
      return `${label} ${
        colorArray[hexArray.indexOf(foregroundColorInput)][0]
      }`;
    }
    return null;
  };
  const backgroundColorIsInPalette = () => {
    if (backgroundColorInput && hexArray.includes(backgroundColorInput)) {
      return `${label} ${
        colorArray[hexArray.indexOf(backgroundColorInput)][0]
      }`;
    }
    return null;
  };
  const selectedColorReset =
    selectedColor &&
    foregroundColorInput !== selectedColor[1] &&
    backgroundColorInput !== selectedColor[1];

  useEffect(() => {
    if (selectedColorReset) {
      setSelectedColor(undefined);
    }
    if (!isValidHexCode(foregroundColorInput)) {
      setForegroundError(true);
    } else {
      setForegroundError(false);
      setForegroundColor(foregroundColorInput);
    }
  }, [foregroundColorInput]);

  useEffect(() => {
    if (selectedColorReset) {
      setSelectedColor(undefined);
    }
    if (!isValidHexCode(backgroundColorInput)) {
      setBackgroundError(true);
    } else {
      setBackgroundError(false);
      setBackgroundColor(backgroundColorInput);
    }
  }, [backgroundColorInput]);

  return (
    <ColorContainer>
      <ColorPaletteContainer>
        {colorArray.map(
          (hue: Hue): JSX.Element => {
            return (
              <ColorBlock
                key={hue[0]}
                hex={hue[1]}
                onClick={() => setSelectedColor(hue)}
              >
                <p>{hue[0]}</p>
                <p>{hue[1]}</p>
              </ColorBlock>
            );
          }
        )}
      </ColorPaletteContainer>

      <WCAGContainer>
        <Info>
          <p>
            Select a color variable from the palette to check it against WCAG
            contrast requirements.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://webaim.org/articles/contrast/"
            >
              See more
            </a>{" "}
          </p>
        </Info>
        <SelectedColorOptions
          selectedColor={selectedColor}
          selectedColorLabel={label}
          setBackgroundColor={setBackgroundColor}
          setForegroundColor={setForegroundColor}
          setBackgroundColorInput={setBackgroundColorInput}
          setForegroundColorInput={setForegroundColorInput}
        />
        <ColorPickForm>
          <ColorPickerInput
            colorInPalette={foregroundColorIsInPalette()}
            handleChange={foregroundHandleChange}
            inputLabel="Foreground color"
            colorInput={foregroundColorInput}
            error={foregroundError}
          />
          <ColorPickerInput
            colorInPalette={backgroundColorIsInPalette()}
            handleChange={backgroundHandleChange}
            inputLabel="Background color"
            colorInput={backgroundColorInput}
            error={backgroundError}
          />
        </ColorPickForm>
        <WcagChecker background={backgroundColor} hue={foregroundColor} />
      </WCAGContainer>
    </ColorContainer>
  );
};
export default ColorPalette;
