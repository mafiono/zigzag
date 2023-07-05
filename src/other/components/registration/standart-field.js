import React from "react";
import { Field } from "formik";
import { _t } from "../../../helpers";

function StandartField(props) {
  const { inputObject, fieldKey } = props,
    { required, type, label, pattern, placeholder, option } = inputObject;
  if (option) {
    return (
      <span className="input_item_select_box">
        <Field
          component="select"
          name={fieldKey}
          className="input_item_select"
          placeholder={_t(placeholder)}
          required={required}
        >
          {option.map((radio, index) => (
            <option value={radio.value}>{_t(radio.label)}</option>
          ))}
        </Field>
      </span>
    );
  }

  return (
    <>
      <Field
        type={type || "text"}
        name={fieldKey}
        pattern={pattern}
        placeholder={_t(label)}
        className="input_item"
        required={!!required}
      />
      <span className="input_item_bg" />
    </>
  );
}
export default StandartField;
