import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import config from "../../config";
import ProviderSliderBlock from "./provider-menu/provider-slider-block";

const ProviderMenu = ({ providers, lang }) => {
  let disabledProviders = config.providers.filter(
      (provider) => provider.disabled
    ),
    slidersLength = providers.length + disabledProviders.length;

  let settings = {
    infinite: true,
    slidesToShow: Math.min(11, slidersLength),
    slidesToScroll: 3,
    className: "game_company__list",
    autoplay: false,
    autoplaySpeed: 3000,
    dots: false,
    speed: 200,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: Math.min(8, slidersLength),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1201,
        settings: "unslick",
      },
    ],
  };

  const params = useParams();
  let sliders = providers.map((provider) => {
    return (
      <ProviderSliderBlock
        key={provider}
        provider={provider}
        category={params.category}
        isActive={params.provider === provider}
        lang={lang}
      />
    );
  });
  for (let i = 0; i < disabledProviders.length; i++) {
    let provider = disabledProviders[i];

    sliders.push(
      <ProviderSliderBlock
        key={provider.name}
        provider={provider.name}
        disabled
      />
    );
  }
  return (
    <div className="game_company">
      {window.innerWidth > 1199 ? (
        <Slider {...settings}>{sliders}</Slider>
      ) : (
        <div className="game_company__list">{sliders}</div>
      )}
    </div>
  );
};

const mapState = (state) => ({
  lang: state.UserReducers.language,
  providers: state.ProvidersMenuReducers,
});
export default connect(mapState)(React.memo(ProviderMenu));
