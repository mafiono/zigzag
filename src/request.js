import fetch from "cross-fetch";
import translateHelper from "./translateHelper";
import helpers from "./helpers";
import config from "./config";

let request = {config};

request.make = async (body, path, type = "JSON") => {
  let data = body;
  if (type === "JSON") {
    data = { ...body };
  }
  try {
    let options = {
      method: "POST",
      body: type === "JSON" ? JSON.stringify(data) : data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (type !== "JSON") {
      delete options.headers["Content-Type"];
    }

    let resData = await fetch("/api" + path, options);

    let ok = resData.ok;
    resData =
      resData.headers.get("content-type").indexOf("application/json") > -1
        ? await resData.json()
        : resData;

    if (!ok) {
      if (resData.actions && resData.actions.length > 0) {
        await helpers.actionWorker(resData.actions);
      }
      return Promise.reject(
        new Error(
          translateHelper.getTranslation(
            resData.displayMessage || helpers.generalError
          )
        )
      );
    }
    return Promise.resolve(resData);
  } catch (err) {
    return Promise.reject(err);
  }
};

export default request;
