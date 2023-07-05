import React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import ReactWOW from "react-wow";
import NotFound from "../../other/components/not-found";

import helpers, { _t, Meta } from "../../helpers";
import config from "../../config";
import bonusesModel from "../bonuses";

const getBonusImage = (id, img) => config.bonuses.imgUrl + "/" + img;
const defaultBonusSlug = (lang) => "/" + lang + "/account/deposit";

let isMounted = false;

const bonusMap = {
  Sport: "2",
  Casino: "1",
};

class Bonuses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      popUpData: null,
      bonusFilter: null,
      bonus: null,
    };
    this.closePopUp = this.closePopUp.bind(this);
    this.bonusPopUp = this.bonusPopUp.bind(this);
    this.renderBonus = this.renderBonus.bind(this);
    this.filterNav = this.filterNav.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
  }
  componentDidMount() {
    isMounted = true;
    bonusesModel.getAllBonuses(this.props);
    document?.body.classList.add("bonuses");
  }
  componentWillUnmount() {
    isMounted = false;
    document?.body.classList.remove("bonuses");
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      bonusesModel.getAllBonuses(this.props);
    }
  }
  render() {
    const { bonuses } = this.props,
      FilterNav = this.filterNav;

    if (!bonuses || !bonuses.length) {
      if (!isMounted) {
        return null;
      }
      return (
        <>
          <Meta text={_t("Bonus")} />
          <h2 className="h_white">{_t("Bonus")}</h2>
          <FilterNav />
          <NotFound label={"No bonuses found"} />
        </>
      );
    }

    let selectedBonuses = [...bonuses];

    if (this.state.bonusFilter) {
      selectedBonuses = selectedBonuses.filter(
        (bonus) => bonus.bonus_type === this.state.bonusFilter
      );
    }

    return (
      <div className="main__body">
        <Meta text={_t("Bonus")} />
        <h2 className="h_decor">{_t("Bonus")}</h2>
        {
          // <FilterNav />
        }
        {selectedBonuses.map(this.renderBonus)}
      </div>
    );
  }
  changeFilter = (filter) => {
    return this.setState({ bonusFilter: filter });
  };
  filterNav() {
    return (
      <nav className="bonus-filter-nav">
        <ul className="bonus-filter-nav__list">
          {Object.keys(bonusMap).map((bonus) => {
            const isActive = bonusMap[bonus] === this.state.bonusFilter,
              onClick = () =>
                this.changeFilter(isActive ? null : bonusMap[bonus]);

            return (
              <li
                onClick={onClick}
                key={bonus}
                className="bonus-filter-nav__list__element"
              >
                <a className="main_nav__link bg_yellow">{_t(bonus)}</a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
  closePopUp = () => {
    this.setState({ popUpData: null });
  };
  openPopUp = (item) => {
    this.setState({ popUpData: item });
  };
  renderBonus(bonusItem) {
    let imgURL = getBonusImage(bonusItem.project_id, bonusItem.image),
      { language } = this.props,
      itemClassName = "main__bg bonus_section__page_item",
      openPopUp = this.openPopUp.bind(this, bonusItem),
      isActive = false,
      activeFunction = openPopUp,
      slug = this.props.online
        ? helpers.setSmartSlug(
            this.props.history,
            bonusItem.slug,
            defaultBonusSlug(language)
          )
        : () => this.props.history.push("?login");

    if (this.state.popUpData && this.state.popUpData.id === bonusItem.id) {
      itemClassName += " active";
      isActive = true;
    }

    if (isActive) {
      activeFunction = this.closePopUp;
    }

    let buttons = (
      <div className="bonus_section__btn_row">
        <span className="btn btn_big" onClick={slug}>
          {_t("Get now")}
        </span>
        <span
          className="btn btn_big btn_white bonus_btn"
          data-show={_t("More")}
          data-hide={_t("Close")}
          onClick={activeFunction}
        />
      </div>
    );

    return (
      <div className={itemClassName} key={bonusItem.id}>
        <div className="tournament_section__item">
          <ReactWOW className="fadeInDown">
            <div className="tournament_section__img_box">
              <img
                className="tournament_section__tournament_img"
                src={imgURL}
                alt=""
              />
            </div>
          </ReactWOW>
          <div className="tournament_section__info_box">
            <h3>{_t(bonusItem.title)}</h3>
            <div dangerouslySetInnerHTML={{ __html: bonusItem.teaser }} />
            {buttons}
          </div>
        </div>
        {this.bonusPopUp(buttons)}
      </div>
    );
  }
  bonusPopUp(buttons) {
    if (!this.state.popUpData) {
      return null;
    }
    let { popUpData } = this.state;

    return (
      <div className="tournament_section__rules_box">
        <Helmet>
          <title>{popUpData.seo_title || popUpData.title}</title>
          <meta
            name="description"
            content={popUpData.seo_description || popUpData.title}
          />
          <meta
            name="keywords"
            content={popUpData.seo_keywords || popUpData.title}
          />
        </Helmet>
        <h3>{_t("bonus rules")}</h3>
        <div
          className="bonus_popup_info"
          dangerouslySetInnerHTML={{ __html: popUpData.content }}
        />
        {buttons}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    online: state.UserReducers.online,
    bonuses: state.BonusesReducers.bonuses,
    language: state.UserReducers.language,
  };
};

export default connect(mapStateToProps, null)(Bonuses);
