import React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";

import gamesModel from "../games";
import GameBlock from "./game-block";
import { _t } from "../../helpers";
import RecommendedGames from "../../other/components/recommended-games";
import ProviderMenu from "../../menu/components/provider-menu";
import WinTable from "../../sidebar/components/win-table";
import config from "../../config";

const defaultState = {
  gameData: [],
  isReady: false,
  loadMore: false,
  filterEnd: config.games.paginatorLoadLimit,
};

class GameIndex extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.headerRef = React.createRef();
    this.renderGameContainer = this.renderGameContainer.bind(this);
    this.renderLoadMoreButton = this.renderLoadMoreButton.bind(this);
  }
  componentDidMount() {
    const Wrapper = async () => {
      try {
        this.loadGames({ ...this.props, ...this.state });
      } catch (err) {
        console.log("new Error", err);
      } finally {
        this.setState({ isReady: true });
      }
    };

    Wrapper();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    let { category, tag, provider, name } = this.props;

    let same =
      category === prevProps.category &&
      tag === prevProps.tag &&
      provider === prevProps.provider &&
      name === prevProps.name;

    if (!same) {
      this.loadGames({ ...this.props, defaultState });
    }
  }
  renderLoadMoreButton() {
    const { loadMore } = this.state;
    if (loadMore) {
      return (
        <div className="show_btn_box text-center">
          <span
            className="btn btn_big"
            onClick={() => {
              this.loadGames({ ...this.props, ...this.state });
            }}
          >
            {_t("More")}
          </span>
        </div>
      );
    }
    return "";
  }

  loadGames(data) {
    gamesModel
      .loadGames(data)
      .then(({ gameData, filterEnd, loadMore }) => {
        this.setState({ ...this.state, gameData, filterEnd, loadMore });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  renderGameContainer() {
    let games = this.state.gameData;

    if (!games || games.length === 0) {
      if (!this.state.isReady) {
        return null;
      }

      let components = null;

      if (this.props.match.params.name) {
        components = [
          <div className="sorry_message" key={0}>
            <div className="sorry_message">
              <h2 className="slider_title">
                {_t("Your search did not match any of our games.")}
                <p>{_t("Try out other games")}</p>
              </h2>
            </div>
          </div>,
          <div className="wrapper" key={1}>
            <div className="slots_game_box">
              <RecommendedGames />
            </div>
          </div>,
        ];
      }

      return (
        components || (
          <>
            <div className="wrapper text-center start_section">
              <ProviderMenu />
              <WinTable />
              <div className="slots_game_box">
                <RecommendedGames />
              </div>
            </div>
          </>
        )
      );
    }

    return (
      <>
        <div className="wrapper text-center start_section">
          <ProviderMenu />
          <WinTable />
          {games.map((item) => {
            let props = {
              key: item.id,
              game: item,
              location: this.props.location.pathname,
              language: this.props.language,
              online: this.props.online,
              isFavorite: this.props.favs.includes(parseInt(item.id)),
            };
            return <GameBlock {...props} />;
          })}
        </div>
        {this.renderLoadMoreButton()}
      </>
    );
  }
  render() {
    const meta = gamesModel.getMeta(this.props),
      GameContainer = this.renderGameContainer;

    return (
      <>
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <meta name="keywords" content={meta.keywords} />
        </Helmet>
        <GameContainer />
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    language: state.UserReducers.language,
    online: state.UserReducers.online,
    isSport: state.UserReducers.isSport,
    tournaments: state.TournamentsReducers.tournaments,
    favs:
      state.UserReducers.userData && state.UserReducers.userData.customData
        ? state.UserReducers.userData.customData.favs
        : [],
  };
};

export default withRouter(connect(mapStateToProps, null)(GameIndex));
