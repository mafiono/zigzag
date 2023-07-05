import React, { useState, useEffect, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import buildNavigation from "./header-menu/build-navigation";
import LangMenu from "../../sidebar/components/lang-menu";
import SocialNav from "./header-menu/social-nav";
import ContentPages from "./header-menu/content-pages";
import { usePreventScroll } from "../../helpers";
import config from "../../config";

const initialImgPath = (img) =>
  config.common.s3CloudFrontAssets +
  config.common.assets.img.path +
  "/menu-icon/" +
  img +
  ".svg";

function HeaderMenu(props) {
  const [menuVisible, setMenuVisible] = useState(false),
    { language } = props,
    toggleMenu = () => setMenuVisible((state) => !state),
    [langMenu, setLangMenu] = useState(false),
    [contentMenu, setContentMenu] = useState(false),
    navigation = useMemo(() => buildNavigation(language), [language]),
    toggleLangMenu = useCallback(() => {
      setContentMenu(false);
      setLangMenu((state) => !state);
    }, [setLangMenu]),
    toggleContentMenu = useCallback(() => {
      setLangMenu(false);
      setContentMenu((state) => !state);
    }, [setContentMenu]);

  usePreventScroll(menuVisible);

  useEffect(() => {
    if (!menuVisible) {
      setLangMenu(false);
      setContentMenu(false);
    }
  }, [menuVisible]);

  let menuClassName = "mobile_menu";

  if (menuVisible) {
    menuClassName += " active";
  }
  if (langMenu || contentMenu) {
    menuClassName += " move_left";
  }
  return (
    <div>
      <div className={menuVisible ? "overlay" : ""} onClick={toggleMenu} />
      <span className="mobile_menu__btn" onClick={toggleMenu}>
        <img
          src={config.initialImgPath + "other/hamburger.svg"}
          alt=""
          className="mobile_menu__btn_img"
        />
      </span>
      <div className={menuClassName}>
        <div className="mobile_menu__box">
          <span className="mobile_menu__close_btn" onClick={toggleMenu}>
            <img
              src={config.initialImgPath + "other/close-hover.svg"}
              alt=""
              className="mobile_menu__close_btn_img"
            />
          </span>
          <nav className="mobile_menu__nav">
            <ul className="mobile_menu__list">
              {navigation.map((elem) => {
                return (
                  <li className="mobile_menu__item" key={elem.link}>
                    <Link
                      className="mobile_menu__link"
                      to={elem.link}
                      onClick={toggleMenu}
                    >
                      <img alt="" src={initialImgPath(elem.img)} />
                      {elem.label}
                    </Link>
                  </li>
                );
              })}
              <ContentPages
                menu={contentMenu}
                initialImgPath={initialImgPath}
                toggleMenu={toggleContentMenu}
              />
              <LangMenu menu={langMenu} toggleMenu={toggleLangMenu} />
            </ul>
          </nav>
          <SocialNav />
        </div>
      </div>
    </div>
  );
}

const mapState = (state) => {
  return {
    language: state.UserReducers.language,
    online: state.UserReducers.online,
  };
};

export default connect(mapState)(React.memo(HeaderMenu));
