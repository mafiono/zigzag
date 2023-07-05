import helpers, { _t } from "../../../helpers";
import request from "../../../request";
import config from "../../../config";

export const forgotPassword = async (closeFunction, formElement) => {
  if (!formElement) {
    return null;
  }
  let f = new FormData(formElement),
    email = f.get("email");

  if (!email) {
    return;
  }
  try {
    await request.make({ email }, "/player/password/reset");
    closeFunction();
    helpers.successMessage(_t("Password has been sent to your email address"));
  } catch (e) {
    helpers.errorMessage(e.message);
  }
};
export const loadRecaptcha = (loadFunc) => {
  window.onRecapthcaLoadCallback = loadFunc;

  var script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.id = "recaptcha-id";
  script.src = config.captchaUrl + "?onload=onRecapthcaLoadCallback";
  document.body.appendChild(script);
};
export const verifyCallback = (recaptchaToken) => {
  helpers.setCookie("grcpt", recaptchaToken, 0.5);
};

export const resetChaptchaFunction = (captcha) => {
  if (captcha) {
    captcha.reset();
    captcha.execute();
  }
};

export const submitHOC = (captcha, func, ...args) => {
  try {
    helpers.setCookie("grcpt", "", -1);

    if (captcha.current) {
      resetChaptchaFunction(captcha.current);
    }

    let interval = setInterval(() => {
      let result = helpers.getCookie("grcpt");

      if (result) {
        func(...args);
        clearInterval(interval);
      }
    }, 50);
  } catch (e) {
    console.log(e);
  }
};
