import React, { ChangeEventHandler, ReactElement } from "react";
import styled from "styled-components";
import grey from "../../colors/grey";
import red from "../../colors/red";

interface Props {
  handleChange: ChangeEventHandler<HTMLInputElement>;
  colorInPalette: string | null;
  inputLabel: string;
  colorInput: string;
  error: boolean;
}

const ColorPicker = styled.div`
  position: relative;
  width: 50%;
  label span {
    color: ${grey[700]};
    font-size: 12px;
    background-color: white;
    z-index: 10;
    margin-left: 8px;
    padding: 0 7px;
  }
`;

const InputError = styled.div`
  margin: 5px 0 0 8px;
  color: ${red[800]};
  font-size: 12px;
`;

const InputContainer = styled.div`
  border: 1px solid ${grey[100]};
  border-radius: 7px;
  display: flex;
  align-items: center;
  padding: 5px;
  margin-top: -8px;

  input {
    border: none;
    background: transparent;
  }

  input[type="text"] {
    height: 27px;
    padding: 0 5px;
    min-width: 70px;
    width: 80%;
  }
`;

const ColorPickerInput = ({
  colorInPalette,
  handleChange,
  colorInput,
  error,
  inputLabel
}: Props): ReactElement => {
  return (
    <ColorPicker>
      <label htmlFor={inputLabel}>
        <span>{inputLabel}</span>
        <InputContainer>
          <input
            id={inputLabel}
            type="text"
            onChange={handleChange}
            value={colorInput}
          />
          <span>{colorInPalette}</span>
          <input type="color" onChange={handleChange} value={colorInput} />
        </InputContainer>
      </label>
      <InputError>{error ? "Please enter a valid hex code" : ""}</InputError>
    </ColorPicker>
  );
};

export default ColorPickerInput;
