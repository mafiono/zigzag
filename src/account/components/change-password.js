import React from "react";
import { Formik, Field, Form } from "formik";
import { _t } from "../../helpers";
import user from "../../other/user";
import validator from "./change-password/validator";

let fields = {
    oldPassword: "",
    newPassword: "",
    retype: "",
  },
  translations = {
    oldPassword: "Old password",
    newPassword: "New password",
    retype: "Confirm password",
  };
function PasswordForm(props) {
  return (
    <div className="main__body">
      <h2 className="h_decor">{_t("Change password")}</h2>
      <div className="main__bg">
        <Formik
          initialValues={fields}
          onSubmit={user.changePassword}
          validate={validator}
        >
          {({ values, errors, touched, handleSubmit, isSubmitting }) => (
            <Form className="account__form">
              {Object.keys(fields).map((field) => {
                let labelClassName = "input_item_label";

                if (errors[field]) {
                  labelClassName += " error";
                } else if (touched[field]) {
                  labelClassName += " ok";
                }
                return (
                  <label
                    className={labelClassName}
                    key={field}
                    data-error={errors[field]}
                  >
                    <Field
                      name={field}
                      placeholder={_t(translations[field])}
                      type="password"
                      className="input_item"
                    />
                    <span className="input_item_bg" />
                  </label>
                );
              })}
              <div className="account__submit_box">
                <label>
                  <input type="submit" className="hidden" value="" />
                  <span className="btn btn_big btn_green">{_t("Save")}</span>
                </label>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default React.memo(PasswordForm);
