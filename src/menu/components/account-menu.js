import React, { useState, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import config from "../../config";
import { useHistory } from "react-router-dom";
import { logoutFunction } from "../../helpers";
import ConfirmPopUp from "../../utils-components/confirm-pop-up";
import buildNavigation from "./account-menu/build-navigation";

function AccountMenu(props) {
  const { online, language } = props,
    [logout, setLogout] = useState(false),
    offLogout = useCallback(() => setLogout(false), [setLogout]),
    history = useHistory(),
    navigation = useMemo(
      () => buildNavigation(language, history, setLogout),
      [language]
    );

  if (!online) {
    return;
  }

  return (
    <div className="widget active">
      <div className="widget__box">
        <span className="widget__close_btn" onClick={props.toggleAccountMenu}>
          <img
            src={config.initialImgPath + "other/back-menu.svg"}
            alt=""
            className="widget__close_btn_img"
          />
        </span>
        <div className="widget__content">
          <nav className="user_nav">
            <ul className="user_nav__list">
              {navigation.map((elem) => {
                let elemClassName = "user_nav__link";

                if (elem.isActive) {
                  elemClassName += " active";
                }
                return (
                  <li className="user_nav__item" key={elem.label}>
                    <a className={elemClassName} onClick={elem.onClick}>
                      {elem.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
      <ConfirmPopUp
        open={logout}
        closeFunction={offLogout}
        confirmFunction={logoutFunction}
        heading="leaving already?"
      />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    online: state.UserReducers.online,
    language: state.UserReducers.language,
  };
};

export default connect(mapStateToProps)(React.memo(AccountMenu));
