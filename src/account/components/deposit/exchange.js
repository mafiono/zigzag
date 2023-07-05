import React from "react";
import { useSelector } from "react-redux";
import { _t } from "../../../helpers";
import config from "../../../config";

function Exchange(props) {
  const lang = useSelector((state) => state.UserReducers.language);
  const { box } = props;

  return (
    <div className="qr">
      <div className="deposit-form__info text-center">
        <h4>{_t("Deposit using a cryptocurrency exchange")}</h4>
        {_t("Fund your {{casino}} account using any payment method.", {
          "{{casino}}": config.common.meta.project,
        })}
      </div>
      <br />
      <div className="qr__row">
        <img
          src={config.payment.exchange.imagePayments}
          alt=""
          className="qr__img"
        />
      </div>
      <div className="deposit-form__info text-center">
        {_t(
          "A secure wallet of Litecoin (LTC) cryptocurrency is linked to your account."
        )}
      </div>
      {box}
      <div className="text-center">
        {_t("You can use your favorite exchanger")}
      </div>
      <br />
      <div className="text-center">
        <a
          href={config.payment.exchange.getLink(lang)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn_big btn_green"
        >
          {_t("Proceed to exchange")}
        </a>
      </div>
      <br />
      <div
        className="deposit-form__info text-center"
        dangerouslySetInnerHTML={{
          __html: _t(
            `1.Copy this Litecoin wallet address of your casino account.<br> 2. Visit the currency exchange site. <br>3. Send money to the Litecoin wallet of your casino account from a convenient payment method.`
          ),
        }}
      />
    </div>
  );
}

export default Exchange;
