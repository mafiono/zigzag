import React from "react";
import { Link } from "react-router-dom";
import helpers from "../../helpers";
import config from "../../config";

const imgLink = config.initialImgPath + "logo.svg";

function Logo(props) {
  const language = helpers.getAndSetUserLanguage();

  const link = props.nolink ? (
    <a className="" href="/">
      <img src={imgLink} className="logo__link_img" alt="" />
    </a>
  ) : (
    <Link to={`/${language}/`}>
      <img src={imgLink} className="logo__link_img" alt="" />
    </Link>
  );

  return <div className="logo">{link}</div>;
}

export default Logo;
