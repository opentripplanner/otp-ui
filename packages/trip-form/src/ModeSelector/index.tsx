import CSS from "csstype";
import React, { ReactElement, useCallback } from "react";

import * as S from "../styled";
import ModeButton from "../ModeButton";

import { ModeSelectorOption, ModeSelectorOptionSet } from "../types";

interface ModeSelectorProps {
  /**
   * The CSS class name to apply to this element.
   */
  className?: string;
  /**
   * An object that defines the primary mode, and secondary and tertiary modes for the trip query.
   */
  modes: ModeSelectorOptionSet;
  /**
   * Triggered when the user selects a different mode.
   * @param id The id of the new option clicked.
   */
  onChange: (InputEvent) => void;
  /**
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
}

/**
 * ModeSelector is the control container where the OTP user selects
 * the transportation modes for a trip query, e.g. transit+bike, walk, micromobility...
 */
export default function ModeSelector({
  className = null,
  modes = null,
  onChange = null,
  style = null
}: ModeSelectorProps): ReactElement {
  const { primary, secondary, tertiary } = modes || {
    primary: null,
    secondary: null,
    tertiary: null
  };
  const handleClick = useCallback(
    option => {
      if (!option.selected && typeof onChange === "function") {
        onChange(option.id);
      }
    },
    [onChange]
  );

  const makeButton = (option: ModeSelectorOption): ReactElement => (
    <ModeButton
      key={option.id}
      uniqueId={option.id}
      selected={option.selected}
      showTitle={option.showTitle}
      title={option.title}
      onClick={() => handleClick(option)}
    >
      {option.text}
    </ModeButton>
  );

  return (
    <S.ModeSelector className={className} style={style}>
      {primary && (
        <S.ModeSelector.MainRow>{makeButton(primary)}</S.ModeSelector.MainRow>
      )}

      {secondary && (
        <S.ModeSelector.SecondaryRow>
          {secondary.map(makeButton)}
        </S.ModeSelector.SecondaryRow>
      )}
      {tertiary && (
        <S.ModeSelector.TertiaryRow>
          {tertiary.map(makeButton)}
        </S.ModeSelector.TertiaryRow>
      )}
    </S.ModeSelector>
  );
}
