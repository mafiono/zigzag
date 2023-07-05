import React, { useState, useEffect, useRef } from "react";
import ReCaptcha from "../../other/components/recaptcha";
import { connect } from "react-redux";
import {
  submitHOC,
  verifyCallback,
  resetChaptchaFunction,
} from "./login/login-helpers";
import { Redirect, useHistory } from "react-router-dom";
import ForgotPasswordForm from "./login/forgot-password";
import config from "../../config";
import LoginComponent from "./login/login-component";
import loader from "../../other/loader";

import { useRecaptchaLoad } from "../../helpers";
let isMounted = false;

function LoginPopUp(props) {
  const { online, closePopUp } = props,
    [capthcaLoad, setCaptchaLoading] = useState(
      document.getElementById("recaptcha-id")
    ),
    [forgetPassword, togglePasswordComponent] = useState(false),
    captcha = useRef(null),
    resetCaptcha = resetChaptchaFunction.bind(null, captcha.current),
    history = useHistory(),
    backFunction = () => {
      if (isMounted) {
        togglePasswordComponent(false);
      }
    },
    openPassword = () => {
      if (isMounted) {
        togglePasswordComponent(true);
      }
    },
    onLoadCallBack = () => {
      resetCaptcha();
      setCaptchaLoading(true);
    };

  let popUpClassNames = ["popup active", "popup"];

  if (forgetPassword) {
    popUpClassNames.reverse();
  }

  async function loginThroughSocial(name) {
    window.location.href = "/api/oauth/" + name;
    return null;
  }

  const socialLogin = submitHOC.bind(null, captcha, loginThroughSocial);

  useRecaptchaLoad(onLoadCallBack);

  useEffect(() => {
    if (capthcaLoad) {
      loader.hide();
    } else {
      loader.show();
    }
  }, [capthcaLoad]);

  useEffect(() => {
    isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  if (!capthcaLoad) {
    return null;
  }

  if (online) {
    return <Redirect to={"/" + props.language} />;
  }
  let overlayClassName = "overlay",
    popUpContainer = "popup__container",
    popupBox = "popup__box";

  if (props.noPopUp) {
    overlayClassName = "";
    popUpContainer = "";
    popupBox = "";

    if (forgetPassword) {
      popUpClassNames = ["hidden", ""];
    } else {
      popUpClassNames = ["", "hidden"];
    }
  }
  return (
    <div className={popUpContainer}>
      <div className={overlayClassName} onClick={props.closePopUp} />
      <div className={popUpClassNames[0]}>
        <div className={popupBox}>
          <span className="popup__close_btn" onClick={closePopUp}>
            <img src={config.initialImgPath + "other/close-hover.svg"} alt="" />
          </span>
          <LoginComponent
            closeFunction={closePopUp}
            captcha={captcha}
            history={history}
            noPopUp={props.noPopUp}
            socialLogin={socialLogin}
            openPassword={openPassword}
          />
        </div>
      </div>
      <div className={popUpClassNames[1]}>
        <div className={popupBox}>
          <span className="popup__close_btn" onClick={closePopUp}>
            <img src={config.initialImgPath + "other/close-hover.svg"} alt="" />
          </span>
          <ForgotPasswordForm
            active={forgetPassword}
            closeFunction={closePopUp}
            noPopUp={props.noPopUp}
            captcha={captcha}
            backTo={backFunction}
          />
        </div>
      </div>
      <div>
        <ReCaptcha
          captcha={captcha}
          onloadCallback={resetCaptcha}
          verifyCallback={verifyCallback}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    online: state.UserReducers.online,
    language: state.UserReducers.language,
  };
};

export default connect(mapStateToProps)(React.memo(LoginPopUp));
