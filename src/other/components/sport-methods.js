import history from "../../history";
import config from "../../config";
import helpers from "../../helpers";

function initSportMethods() {
  const language = helpers.getAndSetUserLanguage(),
    initialLink = "/" + language + "/";

  if (!config.common.sportEnabled || !window) {
    return;
  }

  window.openLogin = () => history.push(history.location.pathname + "?login");
  window.openRegistration = () =>
    history.push(history.location.pathname + "?registration");
  window.openDeposit = () => history.push(initialLink + "account/deposit");
}

export default initSportMethods;
