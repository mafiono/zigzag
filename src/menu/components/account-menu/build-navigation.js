import React from "react";
import { _t } from "../../../helpers";
import config from "../../../config";

export default function buildNavigation(language, history, setLogout) {
  let navigation = [];

  const initialPath = "/" + language + "/account/";

  navigation = config.common.accountPages.map(({ link, label }) => {
    const fullLink = initialPath + link;

    return {
      onClick: () => history.push(fullLink),
      label: _t(label),
      isActive: fullLink === history.location.pathname,
    };
  });

  navigation.push({
    label: _t("Favorite"),
    onClick: () => history.push("/" + language + "/favorite"),
  });
  navigation.push({
    label: _t("Logout"),
    onClick: () => setLogout(true),
  });

  return navigation;
}
