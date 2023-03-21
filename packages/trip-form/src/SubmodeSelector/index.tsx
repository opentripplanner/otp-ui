import CSS from "csstype";
import React, { ReactElement } from "react";

import ModeButton from "../ModeButton";
import * as S from "../styled";

// eslint-disable-next-line prettier/prettier
import type { ModeSelectorOption } from "../types";

interface SubmodeSelectorProps {
  /**
   * The CSS class name to apply to this element.
   */
  className?: string;
  /**
   * Determines how the label and mode buttons are displayed.
   */
  inline?: boolean;
  /**
   * The optional text to display before the submodes.
   */
  label?: string;
  /**
   * An array of submodes for the trip query, i.e. transit modes, TNC, or rental companies.
   */
  modes?: ModeSelectorOption[];
  /**
   * Triggered when the user toggles a submode.
   * @param id The id of the option clicked.
   */
  onChange: (id: string) => void;
  /**
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
}

/**
 * SubmodeSelector is the control container where the OTP user selects
 * the submodes (e.g. train, bus) for transit, or the providers for TNC and rental companies.
 */
export default function SubmodeSelector({
  className = null,
  inline = false,
  label = null,
  modes = null,
  onChange = null,
  style = null
}: SubmodeSelectorProps): ReactElement {
  const LabelType = inline ? S.FloatingSettingLabel : S.SettingLabel;
  const RowType = inline
    ? S.SubmodeSelector.InlineRow
    : S.SubmodeSelector.Row;

  return (
    <S.SubmodeSelector
      aria-label={label}
      className={className}
      role="group"
      style={style}
    >
      {label && <LabelType aria-hidden="true" as="span">{label}</LabelType>}
      <RowType>
        {modes &&
          modes.map(option => (
            <ModeButton
              aria-pressed={option.selected}
              key={option.id}
              selected={option.selected}
              showTitle={false}
              title={option.title}
              onClick={() => onChange(option.id)}
            >
              {option.text}
            </ModeButton>
          ))}
      </RowType>
    </S.SubmodeSelector>
  );
}
