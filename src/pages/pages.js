import helpers from "../helpers";
import request from "../request";
import loader from "../other/loader";

let pages = {};

//redux
export const PagesConstants = {
  SET_PAGE: "SET_PAGE",
};
let PagesActions = {};

PagesActions.setPage = (page = {}) => {
  return {
    type: PagesConstants.SET_PAGE,
    page,
  };
};

export { PagesActions };

pages.getPage = async (props) => {
  try {
    loader.show();
    let page = await request.make(
      { slug: props.contentPage },
      "/data/get-page"
    );
    props.dispatch(PagesActions.setPage(page));
    loader.hide();
    return Promise.resolve();
  } catch (err) {
    helpers.errorMessage(err.message);
    loader.hide();
    return Promise.resolve();
  }
};

export default pages;
