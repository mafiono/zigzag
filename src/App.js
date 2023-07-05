import React, { useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { usePageVisibility } from "react-page-visibility";
import "react-toastify/dist/ReactToastify.css";
import "react-input-range/lib/css/index.css";
import Home, { RedirectToLanguage } from "./other/components/home";
import PaymentStatus from "./account/components/payment-status";
import Restricted from "./other/components/restricted";
import store from "./store";
import helpers, { usePreventScroll } from "./helpers";
import config from "./config";
import history from "./history";
import Loader from "./other/components/loader";
import loader from "./other/loader";

const languageParam = helpers.routing.languageParam;

const homePaths = [
  languageParam,
  languageParam + "/games*",
  languageParam + "/ego",
  languageParam + "/registration",
  languageParam + "/account/*",
  languageParam + "/p/*",
  languageParam + "/bonuses*",
  languageParam + "/tournaments*",
  // languageParam + '/sport',
  languageParam + "/favorite",
  languageParam + "/email/:id",
];

const previousVisible = true; //useEffect is async

const App = () => {
  const isPageVisible = usePageVisibility();
  // // const [a,b] = React.useState(null);
  // // a(b);
  if (isPageVisible !== previousVisible) {
    helpers.getAndSetPageVisibility(isPageVisible);
  }
  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path={config.common.license.path} component={License} />
          <Route exact path={homePaths} component={Home} />
          <Route
            exact
            path={languageParam}
            component={PaymentStatus}
          />
          <Route
            exact
            path={languageParam}
            component={Restricted}
          />
          <Route path={languageParam} component={RedirectToLanguage} />
          <Route path="/*" component={RedirectToLanguage} />
        </Switch>
        <ToastContainer draggable={false} className="new-toast-settings" />
      </Router>
    </Provider>
  );
};

function License(props) {
  usePreventScroll(true);

  useEffect(() => {
    document.body?.classList?.add?.("license");
    window.apg_31ed6aa8_3094_4014_a685_5d039c791b3d?.init();
    setTimeout(() => {
      window.location.reload();
    }, 600000);

    loader.hide();

    return () => {
      document?.body?.classList?.remove?.("license");
    };
  }, []);

  return (
    <div
      id="apg-31ed6aa8-3094-4014-a685-5d039c791b3d"
      data-apg-seal-id="31ed6aa8-3094-4014-a685-5d039c791b3d"
      data-apg-image-size="128"
      data-apg-image-type="basic-small"
    ></div>
  );
}

export default React.memo(App);
