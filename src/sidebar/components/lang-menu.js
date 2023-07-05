import React from "react";
import { useHistory } from "react-router-dom";
import user from "../../other/user";
import { connect } from "react-redux";
import config from "../../config";
import helpers, { _t } from "../../helpers";

const languages = Object.keys(config.common.languages),
  initialImageSrc = (lng) =>
    config.common.s3CloudFrontAssets +
    config.common.assets.img.path +
    "/lang-menu/" +
    lng +
    ".svg";

function LangMenu(props) {
  const history = useHistory();

  let selected,
    language = helpers.getAndSetUserLanguage(),
    languagesButtons = languages.map((lang, index) => {
      let to = "/" + lang + window.location.pathname.substr(3),
        clickFunction = () => {
          props.toggleMenu();
          user.handleInit({ history, location: history.location }, lang);
          history.replace(to);
          window.history.replaceState({}, document.title, to);
        };

      if (lang === language) {
        selected = index;
        return null;
      }
      const langImg = initialImageSrc(lang);

      return (
        <li key={lang} className="mobile_menu__item" onClick={clickFunction}>
          <a className="lang_nav__link">
            <img className="lang_nav__img" src={langImg} alt="" />
            <span>{_t(config.common.languages[lang].name)}</span>
          </a>
        </li>
      );
    });

  const selectedImg = initialImageSrc(languages[selected]);

  languagesButtons.unshift(
    <li key={language}>
      <span className="lang_nav__link active">
        <img className="lang_nav__img" src={selectedImg} alt="" />
        <span>{_t(config.common.languages[language].name)}</span>
      </span>
    </li>
  );
  if (props.footer) {
    return (
      <nav className={`lang_nav${props.menu ? " active" : ""}`}>
        <div className="lang_nav__current" onClick={props.toggleMenu}>
          <img src={selectedImg} alt="" className="lang_nav__img" />
          <span>{_t(config.common.languages[languages[selected]].name)}</span>
        </div>
        <ul className="lang_nav__list">{languagesButtons}</ul>
      </nav>
    );
  }
  return (
    <li className="mobile_menu__item mobile_menu__sub_menu">
      <div className="lang_nav__current" onClick={props.toggleMenu}>
        <img src={selectedImg} className="lang_nav__img" alt="" />
        <span>{_t(config.common.languages[languages[selected]].name)}</span>
      </div>
      <div className={`sub_menu${props.menu ? " active" : ""}`}>
        <span className="sub_menu__close_btn" onClick={props.toggleMenu}>
          <img
            src={config.initialImgPath + "other/back-menu.svg"}
            className="sub_menu__close_btn_img"
            alt=""
          />
        </span>
        <ul className="mobile_menu__list">{languagesButtons}</ul>
      </div>
    </li>
  );
}

const mapState = (state) => ({
  language: state.UserReducers.language,
});

export default connect(mapState)(React.memo(LangMenu));
