import React from "react";
import { NavLink } from "react-router-dom";
import { _t } from "../../helpers";
import config from "../../config";

function UserMenu(props) {
  const initialPath = "/" + props.language + "/account/";

  return (
    <nav className="user_nav">
      <ul className="user_nav__list">
        {config.common.accountPages.map((page, index) => {
          let linkClassName = "user_nav__link";

          if (index === 0) {
            linkClassName += " red_link";
          }

          return (
            <li className="user_nav__item" key={page.link}>
              <NavLink
                className={linkClassName}
                to={initialPath + page.link}
                active="active"
              >
                {_t(page.label)}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default React.memo(UserMenu);
