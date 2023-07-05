import React, { useRef } from "react";
import { forgotPassword, submitHOC } from "./login-helpers";
import config from "../../../config";
import { _t } from "../../../helpers";

export default function ResetPasswordForm(props) {
  const submitPassword = forgotPassword.bind(null, props.closeFunction),
    formElement = useRef(null),
    submitForm = (e) => {
      e.preventDefault();
      submitHOC(props.captcha, submitPassword, formElement.current);
    };

  return (
    <div className="popup__content">
      <span
        className={props.noPopUp ? "" : "sub_menu__close_btn"}
        onClick={props.backTo}
      >
        <img
          src={config.initialImgPath + "other/back-menu.svg"}
          alt=""
          className="sub_menu__close_btn_img"
        />
      </span>
      <span className="h2">{_t("please enter your email address")}</span>
      <form
        onSubmit={submitForm}
        className="log_reg_enter_form"
        ref={formElement}
      >
        <fieldset>
          <label className="input_item_label ok">
            <input
              type="email"
              name="email"
              placeholder={_t("Email")}
              className="input_item"
              required
            />
            <span className="input_item_bg"></span>
          </label>
          <label className="btn btn_green">
            <input
              style={{ display: "none", visibility: "hidden" }}
              type="submit"
            />
            {_t("Send")}
          </label>
        </fieldset>
      </form>
    </div>
  );
}
