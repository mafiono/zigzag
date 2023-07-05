import React, { useState } from "react";
import PopUp from "./popup";
import { _t } from "../helpers";
import config from "../config";

function ConfirmPopUp(props) {
  const [openPopUp, setOpen] = useState(false),
    togglePopUp = () => setOpen((state) => !state),
    { trigger, heading, open, confirmFunction, closeFunction } = props;

  let closePopUp = closeFunction;

  if (!closePopUp) {
    closePopUp = () => setOpen(!openPopUp);
  }

  if (!open && !openPopUp) {
    return trigger ? <span onClick={closePopUp}>{trigger}</span> : null;
  }

  return (
    <>
      {trigger && <span onClick={togglePopUp}>{trigger}</span>}
      <PopUp closeHandler={closePopUp} fullContainer>
        <div className="overlay" onClick={closePopUp} />
        <div className="popup active">
          <div className="popup__box">
            <span className="popup__close_btn" onClick={closePopUp}>
              <img
                src={config.initialImgPath + "other/close-hover.svg"}
                alt=""
              />
            </span>
            <div className="popup__content">
              <span className="h2">{_t(heading)}</span>
              <div className="popup__login_option_box">
                <span
                  className="btn btn_short btn_green"
                  role="button"
                  onClick={closePopUp}
                >
                  {_t("No")}
                </span>
                <span
                  className="btn btn_short btn_yellow"
                  role="button"
                  onClick={confirmFunction}
                >
                  {_t("Yes")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PopUp>
    </>
  );
}

export default React.memo(ConfirmPopUp);
