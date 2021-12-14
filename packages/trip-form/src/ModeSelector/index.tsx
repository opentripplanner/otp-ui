import CSS from "csstype";
import React, { ReactElement, ReactNode, useCallback } from "react";

import * as S from "../styled";
import ModeButton from "../ModeButton";

/**
 * Describes a mode option in the mode selector.
 */
interface ModeOption {
  id: string;
  selected?: boolean;
  showTitle?: boolean;
  text: ReactNode;
  title?: string;
}

interface ModeSelectorOptions {
  primary?: ModeOption;
  secondary?: ModeOption[];
  tertiary?: ModeOption[];
}

interface ModeSelectorProps {
  /**
   * The CSS class name to apply to this element.
   */
  className?: string;
  /**
   * An object that defines the primary mode, and secondary and tertiary modes for the trip query.
   */
  modes: ModeSelectorOptions;
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

  const makeButton = option => (
    <ModeButton
      key={option.id}
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
