import { _t } from "../../../helpers";
import gamesModel from "../../../games/games";

function buildNavigation(language, online) {
  let buildLink = online
    ? gamesModel.buildRealPlayLink
    : gamesModel.buildDemoPlayLink;

  const navigation = [
    {
      link: "/" + language + "/",
      label: _t("Sport"),
    },
    {
      link: "/" + language + "/games/c/all",
      label: _t("Casino"),
    },
    {
      link: "/" + language + "/games/c/live-casino",
      label: "Live " + _t("Casino"),
    },
    {
      link: "/" + language + "/games/c/virtual-sport",
      label: "Virtual " + _t("Sport"),
    },
    {
      link: buildLink(language, { slug: "esport" }),
      label: _t("Esport"),
    },
    {
      link: "/" + language + "/games/c/tv_games",
      label: _t("TV games"),
    },
  ];

  return navigation;
}

export default buildNavigation;
