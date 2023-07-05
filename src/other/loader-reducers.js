import { LoaderConstants } from "./loader";

export default (state = {}, action) => {
  if (
    [LoaderConstants.SHOW_LOADER, LoaderConstants.HIDE_LOADER].indexOf(
      action.type
    ) > -1
  ) {
    return {
      show: action.show,
    };
  }
  return state;
};
