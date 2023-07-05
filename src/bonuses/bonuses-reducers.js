import { BonusesConstants } from "./bonuses";

const bonuses = (state = [], action) => {
  switch (action.type) {
    case BonusesConstants.SET_BONUSES:
      return Object.assign({}, state, {
        bonuses: action.bonuses,
      });
    default:
      return { ...state };
  }
};

export default bonuses;
