import React from "react";
import Pages from "../../../menu/components/pages-menu";
import { _t } from "../../../helpers";
import config from "../../../config";

function ContentPages({ menu, toggleMenu, initialImgPath }) {
  return (
    <li className="mobile_menu__item mobile_menu__sub_menu">
      <a className="mobile_menu__link" onClick={toggleMenu}>
        <img src={initialImgPath("info")} alt="" />
        {_t("Information")}
      </a>
      <div className={`sub_menu${menu ? " active" : ""}`}>
        <span className="sub_menu__close_btn" onClick={toggleMenu}>
          <img
            src={config.initialImgPath + "other/back-menu.svg"}
            className="sub_menu__close_btn_img"
            alt=""
          />
        </span>
        <ul className="mobile_menu__list">
          <Pages header />
        </ul>
      </div>
    </li>
  );
}

export default ContentPages;
