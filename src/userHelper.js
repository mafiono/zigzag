import tawk from "./tawk";
let userHelper = {};

let userProps = {};
userHelper.getUserProp = (key) => {
  return key ? userProps[key] : userProps;
};
userHelper.setUserProps = (data) => {
  if (typeof data !== "object") {
    throw new Error("Incorrect props");
  }
  userProps = data;
};

let userData = {};
userHelper.getUserData = (key) => {
  return key ? userData[key] : userData;
};

userHelper.setUserData = (data, key) => {
  let tawkObject = {
    name: "",
    email: "",
    currency: "",
    playername: "",
    userId: "",
    CLIENTTYPE: userHelper.getUserProp("isMobile") ? "Mobile" : "Desktop",
  };
  if (typeof key === "undefined") {
    userData = standardizeUserData(data);
  } else {
    let obj = {};
    obj[key] = key;
    userData[key] = standardizeUserData(obj);
  }
  if (Object.keys(data).length) {
    tawkObject = {
      name: data.login,
      email: `${data.login}@egocasino.com`,
      currency: data.currency,
      playername: data.login || "",
      userId: data.playerId,
      CLIENTTYPE: userHelper.getUserProp("isMobile") ? "Mobile" : "Desktop",
    };
  }
  try {
    tawk.updateChatUser(tawkObject);
  } catch (err) {
    console.log("tawk on user", err);
  }
};

export function standardizeUserData(data) {
  if (typeof data !== "object") {
    console.log("wrong User Data");
    return data;
  }
  let newData = { ...data };
  try {
    if (newData.balance && !isNaN(Number(newData.balance))) {
      let balance = Number(newData.balance);
      newData.balance = Number.isInteger(balance)
        ? balance
        : balance.toFixed(2);
    } else {
      newData.balance = 0;
    }
    if (newData.casinoBonus && newData.casinoBonus.amount) {
      newData.casinoBonus.amount = Number(newData.casinoBonus.amount);
      newData.casinoBonus.rolloverTotal = Number(
        newData.casinoBonus.rolloverTotal
      );
      newData.casinoBonus.rolloverPlayed = Number(
        newData.casinoBonus.rolloverPlayed
      );
    }
  } catch (e) {
    console.log("wrong User Data");
  }
  return newData;
}
userHelper.isOnline = false;
export default userHelper;
