import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactWOW from "react-wow";
import { Link } from "react-router-dom";
import moment from "moment";
import GameBlock from "../../games/components/game-block";
import gamesModel from "../../games/games";
import { _t } from "../../helpers";

const showSliderTime = (time) => {
  return time > 0 ? time : "00";
};

function TournamentsPage(props) {
  const { data, lang, imgTournamentPath, countdown, online } = props,
    location = useLocation(),
    [currentStats, setStats] = useState(true),
    [games, setGames] = useState([]),
    toggleStats = () => setStats(!currentStats),
    { tournament } = data,
    imgSrc = imgTournamentPath + data.tournament?.content?.img_big;

  useEffect(() => {
    if (data.tournament?.rules?.games) {
      gamesModel
        .getForTournament(data.tournament.rules.games, data.tournament?.id)
        .then((res) => setGames(res));
    }
  }, [data.tournament?.id, data.tournament.rules.games]);

  return (
    <>
      <h2 className="h_white">
        {tournament.content?.title || tournament.name}
      </h2>
      <div className="tournament_section__page_item">
        <div className="tournament_section__item">
          <ReactWOW animation="fadeInDown">
            <div className="tournament_section__img_box">
              <img
                src={imgSrc}
                alt=""
                className="tournament_section__tournament_img"
              />
              {!online && (
                <Link className="btn" to="?login">
                  {_t("PARTICIPATE")}
                </Link>
              )}
            </div>
          </ReactWOW>
          <div className="tournament_section__countdown_box">
            <div className="tournament_section__timer_item bg_viole">
              <span className="tournament_section__timer_count">
                {showSliderTime(countdown?.days)}
              </span>
              <span className="tournament_section__timer_count_title">
                {_t("Days")}
              </span>
            </div>
            <div className="tournament_section__timer_item bg_blue">
              <span className="tournament_section__timer_count">
                {showSliderTime(countdown?.hours)}
              </span>
              <span className="tournament_section__timer_count_title">
                {_t("Hours")}
              </span>
            </div>
            <div className="tournament_section__timer_item bg_green">
              <span className="tournament_section__timer_count">
                {showSliderTime(countdown?.minutes)}
              </span>
              <span className="tournament_section__timer_count_title">
                {_t("Minutes")}
              </span>
            </div>
            <div className="tournament_section__timer_item bg_yellow">
              <span className="tournament_section__timer_count">
                {showSliderTime(countdown?.seconds)}
              </span>
              <span className="tournament_section__timer_count_title">
                {_t("Seconds")}
              </span>
            </div>
          </div>
          <span className="tournament_section__date">
            {`${moment(tournament.date_from).format("DD-MM-YYYY")} – ${moment(
              tournament.date_to
            ).format("DD-MM-YYYY")}`}
          </span>
          <Table
            data={data}
            toggleTable={toggleStats}
            currentStats={currentStats}
          />
        </div>
        <Games games={games} location={location} lang={lang} />
        <div className="tournament_section__rules_box">
          <h3>{_t("Tournament Terms")}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: tournament?.content?.content_terms,
            }}
          />
        </div>
      </div>
    </>
  );
}

const Table = React.memo(({ data, currentStats, toggleTable }) => {
  const previousWinnersExist =
    !data.tournament?.no_stats && data.previousWinners?.length;

  let table = data.stats,
    tableClassName = "tournament_section__players_list_box";

  let button = "Previous Tournament Results";

  if (!currentStats) {
    table = data.previousWinners;
    tableClassName += " previous";
    button = "Current Tournament Results";
  }

  return (
    <>
      {!!previousWinnersExist && (
        <span className="tournament_section__last_result" onClick={toggleTable}>
          {_t(button)}
        </span>
      )}
      {!!table?.length && (
        <div className={tableClassName}>
          <ul className="tournament_section__players_list">
            {table.map((stat, index) => {
              return (
                <li className="tournament_section__player_item" key={index}>
                  <span className="tournament_section__player_login">
                    {stat.userName}
                  </span>
                  <span className="tournament_section__player_win">
                    {stat.betSum}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
});

const Games = ({ games, lang, location }) => {
  if (!games) {
    return null;
  }

  return (
    <div className="tournament_section__tournament_games fullsize_games">
      <h3>{_t("Tournament games")}</h3>
      {games.map((item) => (
        <GameBlock
          key={item.id}
          game={item}
          secondClassName="game_item game_item_small new_game"
          location={location.pathname}
          language={lang}
        />
      ))}
    </div>
  );
};

export default TournamentsPage;
