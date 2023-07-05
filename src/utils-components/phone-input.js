import React from "react";
import "react-phone-number-input/style.css";
import Input, { getCountries } from "react-phone-number-input/input";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { getCountryCallingCode } from "react-phone-number-input";
import { _t } from "../helpers";
import userHelper from "../userHelper";
import "./css/phone.scss";

export default function Phone({ customPlaceholder, value, onChangeTrigger }) {
  const userCountry = userHelper.getUserProp("countryCode"),
    countries = getCountries(),
    defaultCountry =
      userCountry && userCountry !== "00" ? userCountry : countries[0];

  const [country, setCountry] = React.useState(defaultCountry);

  const changeCountry = (e) => {
    setCountry(e.target.value || undefined);
    onChangeTrigger("");
  };
  return (
    <div className="phone-input-custom input_box">
      <select
        value={country}
        className="phone-input-custom__select"
        onChange={changeCountry}
      >
        {countries.map((c) => {
          return (
            <option key={c} value={c}>
              {getUnicodeFlagIcon(c)}
              {"  +" + getCountryCallingCode(c)}
            </option>
          );
        })}
      </select>
      <Input
        value={value}
        placeholder={customPlaceholder || _t("Phone")}
        country={country}
        className="phone-input-custom__input"
        onChange={(v) => onChangeTrigger(v || "")}
        international
        withCountryCallingCode
        displayInitialValueAsLocalNumber
      />
    </div>
  );
}
