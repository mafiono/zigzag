import React, { useEffect } from "react";
import { connect } from "react-redux";
import { _t } from "../../helpers";
import config from "../../config";
import history from "../../history";
import { Link } from "react-router-dom";
import request from "../../request";
import { actionCreator } from "../../common-actions";
import games from "../../games/games";

// import store from '../../store';

const slugCr =
  config.common.s3CloudFrontAssets +
  config.common.assets.img.other +
  "/cr-win.svg";

let breakpoints = [
  {
    width: 575,
    length: 3,
  },
  {
    width: 780,
    length: 4,
  },
  {
    width: 1000,
    length: 5,
  },
  {
    width: 1200,
    length: 6,
  },
  {
    width: 1360,
    length: 5,
  },
  {
    width: 1700,
    length: 6,
  },
];

const getWinners = async (dispatch) => {
  try {
    let winners = await request.make(
      { domain: config.common.socketDomain },
      "/data/winners"
    );

    let newWinners = [];

    if (!winners || !Array.isArray(winners)) {
      return;
    }

    for (let i = 0; i < winners.length; i++) {
      let game = await games.getById(winners[i].gmid);
      if (!game) {
        continue;
      }
      newWinners.push({ ...winners[i], demo: game.demo });
    }
    dispatch(actionCreator("INITIALIZE_WIN_TABLE", newWinners));
  } catch (e) {
    console.log(e);
  }
};

function WinTable({ winners, language, online, dispatch, noWinTable }) {
  useEffect(() => {
    getWinners(dispatch);
  }, [dispatch]);

  if (window.innerWidth < 575) {
    return null;
  }

  const currentWinners = rewriteBreakpoint(winners);

  return (
    <div className="win_now">
      {currentWinners.map((game, index) => {
        const { pl, win, name, img } = game;
        const playLink = online
          ? games.buildRealPlayLink(language, game)
          : games.buildDemoPlayLink(language, game);

        const onClickMobile = getToPlayLink.bind(null, playLink);

        return (
          <div key={game.gmid + pl + "index_" + index + win}>
            <div className="win_now__item">
              <div
                className="game_item game_item_short"
                onClick={onClickMobile}
              >
                <div className="game_item__box">
                  <div className="game_item__img_box">
                    <img
                      src={config.games.thumbsUrl + img}
                      alt={name}
                      className="game_item__game_img"
                    />
                  </div>
                  <div className="game_item__btn_box">
                    <Link to={playLink} className="btn btn_shape" tabIndex="-1">
                      {_t("Play")}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="win_now__info_box">
                <span className="win_now__player_login">{pl}</span>
                <span className="win_now__money_win">
                  <img src={slugCr} alt="" />
                  {win}
                </span>
                <Link to={playLink} className="win_now__game_title">
                  {name}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const getToPlayLink = (playLink) => {
  if (window.innerWidth < 1999) {
    history.push(playLink);
  }
};

const mapStateToProps = (state) => {
  let winners = state.winTable.winnersTable || [];

  return {
    online: state.UserReducers.online,
    language: state.UserReducers.language,
    winners,
  };
};

function rewriteBreakpoint(winners = []) {
  let newWinners = [...winners];

  let winWidth = window.innerWidth;
  for (let i = 0; i < breakpoints.length; i++) {
    if (winWidth > breakpoints[i].width) {
      continue;
    }

    return newWinners.slice(0, breakpoints[i].length);
  }

  return newWinners;
}

export default connect(mapStateToProps)(WinTable);
