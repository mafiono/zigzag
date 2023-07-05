import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import buildMainNavigation from "./main-nav/navigation";

function MainNav({ language, online }) {
  const mainNavigation = buildMainNavigation(language, online);

  return (
    <nav className="main_nav">
      <ul className="main_nav__list">{mainNavigation.map(buildElement)}</ul>
    </nav>
  );
}

const buildElement = (element, index) => (
  <li className="main_nav__item" key={element.link}>
    <NavLink
      to={element.link}
      className="main_nav__link"
      activeClassName="active"
      exact={index === 0}
    >
      {element.label}
    </NavLink>
  </li>
);

const mapState = (state) => ({
  language: state.UserReducers.language,
  online: state.UserReducers.online,
});

export default connect(mapState)(MainNav);
