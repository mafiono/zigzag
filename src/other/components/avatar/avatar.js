import React, { useState, useRef } from "react";
import config from "../../../config";
import { _t } from "../../../helpers";

const avatarPath =
  config.common.s3CloudFrontAssets +
  config.common.assets.img.path +
  config.avatars.avatarPath +
  "/";

export default ({ value, SetFieldValue }) => {
  const [open, openIt] = useState(false),
    ulContainer = useRef(null);

  let avatarBoxClassName = "avatar_collection_box";

  if (open) {
    avatarBoxClassName += " active";
  }

  function openPopUp(e) {
    if (e.target !== ulContainer.current) {
      openIt(true);
      document.body.addEventListener("click", closePopUp, false);
    }
  }

  function onKeyDown(e) {
    if (~[13, 32].indexOf(e.keyCode)) {
      openIt((state) => !state);
    }
  }

  function closePopUp(e) {
    if (e.target !== ulContainer.current) {
      openIt(false);
      document.body.removeEventListener("click", closePopUp, false);
    }
  }

  return (
    <div className="big_input_box" tabIndex="0" onKeyDown={onKeyDown}>
      <div className="selected_avatar" onClick={openPopUp}>
        <img
          className="user_img_avatar"
          src={avatarPath + value}
          alt="user_img"
        />
      </div>
      <div className={avatarBoxClassName}>
        <span onClick={openPopUp}>{_t("Avatar")}</span>
        <ul ref={ulContainer} className="avatar_list">
          {config.avatars.all.map((avatar) => {
            const clickFunction = () => {
              SetFieldValue(avatar);
              closePopUp({});
            };

            return (
              <li key={avatar} onClick={clickFunction}>
                <img
                  className="user_img_avatar"
                  src={avatarPath + avatar}
                  alt="user_img"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
