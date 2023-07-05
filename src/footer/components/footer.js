import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import Pages from "../../menu/components/pages-menu";
import LangMenu from "../../sidebar/components/lang-menu.js";
import SocialNav from "./social-nav";
import userProps from "../../userHelper";
import config from "../../config";
import { Link } from "react-router-dom";
import { _t } from "../../helpers";
import { tawkOpen } from "../../tawk";
import PaymentSlider from "../../sliders/components/payment-slider";

function Footer(props) {
  const [langMenu, toggleLangMenu] = useState(false),
    { language, online } = props,
    closeLangMenu = useRef(() => toggleLangMenu(false)),
    userCountry = userProps.getUserProp("countryCode");

  useEffect(() => {
    let body = document.body;

    if (langMenu) {
      body.addEventListener("click", closeLangMenu.current);
    } else {
      body.removeEventListener("click", closeLangMenu.current);
    }
  }, [langMenu]);
  return (
    <footer>
      <section className="footer_section">
        <div className="footer_section__box">
          <nav className="footer_section__nav">
            <ul className="footer_section__nav_list">
              <Pages />
            </ul>
          </nav>
          <PaymentSlider />
          <div className="footer_section__rights">
            <div className="footer_section__rights_text_box">
              {/*<p className="footer_section__rights_text">
                                {
                                    userCountry !== 'RU' &&
                                    <span>
                                        ZigZagSport.com is owned and operated by JocSolutions Limited, Gibraltar
                                    </span>
                                }
                                <span>Internet Gambling may be illegal in the jurisdiction in which you are located; if so, you are not authorized to use your payment card to complete this transaction. ZigZagSport.com is licensed in Curacao </span>
                                {
                                    userCountry !== 'RU' &&
                                    <span>and the license is held by JocSystems N.V. a limited liability company incorporated under the laws of Curacao, bearing company number 134835 and having its registered address at E-Commerce Park, Vredenberg, Curacao, Netherlands Antilles.</span>
                                }
                            </p>*/}
              <p className="footer_section__rights_text">
                Our Customer Care Team is available 24/7 via e-mail{" "}
                <a href="mailto:support@ZigZagSport.com">
                  support@ZigZagSport.com
                </a>
                , live chat or phone{" "}
                <a href="tel:+37253202575"> +372 53 20 25 75</a>.
              </p>
              <div className="footer_section__rights_img_box">
                <div className="footer_section__rights_lang_social">
                  <LangMenu
                    menu={langMenu}
                    toggleMenu={toggleLangMenu}
                    footer
                  />
                  <SocialNav />
                </div>
                <div className="footer_section__rights_license">
                  <img
                    className="footer_section__rights_license_img"
                    src={
                      config.common.s3CloudFrontAssets +
                      config.common.assets.img.other +
                      "/license.png"
                    }
                    alt=""
                  />
                  <p className="footer_section__rights_text">
                    2021 © ZigZagSport.com {_t("All rights reserved")}.
                  </p>
                </div>
                <div className="footer_section__rights_license_box">
                  <img
                    src={config.initialImgPath + "other/footer-img.png"}
                    alt=""
                    className="footer_section__rights_license_img"
                  />
                  <img
                    src={config.initialImgPath + "other/footer-img-second.png"}
                    alt=""
                    className="footer_section__rights_license_img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="footer_section__fixed_box">
        {online ? (
          <Link className="user_box__btn" to="?fast-deposit">
            {_t("Deposit")}
          </Link>
        ) : (
          <Link className="user_box__btn" to={`/${language}/registration`}>
            {_t("Registration")}
          </Link>
        )}
        <span className="live_chat_btn" onClick={tawkOpen}>
          {_t("Open chat")}
        </span>
      </div>
    </footer>
  );
}

const mapState = (state) => ({
  language: state.UserReducers.language,
  online: state.UserReducers.online,
});

export default connect(mapState, null)(React.memo(Footer));
