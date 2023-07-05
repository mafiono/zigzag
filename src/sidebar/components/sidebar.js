import React, { useState } from "react";
import { connect } from "react-redux";
import { _t, usePreventScroll, toggleState } from "../../helpers";
import { Link } from "react-router-dom";
import Logo from "../../sidebar/components/logo";
import UserBox from "../../sidebar/components/userbox";
import HeaderNav from "../../sidebar/components/header-nav";
import MainNav from "../../sidebar/components/main-nav";
import SearchContainer from "../../sidebar/components/header-nav/search-container";
import config from "../../config";
import HeaderMenu from "../../menu/components/header-menu";

function Sidebar(props) {
  const { lang } = props,
    [showSearch, setSearch] = useState(false),
    toggleSearch = toggleState(setSearch);

  usePreventScroll(showSearch);

  return (
    <>
      <header className="header">
        <div className="header_top__section">
          <div className="wrapper header_top__box">
            <div className="header_top__part">
              <div className={`search_game ${showSearch ? " active" : ""}`}>
                <span className="search_game__btn" onClick={toggleSearch}>
                  {_t("Search")}
                  <img
                    src={config.initialImgPath + "other/search.svg"}
                    alt=""
                    className="search_game__btn_img"
                  />
                </span>
                <div
                  className={showSearch ? "overlay" : ""}
                  onClick={toggleSearch}
                />
                {showSearch && (
                  <SearchContainer
                    showSearch={showSearch}
                    toggleSearch={toggleSearch}
                    language={lang}
                  />
                )}
              </div>
              <Link className="promotion_link" to={"/" + lang + "/bonuses"}>
                <img
                  src={config.initialImgPath + "other/bonus.svg"}
                  alt=""
                  className="promotion_link__img"
                />
                {_t("Promotions")}
              </Link>
            </div>
            <UserBox showSearch={showSearch} />
            <HeaderMenu />
          </div>
        </div>
        <Logo />
        <div className="header_bottom_section">
          <div className="wrapper header_bottom_box">
            <MainNav />
            <HeaderNav language={lang} />
          </div>
        </div>
      </header>
    </>
  );
}

const mapState = (state) => ({
  online: state.UserReducers.online,
  userData: state.UserReducers.userData,
  lang: state.UserReducers.language,
});

export default connect(mapState, null)(Sidebar);
