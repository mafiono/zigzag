import UserConstants from "./user-constants";
import { standardizeUserData } from "../userHelper";

export default (state = {}, action) => {
  switch (action.type) {
    case UserConstants.USER_SET_ONLINE:
    case UserConstants.USER_SET_OFFLINE:
      return Object.assign({}, state, { online: action.online });
    case UserConstants.USER_SET_LANGUAGE:
      return Object.assign({}, state, { language: action.language });
    case UserConstants.USER_SET_AVAILABLE_CURRENCIES:
      return Object.assign({}, state, {
        availableCurrencies: action.availableCurrencies,
      });
    case UserConstants.USER_SET_IS_SPORT:
      return Object.assign({}, state, { isSport: action.isSport });
    case UserConstants.USER_SET_USER_DATA:
      if (action.userData.customData) {
        localStorage.setItem(
          "favs",
          JSON.stringify(action.userData.customData.favs)
        );
      }
      let newUserData = standardizeUserData(action.userData);
      return Object.assign({}, state, { userData: newUserData });
    case UserConstants.USER_CHANGE_FAVORITES:
      let newCustomData = { ...state.userData.customData, favs: action.favs },
        newUserDataWithFavorites = {
          ...state.userData,
          customData: newCustomData,
        };
      return Object.assign({}, state, { userData: newUserDataWithFavorites });
    default:
      return { ...state };
  }
};
