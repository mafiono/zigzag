import React from "react";
import Helmet from "react-helmet";
import config from "../../config";
import RecommendedGames from "../../other/components/recommended-games";
import { _t } from "../../helpers";

function DescriptionBlock({ lang, name, provider }) {
  let selectedProvider = null;

  for (let i = 0; i < config.providers.length; i++) {
    if (config.providers?.[i]?.name === provider) {
      selectedProvider = config.providers[i]?.title;
      break;
    }
  }

  let translationProps = {
    "{{name}}": name,
    "{{provider}}": selectedProvider,
    "{{casino}}": "ZigZagSport.com",
  };

  return (
    <>
      <Helmet>
        <meta
          name="keywords"
          content={_t(
            "Online Slot, {{name}}, slot machines, {{provider}}",
            translationProps
          )}
        />
        <title>{name + " - " + config.common.meta.titleCommon}</title>
      </Helmet>
      <h4
        dangerouslySetInnerHTML={{
          __html: _t(
            "Play now {{name}} - {{provider}} Online Slot in {{casino}}",
            translationProps
          ),
        }}
      />
      <p
        dangerouslySetInnerHTML={{
          __html: _t(
            "Love casino slots? Enjoy {{name}} online slot game for FREE at {{casino}}. Play the best {{provider}} slots for fun or real money! PLAY NOW.",
            translationProps
          ),
        }}
      />
      <h4>{_t("similar games")}</h4>
      <div className="play_game__recommended_games_box">
        <RecommendedGames />
      </div>
    </>
  );
}

export default React.memo(DescriptionBlock);
