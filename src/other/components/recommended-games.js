import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";

import Block from "../../games/components/game-block";
import gamesHelper from "../../games/games";
import config from "../../config";

let isMounted;

function RecommendedGames(props) {
  const [games, getGames] = useState([]),
    location = useLocation();

  useEffect(() => {
    isMounted = true;
    if (props.limit) {
      gamesHelper
        .getByCategory(
          config.common.recommendedCategory.name,
          0,
          config.common.recommendedCategory.maxLength
        )
        .then((res) => {
          if (isMounted) {
            getGames(res[0]);
          }
        });
    } else {
      gamesHelper
        .getByCategory(config.common.recommendedCategory.name, 0)
        .then((res) => {
          if (isMounted) {
            getGames(res[0]);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return games.map((game) => (
    <Block
      key={game.id}
      game={game}
      location={location}
      language={props.language}
      favs={props.favs}
    />
  ));
}
const mapState = (state) => ({
  favs:
    state.UserReducers.userData && state.UserReducers.userData.customData
      ? state.UserReducers.userData.customData.favs
      : [],
  language: state.UserReducers.language,
  popUpData: state.CommonReducers.popUpData,
  online: state.UserReducers.online,
});
export default connect(mapState)(RecommendedGames);
