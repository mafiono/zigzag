import React from "react";
import openSocket from "socket.io-client";
import { toast } from "react-toastify";

import config from "./config";
import helpers from "./helpers";
import { UserActions } from "./other/user";
import userHelper from "./userHelper";
import store from "./store";
import history from "./history";
import { actionCreator } from "./common-actions";
import games from "./games/games";
let sockets = {};

let socketInstance;
let isReady = true,
  previousWin = null;

sockets.connectSockets = () => {
  if (socketInstance && typeof socketInstance === "object") {
    socketInstance.close();
  }

  let socketQuery =
    "dm=" +
    config.common.socketDomain +
    "&lang=" +
    helpers.getAndSetUserLanguage();
  if (helpers.user.isOnline) {
    socketQuery +=
      "&data=" +
      helpers.user.getUserData("socketConnect") +
      "&pid=" +
      helpers.user.getUserData("playerId");
  }

  socketInstance = openSocket(config.common.socketsUrl, {
    query: socketQuery,
  });

  socketInstance.on("public", function (data) {
    switch (data.type) {
      case "notify":
        createNotification(data.notify);
        break;
      default:
    }
  });

  socketInstance.on("winners", async function (data) {
    if (userHelper.getUserProp("isMobile") || data.gm === "sport") {
      //no winners on mobile
      return null;
    }
    // ingnore win pm
    if (data.win && data.win < 1) {
      return null;
    }
    //ignore win for same user
    let login = userHelper.getUserData("login");
    if (login && data.pl.substr(0, 5) === login.substr(0, 5).toUpperCase()) {
      return null;
    }
    //ignore win if game not in cache
    if (!data.gmid || !(await games.getById(data.gmid))) {
      return null;
    }

    if (isReady) {
      isReady = false;

      setTimeout(() => {
        isReady = true;
      }, Math.floor(Math.random() * (1200 - 500)) + 500);

      if (previousWin) {
        store.dispatch(actionCreator("REWRITE_WIN_TABLE", previousWin));
        return (previousWin = null);
      }

      return store.dispatch(actionCreator("REWRITE_WIN_TABLE", data));
    }

    if (!previousWin || previousWin.win < data.win) {
      previousWin = data;
    }
  });

  socketInstance.on("player", async (data) => {
    try {
      switch (data.type) {
        case "notify":
          await createNotification(data.notify);
          break;
        case "action":
          //rebuild object to the new std structure present in request. todo change structure in api
          let params = typeof data.data === "object" ? { ...data.data } : {};
          let actions = [{ action: data.action, params }];
          await helpers.actionWorker(actions);
          break;
        default:
          if (data.win) {
            return;
          }
          let userData = helpers.user.getUserData(),
            rolloverTotal = data.rli,
            rolloverPlayed = 0;

          if (!rolloverTotal) {
            rolloverTotal = userData?.casinoBonus
              ? userData.casinoBonus.rolloverTotal
              : 0;
          }
          if (data.rli && data.rl) {
            rolloverPlayed = parseFloat(data.rli) - parseFloat(data.rl);
          } else if (userData?.casinoBonus) {
            rolloverPlayed = userData.casinoBonus.rolloverPlayed;
          }
          store.dispatch(
            UserActions.setUserData({
              balance: data.bl,
              casinoBonus: {
                ...userData.casinoBonus,
                amount: data.bn,
                rolloverTotal: rolloverTotal,
                rolloverPlayed: rolloverPlayed,
              },
            })
          );
       /* if (!IS_MOBILE) {
          playerdata(data);
        } */
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export default sockets;

const createNotification = async (data) => {
  let Data;

  if (data.buttons) {
    let onClickArray = await getButtonsFunctions(data.buttons);

    Data = () => (
      <div className={"toast__item " + data.messageType}>
        <span className="toast__wow" />
        <span className="toast__close_btn" />
        <div className="toast__container">
          <div
            className="toast__content"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
          <div className="toast__buttons">
            {data.buttons?.map((button, index) => (
              <span
                onClick={onClickArray[index]}
                key={index}
                className="btn user_box__btn"
              >
                {button.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    Data = () => (
      <div className={"toast__item " + data.messageType}>
        <span className="toast__wow" />
        <span className="toast__close_btn" />
        <div
          className="toast__content"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      </div>
    );
  }

  let autoClose = 5000;

  if (typeof data.timeout !== "undefined") {
    if (data.timeout === 0) {
      autoClose = false;
    } else {
      autoClose = data.timeout;
    }
  }

  toast(<Data />, {
    type: data.messageType,
    autoClose,
    hideProgressBar: false,
  });
};

const getButtonsFunctions = async (buttons) => {
  let arr = [];

  for (let i = 0; i < buttons.length; i++) {
    const { param } = buttons[i];

    switch (buttons[i].type) {
      case "openUrl":
        if (param.slice(0, 4) === "http") {
          arr.push(() => {
            window.open(param, "_blank");
          });
          break;
        }
        arr.push(() => history.push(param));
        break;
      case "openGame":
        let game = await games.getById(param);

        if (!game) {
          arr.push(() => history.push("/"));
          break;
        }
        let gameSlug = games.buildRealPlayLink(
            helpers.getAndSetUserLanguage(),
            game
        );
        arr.push(() => history.push(gameSlug));
        break;
      default:
        arr.push(() => null);
    }
  }
  return arr;
};
