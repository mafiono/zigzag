import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RedirectToLanguage } from "../../other/components/home";
import { _t, Meta } from "../../helpers";
import ReactWOW from "react-wow";
import GameBlock from "../../games/components/game-block";
import gamesModel from "../../games/games";
import config from "../../config";
import "./css/favorite.scss";

function FavoritePage(props) {
  const [games, getGames] = useState(null);
  useEffect(() => {
    if (!props.online) {
      return;
    }
    async function Wrapper() {
      let result = await gamesModel.getByIds(props.favs);
      getGames(result);
    }
    if (props.favs.length) {
      Wrapper();
    }
  }, [props.favs]);
  if (!props.online) {
    return <RedirectToLanguage {...props} />;
  }
  return (
    <ReactWOW animation="fadeInRight">
      <Meta text={_t("Favorite")} />
      <div className="wrapper">
        <section className="basic_account_section wow fadeInRight">
          <div className="basic_account_heading_box">
            <img src={config.initialMenuImagePath + "favorites.svg"} alt="" />
            <h2 className="h_white">{_t("Favorite")}</h2>
          </div>
          <div className="favourite_games_box">
            {games &&
              games.map((game) => {
                if (game && Object.keys(game).length) {
                  const isFavorite = props.favs.includes(parseInt(game.id));

                  return (
                    <GameBlock
                      game={game}
                      key={game.id}
                      online={props.online}
                      location={props.location}
                      language={props.language}
                      isFavorite={isFavorite}
                    />
                  );
                }
                return null;
              })}
          </div>
        </section>
      </div>
    </ReactWOW>
  );
}
const mapState = (state) => {
  return {
    online: state.UserReducers.online,
    language: state.UserReducers.language,
    favs:
      state.UserReducers.userData && state.UserReducers.userData.customData
        ? state.UserReducers.userData.customData.favs
        : [],
  };
};
export default connect(mapState, null)(FavoritePage);
