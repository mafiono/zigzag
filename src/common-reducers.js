import { CommonConstants } from "./common-actions";

const common = (state = {}, action) => {
  switch (action.type) {
    case CommonConstants.SET_REDIRECT:
      return Object.assign({}, state, {
        redirect: action.redirect,
      });
    default:
      return { ...state };
  }
};

export default common;
