import config from "./config";

const Tawk = {};

Tawk.createChat = function () {
  if (window.Tawk_API) return;

  const Tawk_API = {};
  const s1 = document.createElement("script");
  const s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = config.TawkOptions.tawkSrc;
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
  window.Tawk_API = Tawk_API;
};

Tawk.updateChatUser = function (userProperties) {
  if (!window.Tawk_API) {
    Tawk.createChat();
  }
  if (window.Tawk_API.hasOwnProperty("setAttributes")) {
    window.Tawk_API.setAttributes({ ...userProperties });
  } else {
    window.Tawk_API.onLoad = function () {
      window.Tawk_API.setAttributes(userProperties, (error) => {
        console.log(error);
      });
    };
  }
};

Tawk.endChat = function () {
  window.Tawk_API.endChat();
};

Tawk.isInit = function () {
  return !!window.Tawk_API;
};

export default Tawk;

export const tawkOpen = function (e) {
  if (e) {
    e.preventDefault();
  }
  if (Tawk.isInit()) {
    if (window.Tawk_API.isChatMaximized()) {
      return window.Tawk_API.minimize();
    }
    return window.Tawk_API.maximize();
  }
};
