import React from "react";
import helpers from "../../../helpers";
const _t = helpers.translate.getTranslation;

function AdditionalFields({ values, extra, setFieldValue, lang }) {
  if (extra.type === "input") {
    return extra.data.map((input, index) => {
      if (input.rules.type === "hidden") {
        return null;
      }
      function changeFunction(e) {
        let val = e.currentTarget.value,
          newExtra = [...values];
        newExtra.splice(index, 1, { name: input.rules.name, value: val });
        setFieldValue("extra", newExtra);
      }
      let element = values.filter((key) => key.name === input.rules.name)[0];

      if (element) {
        element = element.value;
      }
      return (
        <React.Fragment key={index}>
          <div className="money_value_input__bonus_text_box">
            {input.rules.placeholder[lang] ||
              _t(input.rules.placeholder["en"]) ||
              ""}
          </div>
          <label className="input_item_label">
            <input
              type={input.rules.type || "text"}
              pattern={input.rules.pattern || undefined}
              maxLength={input.rules.maxlength || "30"}
              value={element || ""}
              className="input_item"
              name={input.rules.name}
              id={input.rules.name}
              placeholder={
                input.rules.label[lang] || _t(input.rules.label["en"]) || ""
              }
              tabIndex="0"
              onChange={changeFunction}
              required
            />
            <span className="input_item_bg" />
          </label>
        </React.Fragment>
      );
    });
  }
  return null;
}

export default AdditionalFields;
