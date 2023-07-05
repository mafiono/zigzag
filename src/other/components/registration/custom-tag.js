import React from "react";
import { Field } from "formik";
import { _t } from "../../../helpers";
import countryData from "../countries";
import config from "../../../config";

import Calendar from "../../../utils-components/calendar";
import Phone from "../../../utils-components/phone-input";
import CustomSelect from "../../../utils-components/custom-select";
import Avatar from "../avatar/avatar";
import userModel from "../../../other/user";

let adultDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

function CustomTag({
  customTag,
  fieldKey,
  value,
  touched,
  error,
  boxClassName,
  defaultValue,
  status,
  setValue,
  inputObject,
}) {
  switch (customTag) {
    case "avatar":
      return <Avatar SetFieldValue={setValue} value={value || defaultValue} />;
    case "calendar":
      return (
        <span
          className={boxClassName + " calendar-input registration"}
          data-err={error}
        >
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
      let countries = [...countryData];

      /*if(window.location.host === config.mainSitePath){
                countries = countries.filter(c => (
                    !config.mainSiteRestrictedCountries.includes(c.alpha2Code)
                ))
            }*/
      const countryOnChange = (e) => {
        let val = e.currentTarget.value;
        setValue(val);
        userModel.getAvaibleCurrencies(val);
      };
      return (
        <label className={boxClassName} data-err={error}>
          <span className="input_item_select_box">
            <select
              name="country"
              className="input_item_select"
              onChange={countryOnChange}
              value={value}
            >
              {countries.flatMap(({ alpha2Code, name }, index) => {
                const skip =
                  config.allSitesRestrictedCountries.includes(alpha2Code) ||
                  (window.location.host === config.mainSitePath &&
                    config.mainSiteRestrictedCountries.includes(alpha2Code));

                return skip ? (
                  []
                ) : (
                  <option value={alpha2Code} key={index}>
                    {name}
                  </option>
                );
              })}
            </select>
          </span>
          <span className="input_item_bg" />
        </label>
      );
    case "phoneInput":
      let phoneInput = boxClassName + " phone-input-value";

      return (
        <span className={phoneInput} key={fieldKey}>
          <Phone value={value} onChangeTrigger={setValue} />
          <span className="input_item_bg" />
        </span>
      );
    case "currency":
      const onChange = (e) => setValue(e.currentTarget.value, true);

      return (
        <label
          className={`input_item_label${error ? " error" : ""}`}
          data-error={error}
        >
          <span className="input_item_select_box">
            <select
              name="currency"
              className="input_item_select"
              onChange={onChange}
              value={value}
            >
              <option value="" disabled>
                {_t("Choose the currency")}
              </option>
              {inputObject.option.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="input_item_select__center-text">
              {value.toUpperCase() || _t(inputObject.placeholder)}
            </span>
          </span>
        </label>
      );
    case "customSelect":
      let text = inputObject.option.filter(
        (option) => option.value === value
      )?.[0];
      return [
        <div className="radio__item_box" data-err={error}>
          <b>{_t(inputObject.placeholder)}</b>
          <CustomSelect
            text={_t(text)}
            key={fieldKey}
            name={fieldKey}
            value={value}
            onChangeTrigger={setValue}
            options={inputObject.option}
          />
        </div>,
        <div className="currency-error">{touched && error}</div>,
      ];
    default:
      return null;
  }
}

export default CustomTag;
