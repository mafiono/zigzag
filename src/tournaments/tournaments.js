import helpers from "../helpers";
import request from "../request";
import loader from "../other/loader";
import store from "../store";
import gamesMethods from "../games/games";
let tournaments = {};

//redux
export const TournamentsConstants = {
  SET_TOURNAMENTS: "SET_TOURNAMENTS",
};
let TournamentsActions = {};

TournamentsActions.setTournaments = (tournaments = {}) => {
  return {
    type: TournamentsConstants.SET_TOURNAMENTS,
    tournaments,
  };
};

export { TournamentsActions };

tournaments.getAllTournaments = async (addGames = false, limit = 6) => {
  try {
    loader.show();
    let allTournaments = await request.make({}, "/data/get-contests");
    let length = allTournaments.length,
      games = [];

    if (addGames && allTournaments && length) {
      for (let i = 0; i < length; i++) {
        let contest = allTournaments[i];
        let gamesObject = await gamesMethods.getByCode(
          contest?.tournament?.rules?.games || [],
          limit
        );

        games.push(gamesObject);
      }
    }
    store.dispatch(TournamentsActions.setTournaments(allTournaments));
    loader.hide();
    return Promise.resolve(games);
  } catch (err) {
    loader.hide();
    helpers.errorMessage(err.message, false);
  }
};

export default tournaments;
