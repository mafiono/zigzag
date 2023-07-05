import { PagesConstants } from "./pages";

const pages = (state = {}, action) => {
  switch (action.type) {
    case PagesConstants.SET_PAGE:
      return Object.assign({}, state, {
        page: action.page,
      });
    default:
      return state;
  }
};

export default pages;
