import helpers from "../helpers";
import request from "../request";
import loader from "../other/loader";

let sliders = {};

//redux
export const SlidersConstants = {
  SET_SLIDES: "SET_SLIDES",
};
let SlidersActions = {};

SlidersActions.setSlides = (slides = []) => {
  return {
    type: SlidersConstants.SET_SLIDES,
    slides,
  };
};

export { SlidersActions };

const sliderTypeMapper = {
  slider: "0",
  promo: "1",
};

sliders.getAllSlides = async (props) => {
  try {
    let allSlides = await request.make(
      { type: sliderTypeMapper.slider },
      "/data/get-slides"
    );
    props.dispatch(SlidersActions.setSlides(allSlides));
    return Promise.resolve();
  } catch (err) {
    helpers.errorMessage(err.message);
    loader.hide();
    return Promise.resolve();
  }
};

export default sliders;
