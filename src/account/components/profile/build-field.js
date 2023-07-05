import React from "react";
import CustomTag from "./custom-tag";
import StandartField from "./standart-field";
import userValidator from "../../../other/user/validator";
import countryData from "../../../other/components/countries";
import moment from "moment";
import { _t } from "../../../helpers";

function BuildField(formProps) {
  const { field, errors, touched, userData, setFieldValue, values } = formProps;

  let inputObject = userValidator.methodFields.edit[field];
  const SetFieldValueBind = setFieldValue.bind(null, field);

  let boxClassName = "input_item_label";

  if (inputObject.hidden) {
    return null;
  }
  if (errors[field] && touched[field]) {
    boxClassName += " error";
  }

  let { type, label, placeholder, option, customTag } = inputObject;

  if (userData[field]) {
    let value = userData[field];
    if (option) {
      value = inputObject.option.filter(
        (option) => option.value === values[field]
      )[0];
      if (value) {
        value = value.label;
      }
    }
    if (field === "country") {
      try {
        value = countryData.filter(
          (country) => country.alpha2Code === userData[field]
        )[0].name;
      } catch (e) {
        console.log(e.message);
      }
    }
    let val = type === "custom" ? _t(value) : value;
    if (field === "birthDay") {
      val = moment(value).format("YYYY-MM-DD");
    }
    return (
      <label className="input_item_label disable" key={field}>
        <input
          type={type || "text"}
          name={field}
          placeholder={_t(label)}
          className="input_item"
          value={val}
          readOnly
          disabled
        />
        <span className="input_item_bg" />
      </label>
    );
  }

  if (type === "custom") {
    return (
      <CustomTag
        key={field}
        field={field}
        customTag={customTag}
        value={values[field]}
        placeholder={placeholder}
        setValue={SetFieldValueBind}
        boxClassName={boxClassName}
        inputObject={inputObject}
        defaultValue={userValidator.methodFields.edit[field]["defaultValue"]}
      />
    );
  }

  return (
    <label className={boxClassName} key={field} data-error={errors[field]}>
      <StandartField key={field} fieldKey={field} inputObject={inputObject} />
    </label>
  );
}

export default BuildField;
