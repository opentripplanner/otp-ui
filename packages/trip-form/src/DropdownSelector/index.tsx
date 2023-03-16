import CSS from "csstype";
import React, { ReactElement, useCallback } from "react";
import Select  from "react-select";
import * as S from "../styled";
// eslint-disable-next-line prettier/prettier
import type { QueryParamChangeEvent } from "../types";

interface DropdownSelectorProps {
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
   * Triggered when the value of the <select> control changes.
   * @param arg The data {name: value} for the selected option.
   */
  onChange?: (evt: QueryParamChangeEvent) => void;
  /**
   * A list of {text, value} options for the <select> control.
   */
  options: {
    text: string;
    value: string | number;
  }[];
  /**
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
  /**
   * The initially-selected value for the contained <select> control.
   */
  value?: string | number;
}

type TransformedOption = {
    label: string | number;
    value: string | number;
 }

/**
 * A wrapper that includes a <select> dropdown control and a <label> for the dropdown control.
 */
export default function DropdownSelector({
  className = null,
  label = null,
  name = null,
  onChange = null,
  options = null,
  style = null,
  value = null
}: DropdownSelectorProps): ReactElement {
  const handleChange = useCallback(
    (evt: TransformedOption) => {
      if (typeof onChange === "function") {
        const val: string = evt.value.toString();
        const floatVal = parseFloat(val);
        onChange({
          [name]: Number.isNaN(floatVal) ? val : floatVal
        });
      }
    },
    [onChange]
  );

  const id = `id-query-param-${name}`;
  const transformedOptions: TransformedOption[] = options.map(option => ({
    label: option.text,
    value: option.value
  }));

  return (
    <S.DropdownSelector className={className} style={style}>
      {/* The <div> elements below are here for the grid layout, see S.DropdownSelector. */}
      <div>
        <S.SettingLabel htmlFor={id}>{label}</S.SettingLabel>
      </div>

      <div>
        <Select
        defaultValue={transformedOptions.find(option => option.value === value)}
        isClearable={false}
        isSearchable={false}
        onChange={(option: TransformedOption) => handleChange(option)}
        options={transformedOptions}
      />
      </div>
    </S.DropdownSelector>
  );
}
