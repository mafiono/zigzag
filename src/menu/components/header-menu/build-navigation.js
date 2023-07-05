import { _t } from "../../../helpers";
import config from "../../../config";
import gamesModel from "../../../games/games";

export default function buildNavigation(language) {
  const categoryTranslation = {
    "live-casino": "Live " + _t("Casino"),
    "virtual-sport": "Virtual " + _t("Sport"),
    tv_games: "TV games",
  };

  let navigation = [
    {
      link: "/" + language + "/bonuses",
      label: _t("Promotions"),
      img: "promo",
    },
    {
      link: "/" + language + "/",
      label: _t("Sport"),
      img: "sport",
    },
    {
      link: "/" + language + "/games/c/virtual-sport",
      label: "Virtual " + _t("Sport"),
      img: "virtual-sport",
    },
    {
      link: gamesModel.buildRealPlayLink(language, { slug: "esport" }),
      label: _t("Esport"),
      img: "esport",
    },
    {
      link: "/" + language + "/games/c/all",
      label: _t("Casino"),
      img: "casino",
    },
    {
      link: "/" + language + "/games/c/live-casino",
      label: "Live " + _t("Casino"),
      img: "live-casino",
    },
  ];

  for (let i = 0; i < config.games.menuCategories.length; i++) {
    navigation.push({
      link: "/" + language + "/games/c/" + config.games.sideCategories[i],
      label:
        categoryTranslation[config.games.sideCategories[i]] ||
        _t(config.games.sideCategories[i]),
      img: config.games.sideCategories[i],
    });
  }

  return navigation;
}
