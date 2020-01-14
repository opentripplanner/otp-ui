import React, { Component } from "react";
import PropTypes from "prop-types";
import Global from "core-js";

import { SelectCtrl, DropdownSelectorWrap } from "./styled";
import { SettingLabel } from "../SettingLabel/styled";

/**
 * A wrapper that includes a <select> dropdown control and a <label> for the dropdown control.
 */
class DropdownSelector extends Component {
  onChangeHandler = evt => {
    const val = evt.target.value;
    const { name, onChange } = this.props;

    if (typeof onChange === "function") {
      onChange({
        [name]: Global.isNaN(val) ? val : parseFloat(val)
      });
    }
  };

  render() {
    const { className, label, name, options, style, value } = this.props;
    const id = `id-query-param-${name}`;

    return (
      <DropdownSelectorWrap className={className} style={style}>
        <div>
          <SettingLabel htmlFor={id}>{label}</SettingLabel>
        </div>

        <div>
          <SelectCtrl id={id} value={value} onChange={this.onChangeHandler}>
            {options &&
              options.map((o, i) => (
                <option key={i} value={o.value}>
                  {o.text}
                </option>
              ))}
          </SelectCtrl>
        </div>
      </DropdownSelectorWrap>
    );
  }
}

DropdownSelector.propTypes = {
  /**
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  /**
   * A unique name for the setting.
   */
  name: PropTypes.string,
  /**
   * The initially-selected value for the contained <select> control.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * The contents of the contained <label> control.
   */
  label: PropTypes.string,
  /**
   * A list of {text, value} options for the <select> control.
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  /**
   * Triggered when the value of the <select> control changes.
   * @param arg The data {name: value} for the selected option.
   */
  onChange: PropTypes.func
};

DropdownSelector.defaultProps = {
  className: null,
  name: null,
  value: null,
  label: null,
  options: null,
  onChange: null
};

export default DropdownSelector;
