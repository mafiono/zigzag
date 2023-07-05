import React from "react";
import Slider from "react-slick";
import config from "../../config";

const settings = {
  slidesToShow: 10,
  slidesToScroll: 1,
  infinite: true,
  speed: 300,
  arrows: false,
  autoplay: true,
  swipeToSlide: true,
  className: "payment-system",
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 9,
      },
    },
    {
      breakpoint: 550,
      settings: {
        slidesToShow: 6,
      },
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 4,
      },
    },
  ],
};

const PaymentSlider = React.memo(() => {
  return (
    <Slider {...settings}>
      {config.payment.footerPayments.map((name) => (
        <span className="payment-system__link pointer" key={name}>
          <img
            loading="lazy"
            src={config.initialImgPath + "payment/" + name}
            alt=""
            className="payment-system__img"
          />
        </span>
      ))}
    </Slider>
  );
});

export default PaymentSlider;
