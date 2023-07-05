import React from "react";
import { useSelector } from "react-redux";
import config from "../../config";
import { _t } from "../../helpers";

function UpdateMessage(props) {
  const lang = useSelector((state) => state.UserReducers.language),
    reload = () => {
      props.closeFunction();
      window?.localStorage?.clear();
      window.location.reload();
    };

  return [
    <div className="overlay" onClick={props.closeFunction} key="overlay" />,
    <div className="popup active">
      <div className="popup__box">
        <span className="popup__close_btn" onClick={props.closeFunction}>
          <img src={config.initialImgPath + "other/close-hover.svg"} alt="" />
        </span>
        <div className="popup__content">
          <span className="h2">{_t("An update is available")}</span>
          <p className="text-center">
            {_t("Click on YES to refresh the page")}
            <br />
            {_t("Click on NO to postpone the page reload")}
          </p>
          <div className="popup__login_option_box">
            <span
              className="btn btn_short btn_green"
              role="button"
              onClick={props.closeFunction}
            >
              {_t("No")}
            </span>
            <span
              className="btn btn_short btn_yellow"
              role="button"
              onClick={reload}
            >
              {_t("Yes")}
            </span>
          </div>
        </div>
      </div>
    </div>,
  ];
}

export default UpdateMessage;
