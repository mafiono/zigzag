import request from "../request";
import helpers, { sleep } from "../helpers";

let deposit = {};

deposit.makeDeposit = async (values) => {
  try {
    let bodyObject = {
      paymethod: values.paymethod || values.method.name,
      amount: values.amount,
    };
    if (values.extra) {
      let extra = {};
      values.extra.map((field) => {
        extra[field.name] = field.value;
        return null;
      });
      bodyObject.extra = extra;
    }

    let orderData = await request.make(bodyObject, "/payment/deposit");

    checkCcMethods(orderData);

    await sleep(500);
    if (typeof providers[orderData.strategy] === "undefined") {
      return Promise.resolve(providers.common.handleNewOrder(orderData));
    } else {
      return Promise.resolve(
        providers[orderData.strategy].handleNewOrder(orderData)
      );
    }
  } catch (e) {
    return helpers.errorMessage(e.message);
  }
};

let providers = {};

providers.common = {};
providers.common.handleNewOrder = (orderData) => {
  switch (orderData.providerData.paymentStrategy) {
    case "url":
      return handleUrlOrder(orderData.providerData);
    case "offline":
      return showOrderInfo(orderData.providerData);
    case "data":
      break;
    default:
      break;
  }
};

export default deposit;

let handleUrlOrder = function (providerData) {
  if (
    !helpers.user.getUserProp("isMobile") &&
    helpers.user.getUserProp("isApp")
  ) {
    //desktop apps
    window.open(providerData.data);
    return;
  }
  if (
    helpers.user.getUserProp("isMobile") &&
    helpers.user.getUserProp("isApp")
  ) {
    //mobile apps
    window.location.href = providerData.data;
    return;
  }
  return {
    type: providerData.paymentStrategy,
    iframe: providerData.iframe,
    data: providerData.data,
  };
};

let showOrderInfo = (providerData) => {
  return {
    type: providerData.paymentStrategy,
    data: providerData.data,
  };
};

let checkCcMethods = (orderData) => {
  if (orderData.availableCcMethods) {
    sessionStorage.setItem(
      "availableCcMethods",
      JSON.stringify(orderData.availableCcMethods)
    );
  }
};

let sessionStorageKey = (payment, login) =>
  `${login}-crypto-payment-${payment}`;
export async function getCryptoInfo(payment, login) {
  let key = sessionStorageKey(payment, login);

  let cryptoPayment = sessionStorage.getItem(key);

  if (cryptoPayment) {
    return JSON.parse(cryptoPayment);
  }

  let result = await request.make(
    { currency: payment },
    "/payment/cp-get-address"
  );
  // let result = {"currency":"LTC","address":"MD9idqeA2QnoRFRXKTS38efzCGLxkBR9uy","tag":"","link":"litecoin:MD9idqeA2QnoRFRXKTS38efzCGLxkBR9uy"};

  sessionStorage.setItem(key, JSON.stringify(result));
  return result;
}
