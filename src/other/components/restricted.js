import React, { useEffect } from "react";
import Logo from "../../sidebar/components/logo";
import { _t } from "../../helpers";
import config from "../../config";
import loader from "../../other/loader";
import tawk, { tawkOpen } from "../../tawk";

export default function Restricted(props) {
  const errorImg =
    config.common.s3CloudFrontAssets +
    config.common.assets.img.other +
    "/restricted.png";

  useEffect(() => {
    loader.hide();
    tawk.createChat();
  }, []);

  return (
    <div className="error_page">
      <header className="header">
        <div className="header_top__section"></div>
        <div className="header_bottom_section">
          <Logo nolink />
        </div>
      </header>
      <main>
        <div className="main__body">
          <h2 className="h_decor">
            {_t("We're sorry. This site is not available in your region.")}
          </h2>
          <img src={errorImg} alt="" className="error_page__main_img" />
          <div className="main__bg">
            <p className="error__info">
              <b>
                {_t("Please contact our support if you have any questions.")}
              </b>
            </p>
            <div className="account__submit_box">
              <span className="btn btn_big" onClick={tawkOpen}>
                {_t("Open chat")}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
