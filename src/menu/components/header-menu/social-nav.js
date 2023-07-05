import React from "react";
import config from "../../../config";

const socialBaseImgPath =
  config.common.s3CloudFrontAssets + config.common.assets.img.path + "/social/";

function SocialNav(props) {
  const isRu = props.language === "ru";

  return (
    <nav className="social_nav">
      <ul className="social_nav__list">
        {config.common.socialLinks
          .slice(0, 5)
          .map(({ linkru, link, name, onlyRu }) => {
            if (onlyRu && isRu) {
              return null;
            }
            let finalLink = link;

            if (isRu && linkru) {
              finalLink = linkru;
            }
            return (
              <li className="social_nav__item" key={name}>
                <a
                  className="social_nav__link"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={finalLink}
                >
                  <img
                    src={socialBaseImgPath + name + ".svg"}
                    className="social_nav__link_img"
                    alt=""
                  />
                </a>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}

export default React.memo(SocialNav);
