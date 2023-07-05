import { Cookies } from "react-cookie";
import qs from "query-string";
import config from "../config";
import userHelper from "../userHelper";

const cookies = new Cookies();

const settings = {
  maxAge: config.common.trackCookieMaxAge,
  path: "/",
};
export default function ReferLinkChecker(props) {
  let queryParams = qs.parse(window.location.search),
    { a_type, btag, clickid, pid, sub5, action_id } = queryParams;

  if (!btag || userHelper.isOnline) {
    return;
  }

  if (typeof a_type !== "undefined" && a_type) {
    const affiliate_custom_field = {
      a_type,
      clickid,
      pid,
      sub5,
      action_id,
    };
    cookies.set("affcustom", JSON.stringify(affiliate_custom_field), settings);
  }
  if (!cookies.get("btag")) {
    cookies.set("btag", btag, settings);
  }
}
