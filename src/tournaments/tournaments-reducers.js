import { TournamentsConstants } from "./tournaments";

const tournaments = (state = {}, action) => {
  switch (action.type) {
    case TournamentsConstants.SET_TOURNAMENTS:
      return Object.assign({}, state, {
        tournaments: action.tournaments,
      });
    default:
      return state;
  }
};

export default tournaments;
