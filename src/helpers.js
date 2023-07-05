import React, { useCallback, useEffect, useRef } from "react";
import { Cookies } from "react-cookie";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import history from "./history";
import config from "./config";
import userModel from "./other/user";
import store from "./store";
import { tawkOpen } from "./tawk";
import translateHelper from "./translateHelper";
import userHelper from "./userHelper";
import { loadRecaptcha } from "./other/components/login/login-helpers";

let helpers = {};

helpers.store = store;
helpers.user = userHelper;
helpers.translate = translateHelper;

export const _t = helpers.translate.getTranslation;
const languagesArray = Object.keys(config.common.languages);

const StandartToastMarkUp = ({ text, type }) => {
  return (
    <div className={"toast__item " + type}>
      <span className="toast__wow" />
      <span className="toast__close_btn" />
      <div className="toast__content">{text}</div>
    </div>
  );
};

helpers.getErrorMessage = (err) => {};

helpers.validateLocalCache = (cachedData, cacheTime) => {
  return (
    cachedData &&
    cachedData.data &&
    new Date().valueOf() - cachedData.timestamp < cacheTime
  );
};

helpers.getLocale = () => {
  return (
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage
  );
};

helpers.onlyNumbers = (e) => {
  if (isNaN(Number(e.key)) && ![8, 9, 37, 39].includes(e.keyCode)) {
    // Tab, Backspace, Numbers, Left, Right
    return e.preventDefault();
  }
  return true;
};

helpers.getLanguageCode = () => {
  let locale = helpers.getLocale();
  if (locale.length === 2) {
    return locale;
  }

  let match = locale.match(/^([a-z]{2})-([a-z]{2})$/i);
  if (!match || match?.length < 1) {
    return config.common.defaultLang;
  }
  return match[1];
};

helpers.language = "";
let cookies = new Cookies();
helpers.getAndSetUserLanguage = () => {
  if (helpers.language && helpers.checkAvailableLanguage(helpers.language)) {
    return helpers.language;
  }
  let lang = cookies.get("lang") || "";
  if (lang && helpers.checkAvailableLanguage(lang)) {
    return lang;
  }
  lang = helpers.getLanguageCode() || "";
  if (lang && helpers.checkAvailableLanguage(lang)) {
    helpers.setLanguage(lang);
    return lang;
  }

  helpers.setLanguage(config.common.defaultLang, false);
  return helpers.language;
};

helpers.setLanguage = (lang, cookie = true) => {
  if (helpers.checkAvailableLanguage(lang)) {
    cookie &&
      cookies.set("lang", lang, {
        maxAge: 3600 * 24 * 30,
        path: "/",
      });
    let locale = lang + "_" + config.common.languages[lang].localeCountry;
    cookie &&
      cookies.set("locale", locale, {
        maxAge: 3600 * 24 * 30,
        path: "/",
      });
    helpers.language = lang;
  }
};

helpers.setCookie = (name, value, expireMinutes) => {
  cookies.set(name, value, {
    maxAge: expireMinutes * 60,
    path: "/",
  });
};

helpers.getCookie = (name) => {
  return cookies.get(name);
};

helpers.checkAvailableLanguage = (lang) => {
  return languagesArray.indexOf(lang) > -1;
};
let acountPages = "";
config.common.accountPages.map((page) => {
  return (acountPages += "|" + page.link);
});

helpers.routing = {
  languageParam: "/:language(" + languagesArray.join("|") + ")",
  gameCategoriesParam: ":category(" + config.games.categories.join("|") + ")",
  gameProvidersParam: ":provider(" + config.providersArray.join("|") + ")", //? for optional
  gameTagsParam: ":tag(" + config.games.tags.join("|") + ")",
  contentPagesParam:
    ":contentPage(" +
    config.common.contentPages.map((page) => page.link).join("|") +
    ")",
  accountPagesParam: ":accountPage(" + acountPages + ")",
};

helpers.redirectToHome = () => {
  helpers.errorMessage(_t("Page not found"), 3000);
  return <Redirect to={"/" + helpers.getAndSetUserLanguage()} />;
};

helpers.generalError = "Unexpected error, please contact support";
helpers.errorMessage = (text, timeout = 10000, additionalProps) => {
  if (
    additionalProps &&
    additionalProps.toastId &&
    toast.isActive(additionalProps.toastId)
  ) {
    return null;
  }
  let settings = {
    type: "error",
    autoClose: timeout,
    hideProgressBar: false,
  };
  if (additionalProps) {
    settings = { ...settings, ...additionalProps };
  }
  toast(<StandartToastMarkUp text={text} type={settings.type} />, settings);
};
helpers.successMessage = (text, timeout = 5000) => {
  let settings = {
    type: "success",
    autoClose: timeout,
    hideProgressBar: false,
  };
  toast(<StandartToastMarkUp text={text} type={settings.type} />, settings);
};
helpers.infoMessage = (text, timeout = 5000) => {
  let settings = {
    type: "info",
    autoClose: timeout,
    hideProgressBar: false,
  };
  toast(<StandartToastMarkUp text={text} type={settings.type} />, settings);
};
helpers.base64toFile = (dataURI, file, type = "image/jpeg") => {
  let byteString;

  if (dataURI.split(",")[0].indexOf("base64") >= 0) {
    byteString = atob(dataURI.split(",")[1]);
  } else {
    byteString = unescape(dataURI.split(",")[1]);
  }

  let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  let blob = new Blob([ia], {
    type: mimeString,
  });

  return new File([blob], file.name, { type: type });
};
helpers.escapeHtml = (text) => {
  let map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
};
helpers.stripTags = (text) => {
  return text.replace(/(<([^>]+)>)/gi, "");
};

helpers.actionWorker = async (actions = []) => {
  try {
    if (actions.length === 0) {
      return Promise.resolve();
    }
    for (let i = 0; i < actions.length; i++) {
      let actionName =
        typeof actions[i] === "object" ? actions[i].action : actions[i];
      if (typeof actionName === "undefined") {
        continue;
      }
      if (
        typeof actions[i] === "object" &&
        typeof actions[i].action !== "undefined"
      ) {
        await execActions[actions[i].action](actions[i].params);
      }
      await execActions[actions[i]]();
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.resolve();
  }
};

const execActions = {
  logout: () => {
    return userModel.logout(true, false);
  },
  redirect: (params) => {
    if (typeof params.url !== "string") {
      return Promise.resolve();
    }
    window.location = params.url;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return Promise.resolve();
      }, 5000);
    });
  },
  restrictedCountry: () => {
    window.location = "/" + helpers.getAndSetUserLanguage() + "/restricted";
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  },
  playerInfo: () => {
    return userModel.info();
  },
  createNewOrder: (data) => {
    if (!helpers.getAndSetPageVisibility() || data.paymethod) {
      return;
    }
    let methods = sessionStorage.getItem("availableCcMethods");
    if (!methods || methods.length === 0) {
      return;
    }

    methods = JSON.parse(methods);

    data.paymethod = methods[0];
    methods = methods.slice(1);
    if (methods.length === 0) {
      sessionStorage.removeItem("availableCcMethods");
    } else {
      sessionStorage.setItem("availableCcMethods", JSON.stringify(methods));
    }

    helpers.infoMessage(
      translateHelper.getTranslation(
        "Transaction error. Retry in the new window."
      )
    );

    const to = {
      pathname: window.location.pathname,
      search: "deposit-popup",
      state: { depositPopUpData: data },
    };
    return history.push(to);
  },
};
helpers.objectsAreEqual = (a, b, exception) => {
  let obj1 = { ...a };
  let obj2 = { ...b };

  if (exception) {
    for (let i = 0; i < exception.length; i++) {
      delete obj1[exception[i]];
      delete obj2[exception[i]];
    }
  }
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    if (obj1[propName] !== obj2[propName]) {
      return false;
    }
  }

  return true;
};
helpers.setSmartSlug = (history, slug, redirect) => {
  return () => {
    if (~slug.indexOf("?chat")) {
      return tawkOpen();
    }
    if (~slug.indexOf("http://") || ~slug.indexOf("https://")) {
      return (window.location.href = slug);
    }
    return history.push(redirect || slug);
  };
};

helpers.setGoogleEvent = (event) => {
  if (!window.ga) {
    return;
  }
  try {
    window.ga("send", "event", "Web", event);
  } catch (err) {
    console.log(err);
  }
};
helpers.getAndSetPageVisibility = (visible) => {
  if (typeof visible !== "undefined") {
    helpers.isPageVisible = visible;
  }
  return helpers.isPageVisible;
};
helpers.beatifyNumber = (num) => {
  if (!num) {
    return "0";
  }

  if (window.Intl) {
    let formatNumber = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(num);

    let spaceIndex = formatNumber.lastIndexOf(" ");

    if (~spaceIndex) {
      formatNumber = formatNumber.slice(0, spaceIndex);
    } else {
      formatNumber = formatNumber.slice(0, -2);
    }

    formatNumber = formatNumber.replace(/\./g, " ").trim();

    if (formatNumber.endsWith(",00")) {
      return formatNumber.slice(0, -3);
    }

    return formatNumber;
  }
  let newNum = parseFloat(num);
  return Number?.isInteger(newNum) ? newNum : newNum.toFixed(2);
};

helpers.removeSearch = () => {
  return history.push(history.location.pathname);
};

export const logoutFunction = async () => {
  await userModel.logout();
  history.push("/");
};

export const CustomLink = (props) => {
  const onClick = () => {
    props.additionalAction?.();
    history.push(props.to, props.state);
  };

  return (
    <span className={props.class} onClick={onClick}>
      {props.children}
    </span>
  );
};
export const Meta = ({ text }) => (
  <Helmet>
    <title>{text + " " + config.common.meta.titleCommon}</title>
  </Helmet>
);

function usePreventScroll(condition) {
  let html = document.getElementsByTagName("html")?.[0];

  useEffect(() => {
    if (condition && html) {
      html.style.overflowY = "hidden";
    } else {
      html.style.overflowY = "scroll";
    }
  }, [condition, html]);

  return condition;
}

function toggleState(setter) {
  if (typeof setter !== "function") {
    return;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(() => setter((state) => !state), [setter]);
}

async function sleep(time = 500) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1);
      resolve();
    }, time);
  });
}
function useEscapeToClose(condition, closeFunction) {
  const close = useRef((e) => {
    if (e.keyCode === 27) {
      closeFunction();
    }
  });

  useEffect(() => {
    if (condition) {
      document.body.addEventListener("keydown", close.current);
    } else {
      document.body.removeEventListener("keydown", close.current);
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      document.body.removeEventListener("keydown", close.current);
    };
  });
}

function useCloseOnOutsideClick(condition, closeFunction, needEsc = false) {
  const close = useRef(closeFunction);

  if (needEsc) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEscapeToClose(condition, closeFunction);
  }

  useEffect(() => {
    if (condition) {
      document.body.addEventListener("click", close.current);
    } else {
      document.body.removeEventListener("click", close.current);
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      document.body.removeEventListener("keydown", close.current);
    };
  });
}
function useRecaptchaLoad(onLoadCallback) {
  useEffect(() => {
    let recaptchaExist = document.getElementById("recaptcha-id");

    if (!recaptchaExist) {
      loadRecaptcha(onLoadCallback);
    } else {
      onLoadCallback();
    }
  }, [onLoadCallback]);
}
export {
  usePreventScroll,
  toggleState,
  sleep,
  useCloseOnOutsideClick,
  useRecaptchaLoad,
};
export default helpers;
