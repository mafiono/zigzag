import React from "react";
import { NavLink } from "react-router-dom";
import config from "../../config";
import { connect } from "react-redux";
import { _t } from "../../helpers";

const PagesMenu = ({ language, header }) =>
  config.common.contentPages.map((pageItem, index) => {
    let elementClassName = header
        ? "mobile_menu__item"
        : "footer_section__nav_item",
      linkClassName = header ? "lang_nav__link" : "footer_section__nav_link";

    if (pageItem.link === "partners") {
      return (
        <li key={pageItem.link} className={elementClassName}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://game-revenue.eu`}
            className={linkClassName}
          >
            {_t(pageItem.label)}
          </a>
        </li>
      );
    }

    let link = "/" + language + "/p/" + pageItem.link;

    return (
      <li key={pageItem.link} className={elementClassName}>
        <NavLink className={linkClassName} to={link}>
          {_t(pageItem.label)}
        </NavLink>
      </li>
    );
  });

const mapStateToProps = (state, ownProps) => {
  return {
    language: state.UserReducers.language,
  };
};

export default connect(mapStateToProps)(PagesMenu);
