import CSS from "csstype";
import React, { ChangeEvent, ReactElement, useCallback } from "react";

import * as S from "../styled";

// eslint-disable-next-line prettier/prettier
import type { QueryParamChangeEvent } from "../types";

interface SliderSelectorProps {
  /**
   * The CSS class name(s) to apply to this element.
   */
  className?: string;
  /**
   * The contents of the contained <label> control. 
   * Also used as the aria label when high and low labels are provided.
   */
  label?: string;
  /**
   * The label for the right end of the slider.
   */
  labelHigh?: string;
  /**
   * The label for the left end of the slider
   */
  labelLow?: string;
  /**
   * The initial max value for the contained <input> control.
   */
  max: number;
  /**
   * The initial min value for the contained <input> control.
   */
  min: number;
  /**
   * A unique name for the setting.
   */
  name?: string;
  /**
   * Triggered when the value of the <input> control changes.
   */
  onChange?: (evt: QueryParamChangeEvent) => void;
  /**
   * How fine each step should be. Identical to html range step parameter.
   */
  step?: number
  /**
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
  /**
   * Value to set slider to.
   */
  value?: number
}

/**
 * A wrapper that includes an <input type="range" /> control and a <label> for the input control.
 */
export default function SliderSelector({
  className = null,
  max = 20,
  label = null,
  labelLow,
  labelHigh,
  min = 0,
  name = null,
  step = 1,
  onChange = null,
  value = 1,
  style,
}: SliderSelectorProps): ReactElement {
  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === "function") {
        onChange({
          [name]: evt.target.value
        });
      }
    },
    [onChange]
  );

  const id = `id-query-param-${name}`;

  return (
    <S.SliderSelector
      aria-label={label}
      className={className}
      role="group"
      style={style}
    >

      {/* The <div> elements below are here for the grid layout, see S.DropdownSelector. */}
      {!labelLow && !labelHigh && (
        <div>
          <S.SettingLabel aria-hidden="true" as="span">{label}</S.SettingLabel>
        </div>
      )}

      <div>
        <S.SettingLabel aria-hidden="true" as="span">
          {labelLow}
        </S.SettingLabel>
        <input
          aria-label={`${label}: ${labelLow} (${min}) - ${labelHigh} (${max})`}
          id={id}
          max={max}
          min={min}
          onChange={handleChange}
          step={step}
          type="range"
          value={value}
        />
        <S.SettingLabel aria-hidden="true" as="span" style={{ paddingLeft:0 }}>
          {labelHigh}
        </S.SettingLabel>
      </div>
    </S.SliderSelector>
  );
}
