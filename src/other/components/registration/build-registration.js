import React from "react";
import CustomTag from "./custom-tag";
import { Field } from "formik";
import StandartField from "./standart-field";
import userValidator from "../../../other/user/validator";
import { _t } from "../../../helpers";

function BuildRegistration(formProps) {
  const { field, errors, touched, setFieldValue, values, status } = formProps;

  let inputObject = userValidator.methodFields.registration[field],
    { required, type, defaultValue, label, customTag, labelHtml } = inputObject,
    boxClassName = "input_item_label";

  if (inputObject.hidden) {
    return null;
  }
  if (errors[field] && touched[field]) {
    boxClassName += " error";
  }

  if (touched[field] && !errors[field]) {
    boxClassName += " ok";
  }

  if (type === "checkbox") {
    const checkboxLabel = labelHtml ? (
      <span
        dangerouslySetInnerHTML={{
          __html: _t(label, { "{{casino}}": "ZigZagSport" }),
        }}
      />
    ) : (
      <span>{_t(label)}</span>
    );

    return (
      <label
        className="checkbox_item_label"
        key={field}
        data-error={errors[field]}
      >
        <Field
          className="checkbox_input_item"
          type="checkbox"
          checked={values[field]}
          name={field}
          tabIndex={1}
          required={required || false}
        />
        <span className="checkbox_label_content">
          <span className="checkbox_label_square" />
          <span className="checkbox_label_text">{checkboxLabel}</span>
        </span>
      </label>
    );
  }

  if (type === "custom") {
    return (
      <CustomTag
        customTag={customTag}
        fieldKey={field}
        key={field}
        value={values[field]}
        error={errors[field]}
        touched={touched[field]}
        defaultValue={defaultValue}
        boxClassName={boxClassName}
        status={status}
        setValue={setFieldValue.bind(null, field)}
        inputObject={inputObject}
      />
    );
  }
  return (
    <label className={boxClassName} key={field} data-error={errors[field]}>
      <StandartField
        inputObject={inputObject}
        labelClassName={boxClassName}
        fieldKey={field}
      />
    </label>
  );
}

export default BuildRegistration;
