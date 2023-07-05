import { SlidersConstants } from "./sliders";

const sliders = (state = {}, action) => {
  switch (action.type) {
    case SlidersConstants.SET_SLIDES:
      return Object.assign({}, state, {
        slides: action.slides,
      });
    default:
      return state;
  }
};

export default sliders;
