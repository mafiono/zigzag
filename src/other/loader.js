//let loader = {};
import store from "../store";

export const LoaderConstants = {
  SHOW_LOADER: "SHOW_LOADER",
  HIDE_LOADER: "HIDE_LOADER",
};

let timeout = null;

export default {
  show: () => {
    if (store.getState()?.loader?.show) {
      return;
    }
    return store.dispatch({
      type: LoaderConstants.SHOW_LOADER,
      show: true,
    });
  },
  hide: async (imidiate) => {
    clearTimeout(timeout);
    if (!imidiate) {
      await new Promise((resolve) => (timeout = setTimeout(resolve, 700)));
    }
    return store.dispatch({
      type: LoaderConstants.HIDE_LOADER,
      show: false,
    });
  },
};
