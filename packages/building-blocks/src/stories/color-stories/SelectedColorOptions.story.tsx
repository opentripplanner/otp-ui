import React, { Dispatch, ReactElement, SetStateAction } from "react";
import styled from "styled-components";
import grey from "../../colors/grey";
import { Hue } from "../../types/hue";

interface Props {
  selectedColorLabel: string;
  selectedColor: Hue;
  setForegroundColor: Dispatch<SetStateAction<string>>;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  setForegroundColorInput: Dispatch<SetStateAction<string>>;
  setBackgroundColorInput: Dispatch<SetStateAction<string>>;
}

const SelectedColorContainer = styled.div`
  border: 1px solid ${grey[100]};
  border-radius: 7px;
  justify-content: center;
  padding: 10px 15px;
  margin-bottom: 15px;
`;

const SelectedColor = styled.div<{ color: string }>`
  width: 100px;
  height: 50px;
  background-color: ${props => props.color};
  border-radius: 5px 5px 0 0;
`;

const SelectedColorSwatch = styled.div`
  border: 1px solid grey;
  border-radius: 5px;
  min-width: 85px;

  p {
    padding: 10px;
    margin: 0;
  }
`;

const SelectedColorControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  button {
    background: #fff;
    border: 1px solid ${grey[600]};
    border-radius: 5px;
    padding: 5px 10px;

    &:hover {
      background-color: ${grey[50]};
      cursor: pointer;
    }
  }
`;

const SelectedColorOptions = ({
  selectedColorLabel,
  selectedColor,
  setForegroundColor,
  setBackgroundColor,
  setForegroundColorInput,
  setBackgroundColorInput
}: Props): ReactElement => {
  const handleSetForegroundColor = () => {
    setForegroundColor(selectedColor[1]);
    setForegroundColorInput(selectedColor[1]);
  };
  const handleSetBackgroundColor = () => {
    setBackgroundColor(selectedColor[1]);
    setBackgroundColorInput(selectedColor[1]);
  };
  return (
    <SelectedColorContainer>
      {selectedColor ? (
        <SelectedColorControls>
          <SelectedColorSwatch>
            <SelectedColor color={selectedColor[1]} />
            <p>
              {selectedColorLabel} {selectedColor[0]}
            </p>
          </SelectedColorSwatch>

          <ButtonContainer>
            <button type="submit" onClick={handleSetForegroundColor}>
              Set to foreground color
            </button>
            <button type="submit" onClick={handleSetBackgroundColor}>
              Set to background color
            </button>
          </ButtonContainer>
        </SelectedColorControls>
      ) : (
        "Please choose a color from the left"
      )}
    </SelectedColorContainer>
  );
};

export default SelectedColorOptions;
