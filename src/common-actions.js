import helpers from "./helpers";

export const CommonConstants = {
  SET_REDIRECT: "SET_REDIRECT",
  TOGGLE_POPUP: "TOGGLE_POPUP",
};

let CommonActions = {};

CommonActions.setRedirect = (
  redirect = "/" + helpers.getAndSetUserLanguage()
) => {
  return {
    type: CommonConstants.SET_REDIRECT,
    redirect,
  };
};

export { CommonActions };

export const actionCreator = (type, payload) => ({ type, payload });
