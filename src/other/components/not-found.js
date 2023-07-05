import React from "react";
import config from "../../config";
import helpers from "../../helpers";

import "./css/not-found.scss";

const _t = helpers.translate.getTranslation;

const NotFound = ({ label }) => (
  <>
    <div className="not-found">
      <div className="not-found-text">
        <h1>{_t(label)}</h1>
      </div>
      <div className="not-found-image">
        <img
          src={
            config.common.s3CloudFrontAssets +
            config.common.assets.img.other +
            "/404tournament.png"
          }
          alt=""
        />
      </div>
    </div>
    <span className="aligner" />
  </>
);

export default React.memo(NotFound);
