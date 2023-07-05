import React from "react";
import { connect } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import helpers, { _t, usePreventScroll } from "../../helpers";
import gamesModel from "../../games/games";
import config from "../../config";
import RecommendedGames from "./recommended-games";
import user from "../user";

const PopUp = (props) => {
  const language = helpers.getAndSetUserLanguage(),
    location = useLocation();

  usePreventScroll();

  if (!location.state || !location.state.gamePopUpData) {
    return null;
  }
  const game = location.state.gamePopUpData,
    id = parseInt(game.id),
    addFavorites = user.addFavoritesAction.bind(null, game.id),
    removeFavorites = user.removeFavoritesAction.bind(null, [game.id]),
    playLink = props.online
      ? {
          pathname: gamesModel.buildRealPlayLink(language, game),
          state: { from: location },
        }
      : {
          pathname: "/",
          search: "?login",
          state: {
            loginRedirect: gamesModel.buildRealPlayLink(language, game),
          },
        },
    isFavorite = props.favs.indexOf(id);

  return (
    <>
      <div className="overlay" onClick={props.closePopUp} />
      <div className="widget active game-popup">
        <div className="widget__box">
          <div
            className={`game_item__favorite_btn${isFavorite ? " active" : ""}`}
          >
            <img
              className="game_item__favorite_btn_img"
              onClick={isFavorite ? removeFavorites : addFavorites}
              src={config.initialImgPath + "other/favorite.svg"}
              alt=""
            />
          </div>
          <span className="widget__close_btn" onClick={props.closePopUp}>
            <img
              src={config.initialImgPath + "other/back-menu.svg"}
              className="widget__close_btn_img game"
              alt=""
            />
          </span>
          <div className="widget__content">
            <div className="widget__game_box">
              <div className="widget__game_title_box">
                <Link to={playLink} className="btn btn_big">
                  {_t("Play")}
                </Link>
                {game.demo && (
                  <Link
                    to={{
                      pathname: gamesModel.buildDemoPlayLink(language, game),
                      state: { from: location },
                    }}
                    className="btn btn_white"
                  >
                    {_t("Demo")}
                  </Link>
                )}
                <h4 className="game_item__title">{game.name}</h4>
                <div className="widget__game_item_box">
                  <div className="game_item">
                    <div className="game_item__box">
                      <div className="game_item__img_box">
                        <img
                          src={config.games.thumbsUrl + game.image}
                          alt=""
                          className="game_item__game_img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="widget__other_game_box">
                <h4 className="h_decor">{_t("similar games")}</h4>
                <RecommendedGames />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapState = (state) => ({
  favs:
    state.UserReducers.userData && state.UserReducers.userData.customData
      ? state.UserReducers.userData.customData.favs
      : [],
  language: state.UserReducers.language,
  online: state.UserReducers.online,
});
const mapDispatch = (dispatch) => ({
  addFavorites: (id) => user.addFavoritesAction(id),
  removeFavorites: (id) => user.removeFavoritesAction([id]),
});

export default connect(mapState, mapDispatch)(React.memo(PopUp));
