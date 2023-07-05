import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { _t, usePreventScroll, toggleState } from "../../helpers";
import { useLocation, Link } from "react-router-dom";
import InfoTop from "./userbox/info-top";
import AccountMenu from "../../menu/components/account-menu";
import config from "../../config";
import history from "../../history";

const initialPath =
    config.common.s3CloudFrontAssets + config.common.assets.img.path,
  avatarsPath = initialPath + config.avatars.avatarPath + "/";

let previousLocation = {};

function UserBox(props) {
  const { online, lang } = props,
    [accountMenu, setAccountMenu] = useState(false),
    toggleAccountMenu = toggleState(setAccountMenu),
    location = useLocation();

  usePreventScroll(accountMenu);

  useEffect(() => {
    if (
      accountMenu &&
      location.search === "?fast-deposit" &&
      previousLocation.search === "?fast-deposit"
    ) {
      history.push(location.pathname);
    }
  }, [location, accountMenu]);

  useEffect(() => {
    if (previousLocation.search !== "?fast-deposit") {
      setAccountMenu(false);
    }
    previousLocation = location;
  }, [location]);

  useEffect(() => {
    if (props.showSearch) {
      setAccountMenu(false);
    }
  }, [props.showSearch]);

  if (!online) {
    return (
      <div className="client_box">
        <div className="registration_box">
          <Link
            className="registration_box__login_btn"
            to={location.pathname + "?login"}
          >
            <span>{_t("Login")}</span>
            <img
              src={config.initialImgPath + "other/enter-arrow.svg"}
              alt=""
              className="registration_box__login_line_img"
            />
          </Link>
          <Link className="btn user_box__btn" to={"/" + lang + "/registration"}>
            {_t("Registration")}
          </Link>
        </div>
      </div>
    );
  }
  const avatarPath =
    avatarsPath +
    (props.userData?.customData?.avatar || config.avatars.baseAvatar);

  return (
    <div className="client_box">
      <div className="user_box">
        <div className="user_box__info">
          <InfoTop
            userData={props.userData}
            isSport={props.isSport}
            toggleAccountMenu={toggleAccountMenu}
          />
          <div className="user_box__info_bottom">
            <div className="user_box__avatar_box">
              <Link
                to="?fast-deposit"
                className="btn user_box__btn fast_deposit_btn"
              >
                {_t("Deposit")}
              </Link>
            </div>
          </div>
        </div>
        <div className="user_box__img_box" onClick={toggleAccountMenu}>
          <img src={avatarPath} className="user_box__avatar_img" alt="" />
        </div>
      </div>
      {accountMenu && (
        <div>
          <div className="overlay custom" onClick={toggleAccountMenu} />
          <AccountMenu toggleAccountMenu={toggleAccountMenu} />
        </div>
      )}
    </div>
  );
}

const mapState = (state) => ({
  online: state.UserReducers.online,
  userData: state.UserReducers.userData,
  isSport: state.UserReducers.isSport,
  lang: state.UserReducers.language,
});

export default connect(mapState)(React.memo(UserBox));
