import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import gamesModel from "../games";
import helpers, { _t } from "../../helpers";
import config from "../../config";
import DescriptionBlock from "./description-block";
import user, { UserActions } from "../../other/user";
import Footer from "../../footer/components/footer";

class GamePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.depositValues = config.common.depositValues[this.props.currency] || [];
    this.state = {
      selectedValue: this.depositValues[0],
      depositResponse: null,
      isFullscrened: false,
      gameObject: null,
    };
    this.mode = null;
    this.selectedInput = React.createRef();
    this.linkOnClose = this.linkOnClose.bind(this);
    this.playNav = this.playNav.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.changeFullScreen = this.changeFullScreen.bind(this);
    this.getGameObject = this.getGameObject.bind(this);
    this.depositForm = this.depositForm.bind(this);
  }
  componentDidMount() {
    const { game, mode } = this.props.match.params;
    this.depositValues = config.common.depositValues[this.props.currency] || [];
    if (game && mode) {
      this.url = this.props.match.url;
      this.game = this.props.match.params.game;
      this.mode = this.props.match.params.mode;
    }
    this.getGameObject();
  }
  componentWillUnmount() {
    this.removeBodyClass();
  }
  removeBodyClass() {
    document.body?.classList?.remove("fullscreen_mode");
    this.setState({ isFullscrened: false });
  }
  getGameObject = async () => {
    let { game, mode } = this.props.match.params;
    if (game) {
      if (mode) {
        this.url = this.props.match.url;
        this.game = this.props.match.params.game;
        this.mode = this.props.match.params.mode;
      }

      if (
        ["sport", "esport"]?.indexOf(this.game) !== -1 &&
        config.common.sportEnabled
      ) {
        this.props.dispatch(UserActions.setIsSport(true));
        document?.body?.classList?.add("sport_page");
        this.setState({ gameObject: { id: this.game, slug: this.game } });
        return;
      }
      if (this.props.isSport) {
        this.props.dispatch(UserActions.setIsSport(false));
        document?.body?.classList?.remove("sport_page");
      }

      try {
        let gameObject = await gamesModel.getById(
          game?.substr?.(game?.lastIndexOf("-") + 1)
        );
        if (!gameObject) {
          helpers.errorMessage("Game not found");
          this.url = this.game = this.mode = "";
          this.setState({ gameObject: null });
          this.props.history.push("/" + this.props.match.language);
        }
        this.setState({ gameObject });
      } catch (e) {
        console.log(e.message);
      }
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    let { mode } = this.props.match.params,
      { language } = this.props;

    const preGame = this.game;
    const prevMode = this.mode;

    const notIndex =
      this.props.location.pathname !== `/${language}/` &&
      this.props.location.pathname !== `/${language}`;

    if (!this.state.gameObject) {
      return this.getGameObject();
    }
    if (this.props.match.params.game && this.props.match.params.mode) {
      this.url = this.props.match.url;
      this.game = this.props.match.params.game;
      this.mode = this.props.match.params.mode;
    }

    if (
      (this.props.match.params.game &&
        this.props.match.params.mode &&
        (this.props.match.params.game !== preGame ||
          this.props.match.params.mode !== prevMode)) ||
      this.props.language !== prevProps.language ||
      this.props.online !== prevProps.online ||
      this.mode !== mode
    ) {
      this.getGameObject();
    }
    if (config.common.sportEnabled) {
      if (this.mode !== mode && this.props.isSport && notIndex) {
        this.props.dispatch(UserActions.setIsSport(false));
        document?.body?.classList?.remove("sport_page");
        this.linkOnClose(true);
      }
    }
  }
  url = "";
  game = "";
  mode = "";
  linkOnClose(noPush = false) {
    const { game, mode } = this.props.match.params;
    this.url = this.game = this.mode = "";
    this.setState({ gameObject: null });

    if (game && mode && noPush !== true) {
      this.props.history.push(
        this.props?.location?.state?.from?.pathname ||
          "/" + this.props.language + "/"
      );
    }
    this.removeBodyClass();
  }
  render() {
    const { game, mode } = this.props.match.params;
    const { language, online, isSport } = this.props;
    const { gameObject } = this.state;
    const { from } = this.props.location.state || {
      from: "/" + helpers.getAndSetUserLanguage(),
    };
    const maximized = game && mode;
    const isMobile = helpers.user.getUserProp("isMobile");
    const PlayNav = this.playNav;
    const RenderedPage = this.renderPage;

    if (!gameObject) {
      return null;
    }
    if (!online && mode && mode !== "demo") {
      return (
        <Redirect to={gamesModel.buildDemoPlayLink(language, gameObject)} />
      );
    }

    if (online && isSport && mode && mode === "demo") {
      return (
        <Redirect to={gamesModel.buildRealPlayLink(language, gameObject)} />
      );
    }
    if (isMobile && !isSport) {
      window.location.replace("/api/launch/" + this.mode + "/" + gameObject.id);
      return null;
    }

    if (!maximized) {
      this.removeBodyClass();
    }

    if (this.props.isSport) {
      return (
        <main>
          <iframe
            src={"/api/launch/" + this.mode + "/" + gameObject.id}
            allowFullScreen
            name="gameframe"
            frameBorder="0"
            title={gameObject.name}
            key={gameObject.name + language}
          />
          <Footer noWinTable lang={this.props.language} />
        </main>
      );
    }
    let body = (
      <div className={maximized ? "play_game" : "minimized-game-block"}>
        <div className={maximized ? "play_game__screen" : ""}>
          <div className={maximized ? " play_game__box" : ""}>
            <PlayNav notToDisplay={!maximized} />
            <div
              className={`play_game__item_box ${maximized ? "" : "minimized"}`}
            >
              <RenderedPage />
            </div>
          </div>
        </div>
        {maximized && !this.state.isFullscrened && (
          <div className="main__bg">
            <DescriptionBlock
              lang={language}
              name={gameObject.name}
              provider={gameObject.provider}
            />
          </div>
        )}
      </div>
    );
    if (maximized) {
      return (
        <div className="main">
          {body}
          <Footer lang={this.props.language} />
        </div>
      );
    }
    return <div>{body}</div>;
  }
  renderPage() {
    const { game, mode } = this.props.match.params,
      { language } = this.props,
      { gameObject } = this.state,
      maximized = game && mode,
      gameLink =
        this.mode === "demo"
          ? gamesModel.buildDemoPlayLink(language, { slug: gameObject.slug })
          : gamesModel.buildRealPlayLink(language, { slug: gameObject.slug });

    if (mode && mode !== this.mode) {
      this.mode = mode;
    }
    return (
      <div
        className={"game-page-block " + (maximized ? "maximized" : "minimized")}
      >
        <div className="GameToolbar">
          <div className="right-minimized">
            {!maximized && (
              <a
                className="game_options_link close"
                onClick={this.linkOnClose}
              />
            )}
          </div>
        </div>
        <div className="game-archor">
          {!maximized && (
            <div className="open-minimized-link">
              <Link to={gameLink}></Link>
            </div>
          )}
          <Link
            to={this.url}
            onClick={(e) => {
              if (maximized) {
                e.preventDefault();
              }
            }}
          >
            <iframe
              src={"/api/launch/" + this.mode + "/" + gameObject.id}
              allowFullScreen
              name="gameframe"
              frameBorder="0"
              title={gameObject.name}
              key={gameObject.name + language}
            />
          </Link>
        </div>
      </div>
    );
  }
  changeFullScreen() {
    let siteBody = document.body;
    if (siteBody) {
      siteBody.classList.toggle("fullscreen_mode");
    }
    this.setState((prevState) => ({ isFullscrened: !prevState.isFullscrened }));
  }
  playNav({ notToDisplay }) {
    if (notToDisplay) {
      return null;
    }
    const mode = this.props.match.params.mode,
      { online, language, history, favs } = this.props,
      { gameObject } = this.state,
      isFavorite = ~favs.findIndex((key) => key === parseInt(gameObject.id)),
      addFavorites = user.addFavoritesAction.bind(null, gameObject.id),
      removeFavorites = user.removeFavoritesAction.bind(null, [gameObject.id]),
      isDemo = mode === "demo",
      { from } = this.props.location.state || { from: "/" + language };

    function changeMode() {
      let link = gamesModel.buildDemoPlayLink(language, {
        slug: gameObject.slug,
      });

      if (isDemo) {
        if (!online) {
          link = {
            search: "?login",
            state: {
              loginRedirect: gamesModel.buildRealPlayLink(language, {
                slug: gameObject.slug,
              }),
            },
          };
        } else {
          link = gamesModel.buildRealPlayLink(language, {
            slug: gameObject.slug,
          });
        }
      }

      return history.push(link);
    }

    return (
      <nav className="play_game__nav">
        <ul className="play_game__nav_list">
          <li>{this.depositForm(isDemo)}</li>
          {gameObject.demo && (
            <li>
              <div className="switch">
                <input
                  type="checkbox"
                  id="check-demo"
                  checked={!isDemo}
                  onChange={changeMode}
                />
                <label
                  htmlFor="check-demo"
                  className="switch__btn"
                  data-demo={_t("Demo")}
                  data-money={_t("Play for money")}
                />
              </div>
            </li>
          )}
          <li>
            <div
              className={`operation_btn${isFavorite ? " active" : ""}`}
              onClick={isFavorite ? removeFavorites : addFavorites}
            >
              <img
                src={config.initialImgPath + "other/favorite-hover.svg"}
                alt=""
              />
            </div>
          </li>
          <li>
            <div
              className={`operation_btn${
                this.state.isFullscrened ? " active" : ""
              }`}
              onClick={this.changeFullScreen}
            >
              <img
                src={config.initialImgPath + "other/fullscreen-hover.svg"}
                alt=""
              />
            </div>
          </li>
          <li>
            <div className="operation_btn">
              <Link to={from || ""} onClick={this.linkOnClose}>
                <img
                  alt=""
                  src={config.initialImgPath + "other/close-hover.svg"}
                />
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
  depositForm(isDemo) {
    const { history } = this.props;

    function changeValue(value) {
      history.push({
        search: "fast-deposit",
        state: {
          fastDepositValue: value,
        },
      });
    }

    return (
      <div className={`fast_deposit_form${!isDemo ? " active" : ""}`}>
        <ul className="fast_deposit_form__list">
          {this.depositValues.map((value, index) => {
            return (
              <li key={value}>
                <label>
                  <input
                    className="fast_deposit_input"
                    name="fast_deposit_form"
                    type="radio"
                    value={value}
                    onClick={changeValue.bind(null, value)}
                  />
                  <span className="btn btn_small btn_black">{value}</span>
                </label>
              </li>
            );
          })}
          <li>
            <label className="fast_deposit_form__submit">
              <span>{_t("Instant deposit")}</span>
            </label>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    online: state.UserReducers.online,
    language: state.UserReducers.language,
    isSport: state.UserReducers.isSport,
    previousDeposit: state.UserReducers.userData
      ? state.UserReducers.userData.previousDeposit
      : "",
    favs:
      state.UserReducers.userData && state.UserReducers.userData.customData
        ? state.UserReducers.userData.customData.favs
        : [],
    currency:
      state.UserReducers.userData && state.UserReducers.userData.currency
        ? state.UserReducers.userData.currency
        : "aud",
  };
};
export default connect(mapStateToProps, null)(GamePage);
