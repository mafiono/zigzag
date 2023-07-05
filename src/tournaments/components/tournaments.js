import React from "react";
import { connect } from "react-redux";
import ReactWOW from "react-wow";
import moment from "moment";
import TournamentsPage from "./tournaments-page";
import NotFound from "../../other/components/not-found";
import tournamentsModel from "../tournaments";
import GameBlock from "../../games/components/game-block";
import config from "../../config";

import helpers, { _t, Meta } from "../../helpers";

const beautify = (newDate) => {
  let beatifiedDate = { ...newDate };
  for (let i in beatifiedDate) {
    if (beatifiedDate[i] < 10) {
      beatifiedDate[i] = "0" + beatifiedDate[i];
    }
  }
  return beatifiedDate;
};
const slugCr =
  config.common.s3CloudFrontAssets + config.common.assets.img.other + "/cr.svg";

const showSliderTime = (time) => {
  return time > 0 ? time : "00";
};

let isMounted = false;

const imgTournamentPath = config.tournaments.tournamentsUrl + "/";

class Tournaments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tournamentsGames: [],
      countdowns: [],
      openGames: [],
    };
    this.interval = null;
    this.setCountdown = this.setCountdown.bind(this);
    this.getTournaments = this.getTournaments.bind(this);
    this.toggleGameList = this.toggleGameList.bind(this);
    this.renderTournamentItem = this.renderTournamentItem.bind(this);
  }
  componentDidMount() {
    isMounted = true;
    this.getTournaments();
  }
  componentWillUnmount() {
    isMounted = false;
    clearInterval(this.interval);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      this.getTournaments();
    }
  }
  getTournaments() {
    tournamentsModel.getAllTournaments(true).then((games) => {
      this.setState({ tournamentsGames: games }, this.setCountdown());
    });
  }
  render() {
    const { tournaments, tournament, language } = this.props;

    if (!tournaments || !tournaments.length) {
      if (!isMounted) {
        return null;
      }
      return (
        <>
          <Meta text={_t("Tournaments")} />
          <NotFound label="No tournaments found" language={language} />
        </>
      );
    }
    if (tournament) {
      let index = tournaments.findIndex(
        (item) => item.tournament?.alias === tournament
      );

      if (!index) {
        return null;
      }
      return (
        <>
          <Meta text={_t("Tournaments")} />
          <TournamentsPage
            data={tournaments[index]}
            lang={language}
            online={this.props.online}
            countdown={this.state.countdowns[index]}
            imgTournamentPath={imgTournamentPath}
          />
        </>
      );
    }
    return (
      <>
        <h2 className="h_white">{_t("Tournaments")}</h2>
        <Meta text={_t("Tournaments")} />
        {tournaments.map(this.renderTournamentItem)}
      </>
    );
  }

  renderTournamentItem(data, index) {
    const { tournament } = data,
      { language } = this.props,
      { countdowns } = this.state,
      keyLink = helpers.setSmartSlug(
        this.props.history,
        tournament.alias,
        "/" + language + "/tournaments/" + tournament.alias
      );

    return (
      <div className="tournament_section__page_item" key={tournament?.id}>
        <div className="tournament_section__item">
          <ReactWOW animation="fadeInDown">
            <div className="tournament_section__img_box">
              <img
                className="tournament_section__tournament_img"
                alt=""
                src={imgTournamentPath + tournament.content?.img_big}
              />
              <a className="btn" href="/" onClick={keyLink}>
                {_t("PARTICIPATE")}
              </a>
            </div>
          </ReactWOW>
          <div className="tournament_section__countdown_box">
            <div className="tournament_section__timer_item bg_viole">
              <span className="tournament_section__timer_count">
                {showSliderTime(countdowns[index]?.days)}
              </span>
              <span className="tournament_section__timer_count_title">
                {_t("Days")}
              </span>
            </div>
            <div className="tournament_section__timer_item bg_blue">
              <span className="tournament_section__timer_count">
                {showSliderTime(countdowns[index]?.hours)}
              </span>
              <span className="tournament_section__timer_count_title">
                {_t("Hours")}
              </span>
            </div>
            <div className="tournament_section__timer_item bg_green">
              <span className="tournament_section__timer_count">
                {showSliderTime(countdowns[index]?.minutes)}
              </span>
              <span className="tournament_section__timer_count_title">
                {_t("Minutes")}
              </span>
            </div>
            <div className="tournament_section__timer_item bg_yellow">
              <span className="tournament_section__timer_count">
                {showSliderTime(countdowns[index]?.seconds)}
              </span>
              <span className="tournament_section__timer_count_title">
                {_t("Seconds")}
              </span>
            </div>
          </div>
          <a className="h2 tournament_section__heading" href="/" onClick={keyLink}>
            {tournament.content?.title || tournament.name}
          </a>
          <span className="tournament_section__date">
            {`${moment(tournament.date_from).format("DD-MM-YYYY")} – ${moment(
              tournament.date_to
            ).format("DD-MM-YYYY")}`}
          </span>
          <div className="tournament_section__players_list_box">
            <ul className="tournament_section__players_list">
              {data.stats?.map((stat) => (
                <li
                  className="tournament_section__player_item"
                  key={stat.userName}
                >
                  <span className="tournament_section__player_login">
                    {stat.userName}
                  </span>
                  <span className="tournament_section__player_win">
                    <b>{stat.betSum}</b>
                    <img className="exp-coin" src={slugCr} alt="" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <BuildGameContainer
          index={index}
          games={this.state.tournamentsGames[index]}
          location={this.props.location}
          language={language}
        />
        <div className="tournament_more">
          <a className="btn btn_small btn_yellow" href="/" onClick={keyLink}>
            {_t("More")}
          </a>
        </div>
      </div>
    );
  }
  toggleGameList(index) {
    return this.setState((state) => {
      let newGames = [...state.openGames];
      newGames[index] = !state.openGames[index];
      return {
        openGames: newGames,
      };
    });
  }
  setCountdown() {
    this.interval = setInterval(() => {
      let now = Date.now(),
        length = this.props.tournaments?.length,
        newState = [...this.state.countdowns];

      for (let i = 0; i < length; i++) {
        let tournament = this.props.tournaments[i].tournament,
          distance = new Date(tournament?.date_to) - now,
          newDate = {};

        newDate.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        newDate.hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        newDate.minutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        );
        newDate.seconds = Math.floor((distance % (1000 * 60)) / 1000);

        newDate = beautify(newDate);
        newState.splice(i, 1, newDate);
      }
      this.setState({ countdowns: newState });
    }, 1000);
  }
}

const BuildGameContainer = React.memo(
  ({ index, games = [], location, language }) => {
    return (
      <div className="tournament_section__tournament_games">
        {games.map((game) => (
          <GameBlock
            key={game.id}
            game={game}
            location={location}
            secondClassName="game_item_short"
            language={language}
            small=""
          />
        ))}
      </div>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    tournaments: state.TournamentsReducers.tournaments,
    language: state.UserReducers.language,
    online: state.UserReducers.online,
  };
};

export default connect(mapStateToProps, null)(Tournaments);
