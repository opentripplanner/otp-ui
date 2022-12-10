import CSS from "csstype";
import React, { ChangeEvent, ReactElement, useCallback } from "react";

import * as S from "../styled";

// eslint-disable-next-line prettier/prettier
import type { QueryParamChangeEvent } from "../types";

const StyledInput = styled.input`
  appearance: none;
  cursor: pointer;
  height: 24px;
  width: 52px;
  border-radius: 12px;
  display: inline-block;
  position: relative;
  margin: 0;
  border: 1px solid #474755;
  background: linear-gradient(180deg, #2d2f39 0%, #1f2027 100%);
  transition: all 0.2s ease;
  &:after {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 2px rgba(44, 44, 44, 0.2);
    transition: all 0.2s cubic-bezier(0.5, 0.1, 0.75, 1.35);
  }
  &:checked {
    border-color: #654fec;
    &:after {
      transform: translatex(28px);
    }
  }
  &:focus {
    outline: 0;
  }
`;

interface CheckboxSelectorProps {
  /**
   * The CSS class name(s) to apply to this element.
   */
  className?: string;
  /**
   * The contents of the contained <label> control.
   */
  label?: ReactElement | string;
  /**
   * A unique name for the setting.
   */
  name?: string;
  /**
   * Triggered when the value of the <input> control changes.
   */
  onChange?: (evt: QueryParamChangeEvent) => void;
  /**
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
  /**
   * The initial value for the contained <input> control.
   */
  value?: string | boolean;
}

/**
 * A wrapper that includes an <input type="select" /> control and a <label> for the input control.
 */
export default function CheckboxSelector({
  className = null,
  label = null,
  name = null,
  onChange = null,
  style,
  value = null
}: CheckboxSelectorProps): ReactElement {
  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === "function") {
        onChange({
          [name]: evt.target.checked
        });
      }
    },
    [onChange]
  );

  const id = `id-query-param-${name}`;
  const finalValue = typeof value === "string" ? value === "true" : value;

  return (
    <div className={className} style={style}>
      <input
        id={id}
        type="checkbox"
        checked={finalValue}
        onChange={handleChange}
      />
      <S.SettingLabel htmlFor={id}>{label}</S.SettingLabel>
    </div>
  );
}

export function PillCheckboxSelector({
  className = null,
  label = null,
  name = null,
  onChange = null,
  style,
  value = null
}: CheckboxSelectorProps): ReactElement {

  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === "function") {
        onChange({
          [name]: evt.target.checked
        });
      }
    },
    [onChange]
  );

  const id = `id-query-param-${name}`;
  const finalValue = typeof value === "string" ? value === "true" : value;

  return (
    <div className={className} style={style}>
      <StyledInput
        id={id}
        type="checkbox"
        checked={finalValue}
        onChange={handleChange}
      />
      <S.SettingLabel htmlFor={id}>{label}</S.SettingLabel>
    </div>
  );
}