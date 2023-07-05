import React from "react";

import { Link } from "react-router-dom";
import config from "../../../config";
import history from "../../../history";

const providerImage =
  config.common.s3CloudFrontAssets +
  config.common.assets.img.path +
  config.common.assets.img.providerPaths.bigLogos;

function ProviderSliderBlock({ lang, category, provider, isActive, disabled }) {
  let imgSrc = providerImage + "/" + provider + ".png";

  if (disabled) {
    return (
      <div className="game_company__item disabled_provider">
        <span className="game_company__filter">
          <img src={imgSrc} alt="" className="game_company__img" />
        </span>
      </div>
    );
  }
  let link = "/" + lang + "/games/c/" + (category || "all") + "/p/" + provider;

  if (isActive) {
    link = history.location.pathname.replace(`/p/${provider}`, "");
  }
  return (
    <div className={`game_company__item${isActive ? " active" : ""}`}>
      <Link to={link} className="game_company__filter">
        <img src={imgSrc} alt="" className="game_company__img" />
      </Link>
    </div>
  );
}

export default React.memo(ProviderSliderBlock);
