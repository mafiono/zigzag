import React from "react";
import config from "../../config";

function SocialNav({ language }) {
  return (
    <nav className="social_nav">
      <ul className="social_nav__list">
        {config.common.socialLinks.map(({ link, name, linkru, onlyRu }) => {
          let finalLink = link,
            imgSrc =
              config.common.s3CloudFrontAssets +
              config.common.assets.img.path +
              "/social/" +
              name +
              ".svg";

          if (language === "ru") {
            if (linkru) {
              finalLink = linkru;
            }
          } else if (onlyRu) {
            return null;
          }

          return (
            <li className="social_nav__item" key={name}>
              <a
                href={finalLink}
                className="social_nav__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={imgSrc} className="social_nav__link_img" alt="" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SocialNav;
