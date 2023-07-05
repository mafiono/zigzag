import React from "react";
import { _t } from "../helpers";

const Select = ({ text, options, name, onChangeTrigger }) => {
  const onChange = (e) => onChangeTrigger(e.currentTarget.value);

  return options.map((option, index) => {
    return (
      <label className="radio__item_label" key={index}>
        <input
          className="radio__input_item"
          type="radio"
          value={option.value}
          onChange={onChange}
          name={name}
          tabIndex="0"
          checked={text?.value === option.value}
        />
        <span className="radio__label_content">
          <span className="radio__label_circle" />
          <span className="radio__label_text">{_t(option.label)}</span>
        </span>
      </label>
    );
  });
};
// <option
// tabIndex="0"
// value={option.value}
// key={option.value}
// >
// {_t(option.label)}
// </option>

export default React.memo(Select);
