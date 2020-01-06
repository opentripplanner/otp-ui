import React, { Component } from "react";
import PropTypes from "prop-types";
import Global from "core-js";

import DropdownSelectorWrap from "./styled";

class DropdownSelector extends Component {
  onChangeHandler = evt => {
    const val = evt.target.value;
    const { name, onChange } = this.props;

    if (onChange) {
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
          <label htmlFor={id}>{label}</label>
        </div>

        <div>
          <select id={id} value={value} onChange={this.onChangeHandler}>
            {options &&
              options.map((o, i) => (
                <option key={i} value={o.value}>
                  {o.text}
                </option>
              ))}
          </select>
        </div>
      </DropdownSelectorWrap>
    );
  }
}

DropdownSelector.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
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
