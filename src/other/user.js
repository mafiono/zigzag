import queryString from "query-string";
import moment from "moment";

import helpers, { sleep } from "../helpers";
import translateHelper from "../translateHelper";
import store from "../store";
import UserConstants from "./user-constants";
import config from "../config";
import sockets from "../sockets";
import request from "../request";
import loader from "./loader";
import history from "../history";

let user = {};
let UserActions = {},
  _t = translateHelper.getTranslation;

UserActions.setOnline = () => {
  helpers.user.isOnline = true;
  return {
    type: UserConstants.USER_SET_ONLINE,
    online: true,
  };
};
UserActions.setOffline = () => {
  helpers.user.isOnline = false;
  return {
    type: UserConstants.USER_SET_OFFLINE,
    online: false,
  };
};
UserActions.setLanguage = (language = config.common.defaultLang) => {
  return {
    type: UserConstants.USER_SET_LANGUAGE,
    language: language,
  };
};
UserActions.setIsSport = (isSport = false) => {
  return {
    type: UserConstants.USER_SET_IS_SPORT,
    isSport: isSport,
  };
};
UserActions.setUserData = (userData) => {
  let newData = {};
  if (Object.keys(userData).length) {
    newData = { ...helpers.user.getUserData(), ...userData };
  }
  helpers.user.setUserData(newData);
  return {
    type: UserConstants.USER_SET_USER_DATA,
    userData: newData,
  };
};

export { UserActions };

user.handleLogin = async (history, values, { setSubmitting }) => {
  let redirect = history.location.state
    ? history.location.state.loginRedirect
    : history.location.pathname;
  try {
    await user.login({ ...values });
    await user.info();
    store.dispatch(UserActions.setOnline());
    /*helpers.successMessage(_t(
            'Hi, {{name}}, welcome back!',
            {
                '{{name}}': helpers.user.getUserData('name') || helpers.user.getUserData('login')
            })
            );*/
    sockets.connectSockets();
    return Promise.resolve(history.push(redirect));
  } catch (err) {
    helpers.errorMessage(err.message);
  }
  await sleep(500);
  setSubmitting(false);
};

user.login = async (data) => {
  return request.make(data, "/player/login");
};

user.logout = async (local = true, remote = true) => {
  try {
    await request.make({ remote }, "/player/logout");
    store.dispatch(UserActions.setOffline());
    store.dispatch(UserActions.setUserData({}));
    sockets.connectSockets();
  } catch (err) {
    console.log(err);
  }
  return Promise.resolve();
};

user.info = async () => {
  try {
    let userData = await request.make({}, "/player/info");
    store.dispatch(UserActions.setUserData(userData));
  } catch (err) {
    helpers.errorMessage(err.message);
  }
  return Promise.resolve();
};

user.edit = async (values) => {
  try {
    let body = {
      ...values,
      birthDay: moment(values.birthDay).format("YYYY-MM-DD"),
    };
    await sleep(500);
    await request.make(body, "/player/edit");
    await user.info();
    helpers.successMessage(_t("Profile has been updated successfully"));
  } catch (err) {
    helpers.errorMessage(err.message);
  }
  return Promise.resolve();
};

user.changePassword = async (formJson, formState) => {
  try {
    await request.make(formJson, "/player/password/change");
    helpers.successMessage(_t("Password successfully changed"));
    formState.resetForm();
    await sleep(500);
  } catch (err) {
    helpers.errorMessage(err.message);
  }
  return Promise.resolve();
};

user.handleInit = async (props, language) => {
  helpers.setLanguage(language);
  loader.show();
  try {
    let redirectWithoutParams = false;
    let queryVars = queryString.parse(
      props.location ? props.location.search : ""
    );
    if (queryVars.authtk) {
      redirectWithoutParams = true;
      try {
        await user.login({ authtk: queryVars.authtk });
      } catch (err) {
        helpers.errorMessage(err.message, false);
        console.log(err);
      }

      delete queryVars.authtk;
    }

    if (redirectWithoutParams) {
      let query = queryString.stringify(queryVars);
      props.history.replace(
        props.location.pathname + (query.length > 0 ? "?" + query : query)
      );
    }

    let initData = await request.make({}, "/init");
    helpers.translate.setTranslations(initData.translations);
    store.dispatch(UserActions.setLanguage(language));

    helpers.user.setUserProps(initData.userProps);

    if (initData.userData) {
      store.dispatch(UserActions.setUserData(initData.userData));
      store.dispatch(UserActions.setOnline());
    }
  } catch (err) {
    helpers.errorMessage(err.message, false);
    return Promise.reject(err);
  } finally {
    loader.hide();
  }
  return Promise.resolve();
};

user.resetBonus = async (type) => {
  try {
    await request.make({ type }, "/player/bonus/reset");
    await user.info();
    helpers.successMessage(_t("Bonus was canceled on your request"));
  } catch (e) {
    console.log(e.message);
  }
};

user.activateBonus = async (type, actionType, uuid) => {
  try {
    await request.make(
      { type, uuid, reset: actionType === "replace" },
      "/player/bonus/activate"
    );
    await user.info();
    helpers.successMessage(_t(`Congratulations! You got a Bonus.`));
  } catch (e) {
    console.log(e.message);
  }
};

user.makeWithdraw = async (body) => {
  try {
    await request.make(body, "/payment/withdraw");
    await user.info();
    helpers.successMessage(
      _t(`Withdrawal request has been accepted for processing`)
    );
  } catch (e) {
    helpers.errorMessage(e.message);
  }
};
user.cancelWithdraw = async (body) => {
  try {
    await request.make(body, "/payment/cancel-withdraw");
    await user.info();
  } catch (e) {
    console.log(e.message);
  }
};

user.getAvailablePromoCodes = async () => {
  try {
    return await request.make({}, "/player/promocode/list");
  } catch (e) {
    helpers.errorMessage(e.message);
    return [];
  }
};

user.activatePromoCode = async (promocode) => {
  try {
    await request.make({ promocode }, "/player/promocode/activate");
    helpers.successMessage(_t("Promo-code has been successfully activated"));
  } catch (e) {
    helpers.errorMessage(e.message);
    return null;
  }
};

user.verifyDocument = async (formJson, resetForm) => {
  try {
    let formData = new FormData();
    for (let i in formJson) {
      formData.append(i, formJson[i]);
    }
    loader.show();
    await request.make(formData, "/player/verification", "FormData");

    helpers.successMessage(_t("File was uploaded"));
    resetForm();
    await sleep(500);
    loader.hide();
  } catch (err) {
    loader.hide();
    helpers.errorMessage(err.message);
    console.log(err);
  }
};
user.createUser = async (formJson, { setSubmitting }) => {
  try {
    let body = {
      ...formJson,
      birthDay: moment(formJson.birthDay).format("YYYY-MM-DD"),
    };
    await request.make(body, "/player/create");

    helpers.successMessage(
      _t(
        "Please check your e-mail including the spam folder and click on the activation link to enable your account."
      )
    );
    history.push("/");
  } catch (err) {
    helpers.errorMessage(err.message);
    console.log(err);
  }
  await sleep(500);
  setSubmitting(false);
};
user.addFavoritesAction = async (id) => {
  let result;
  try {
    result = await request.make({ gameId: parseInt(id) }, "/player/add-fav");
  } catch (err) {
    return helpers.errorMessage(err.message);
  }
  localStorage.setItem("favs", JSON.stringify(result));
  return store.dispatch({
    type: UserConstants.USER_CHANGE_FAVORITES,
    favs: result,
  });
};
user.removeFavoritesAction = async (arr) => {
  let result;
  let newArr = arr.map((key) => parseInt(key));
  try {
    result = await request.make({ gameIds: newArr }, "/player/del-fav");
  } catch (err) {
    return helpers.errorMessage(err.message);
  }
  localStorage.setItem("favs", JSON.stringify(result));
  return store.dispatch({
    type: UserConstants.USER_CHANGE_FAVORITES,
    favs: result,
  });
};
user.buildTransactionHistory = async (formJson) => {
  try {
    let jsonBody = {
      page: formJson.page,
      from: formJson.from,
      to: formJson.to,
      type: formJson.type,
    };
    let result = await request.make(jsonBody, "/player/transaction-history");
    return result;
  } catch (e) {
    helpers.errorMessage(e.message);
    return null;
  }
};
user.buildPlayHistory = async (formJson) => {
  try {
    let body = {
      page: formJson.page,
      limit: parseInt(formJson.perPage),
      conditions: {
        to: formJson.to,
        from: formJson.from,
      },
      order: [formJson.sortType, formJson.sortDirection],
    };
    let result = await request.make(body, "/player/play-history");
    return result;
  } catch (e) {
    helpers.errorMessage(e.message);
    return null;
  }
};
user.getAvaibleCurrencies = async (countryCode) => {
  try {
    let result = await request.make(
      { country: countryCode },
      "/player/get-currencies"
    );
    store.dispatch({
      type: UserConstants.USER_SET_AVAILABLE_CURRENCIES,
      availableCurrencies: result,
    });
    return result;
  } catch (e) {
    helpers.errorMessage(e.message);
    return null;
  }
};
export default user;
