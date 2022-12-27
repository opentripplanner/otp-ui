import CSS from "csstype";
import React, { ChangeEvent, ReactElement, useCallback } from "react";

import * as S from "../styled";

// eslint-disable-next-line prettier/prettier
import type { QueryParamChangeEvent } from "../types";

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