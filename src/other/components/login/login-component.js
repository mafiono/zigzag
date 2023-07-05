import React from "react";
import { _t } from "../../../helpers";
import { submitHOC } from "./login-helpers";
import SocialBlock from "../../../other/components/social-block";
import userHelper from "../../../userHelper";
import userValidator from "../../user/validator";
import user from "../../user";

import { Formik, Form, Field } from "formik";

const keyDownConfirm = (handleSubmit, e) =>
  ~[13].indexOf(e.keyCode) ? handleSubmit() : null;

function LoginComponent(props) {
  const { openPassword } = props,
    handleLogin = user.handleLogin.bind(null, props.history),
    loginSubmit = submitHOC.bind(null, props.captcha, handleLogin);

  return (
    <div className="popup__content">
      <span className="h2">{props.noPopUp ? "" : _t("Login")}</span>
      <SocialBlock onListClick={props.socialLogin} alwaysHover />
      <Formik
        initialValues={{ loginOrEmail: "", passwordLogin: "", remember: false }}
        onSubmit={loginSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validate={userValidator.methodValidator.login}
      >
        {({
          isSubmitting,
          errors,
          handleSubmit,
          setFieldValue,
          values,
          touched,
        }) => {
          const isMobile = userHelper.getUserProp("isMobile"),
            keyDown = keyDownConfirm.bind(null, handleSubmit);

          if (isMobile && !values["remember"]) {
            setFieldValue("remember", true);
          }
          return (
            <Form className="popup__login_form">
              <fieldset>
                <label className="input_item_label">
                  <Field
                    type="text"
                    name="loginOrEmail"
                    id="loginOrEmail"
                    placeholder={_t("Login or Email")}
                    className="input_item"
                    required
                  />
                  <span className="input_item_bg"></span>
                </label>
                <label className="input_item_label">
                  <Field
                    type="password"
                    id="passwordLogin"
                    name="passwordLogin"
                    className="input_item"
                    placeholder={_t("Password")}
                    onKeyDown={keyDown}
                    required
                  />
                  <span className="input_item_bg"></span>
                </label>
                <div className="popup__login_option_box">
                  <label
                    className={`checkbox_item_label${
                      isMobile ? " hidden" : ""
                    }`}
                  >
                    <Field
                      type="checkbox"
                      name="remember"
                      className="checkbox_input_item"
                    />
                    <span className="checkbox_label_content">
                      <span className="checkbox_label_square"></span>
                      <span className="checkbox_label_text">
                        {_t("Remember me")}
                      </span>
                    </span>
                  </label>
                  <span
                    className="popup__open_btn"
                    id="remember_popup_trigger"
                    onClick={openPassword}
                  >
                    {_t("Forgot password?")}
                  </span>
                </div>
              </fieldset>
              <span
                className="btn btn_green"
                role="button"
                type="submit"
                onClick={isSubmitting ? null : handleSubmit}
                id="enter_btn"
              >
                {_t("Login")}
              </span>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
export default LoginComponent;
