import React from "react";
import { Link } from "react-router-dom";
import gamesModel from "../games";
import config from "../../config";
import helpers, { _t } from "../../helpers";
import user from "../../other/user";

const initialPath =
    config.common.s3CloudFrontAssets + config.common.assets.img.other,
  favorite = initialPath + "/favorite.svg";

function Game({
  game,
  location,
  language,
  secondClassName,
  isFavorite,
  online,
  small,
}) {
  let isNew = game.category.new,
    isPopular = game.category.popular,
    favoriteSpan = "game_item__favorite_btn",
    addFavorites = user.addFavoritesAction.bind(null, game.id),
    removeFavorites = user.removeFavoritesAction.bind(null, [game.id]),
    openPopUp = {
      search: "game-popup",
      state: { gamePopUpData: game },
    },
    playLink = helpers.user.isOnline
      ? {
          pathname: gamesModel.buildRealPlayLink(language, game),
          state: { from: location },
        }
      : {
          search: "?login",
          state: {
            loginRedirect: gamesModel.buildRealPlayLink(language, game),
          },
        },
    itemClassName = "game_item animated fadeIn";

  if (isPopular) {
    itemClassName += " game_item_hot";
  }

  if (isNew) {
    itemClassName += " game_item_new";
  }

  if (secondClassName) {
    itemClassName += " " + secondClassName;
  }

  if (isFavorite) {
    favoriteSpan += " active";
  }

  return (
    <div className={itemClassName} key={game.slug}>
      <Link className="mobile-click" to={openPopUp} />
      <div
        className="game_item__box"
        data-game-new={_t("New")}
        data-game-hot={_t("Hot")}
      >
        <div className="game_item__img_box">
          <img
            src={config.games.thumbsUrl + game.image}
            className="game_item__game_img"
            alt={game.name + " - " + game.provider}
          />
        </div>
        <div className="game_item__btn_box">
          <Link to={playLink} className={`btn${small ? " btn_shape" : ""}`}>
            {_t("Play")}
          </Link>
          {game.demo && (
            <Link
              to={{
                pathname: gamesModel.buildDemoPlayLink(language, game),
                state: { from: location },
              }}
              className={`btn btn_demo ${small ? " btn_demo_shape" : ""}`}
            >
              {_t("Demo")}
            </Link>
          )}
        </div>
        {online && (
          <span
            className={favoriteSpan}
            onClick={isFavorite ? removeFavorites : addFavorites}
          >
            <img src={favorite} alt="" />
          </span>
        )}
      </div>
    </div>
  );
}

export default React.memo(Game);
