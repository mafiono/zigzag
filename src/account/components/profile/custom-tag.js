import React from "react";
import { Field } from "formik";
import { _t } from "../../../helpers";
import countryData from "../../../other/components/countries";

import Calendar from "../../../utils-components/calendar";
import Phone from "../../../utils-components/phone-input";
import CustomSelect from "../../../utils-components/custom-select";
import Avatar from "../../../other/components/avatar/avatar";

let adultDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

function CustomTag({
  customTag,
  value,
  error,
  boxClassName,
  defaultValue,
  status,
  setValue,
  inputObject,
  field,
}) {
  switch (customTag) {
    case "avatar":
      return <Avatar SetFieldValue={setValue} value={value || defaultValue} />;
    case "calendar":
      boxClassName += " calendar-input";
      if (status && error) {
        boxClassName += " error_value";
      }

      return (
        <span className={boxClassName} data-err={error}>
          <Calendar
            selectedDate={value}
            maxDate={adultDate}
            placeholder={_t("Date of Birth")}
            dateFormat="MMMM d, yyyy"
            className="input_item"
            onChangeTrigger={setValue}
          />
          <span className="input_item_bg" />
        </span>
      );
    case "countrySelect":
      return (
        <label className={boxClassName} data-err={error}>
          <span className="input_item_select_box">
            <Field
              component="select"
              name="country"
              className="input_item_select"
            >
              {countryData.map(({ alpha2Code, name }, index) => (
                <option value={alpha2Code} key={index}>
                  {name}
                </option>
              ))}
            </Field>
          </span>
          <span className="input_item_bg" />
        </label>
      );
    case "phoneInput":
      let phoneInput = boxClassName + " phone-input-value";

      return (
        <span className={phoneInput} key={field}>
          <Phone value={value} onChangeTrigger={setValue} />
          <span className="input_item_bg" />
        </span>
      );
    case "customSelect":
      let text = inputObject.option.filter(
        (option) => option.value === value
      )?.[0];
      return (
        <div className="radio__item_box" data-err={error}>
          <b>{_t(inputObject.placeholder)}</b>
          <CustomSelect
            text={_t(text)}
            key={field}
            name={field}
            value={value}
            onChangeTrigger={setValue}
            options={inputObject.option}
          />
        </div>
      );
    default:
      return null;
  }
}

export default CustomTag;
