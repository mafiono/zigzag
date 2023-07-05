import React from "react";
import { _t } from "../../helpers";
import config from "../../config";
import { Link } from "react-router-dom";
import "./css/social.scss";

const initialImgPath =
  config.common.s3CloudFrontAssets + config.common.assets.img.path + "/social/";

function SocialBlock(props) {
  const head = <span key="social-head">{_t("Social login/registration")}</span>,
    socialList = config.common.social.map((name) => {
      let imgSrc = initialImgPath + name + ".svg",
        to = {
          search: "?social-registration",
          state: { social: name },
        };

      if (props.onListClick) {
        const onClick = props.onListClick.bind(null, name);

        return (
          <li key={name}>
            <a href="/" onClick={onClick} className="social_nav__link">
              <div className="social-img-block">
                <img src={imgSrc} alt="" className="social_nav__link_img" />
              </div>
            </a>
          </li>
        );
      }

      return (
        <li key={name} className="social_nav__item">
          <Link to={to} className="social_nav__link">
            <img src={imgSrc} alt="" className="social_nav__link_img" />
          </Link>
        </li>
      );
    }),
    socialBlock = (
      <nav className="social_nav" key="social-block">
        <ul className={`social_nav__list ${props.additionalClassList || ""}`}>
          {socialList}
        </ul>
      </nav>
    );

  let renderComponent = [head, socialBlock];

  if (props.revert) {
    renderComponent.reverse();
  }

  return <div className="social_enter_box">{renderComponent}</div>;
}

export default React.memo(SocialBlock);
