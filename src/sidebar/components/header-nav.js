import React from "react";
import config from "../../config";
import { _t } from "../../helpers";
import { NavLink } from "react-router-dom";

function HeaderNav({ language }) {
  const buildElement = buildListElement.bind(null, language);

  return (
    <nav className="header_nav">
      <ul className="header_nav__list">
        {config.games.menuCategories.map(buildElement)}
      </ul>
    </nav>
  );
}

const buildListElement = (language, category) => {
  let link = "/" + language + "/games/c/" + category;
  return (
    <li key={category}>
      <NavLink className="header_nav__link" activeClassName="active" to={link}>
        {_t(category)}
      </NavLink>
    </li>
  );
};

export default HeaderNav;
