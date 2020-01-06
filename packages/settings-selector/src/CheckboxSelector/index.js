import React, { Component } from "react";
import PropTypes from "prop-types";

class CheckboxSelector extends Component {
  onChangeHandler = evt => {
    const { name, onChange } = this.props;

    if (onChange) {
      onChange({
        [name]: evt.target.checked
      });
    }
  };

  render() {
    const { className, label, name, style } = this.props;
    const id = `id-query-param-${name}`;
    let { value } = this.props;
    if (typeof value === "string") value = value === "true";

    return (
      <div className={className} style={style}>
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={this.onChangeHandler}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  }
}

CheckboxSelector.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  onChange: PropTypes.func
};

CheckboxSelector.defaultProps = {
  className: null,
  name: null,
  value: null,
  label: null,
  onChange: null
};

export default CheckboxSelector;
