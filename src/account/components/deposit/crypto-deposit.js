import React, { useState, useEffect, useRef } from "react";
import { getCryptoInfo } from "../../../account/deposit";
import QrCode from "qrcode.react";
import helpers, { _t } from "../../../helpers";
import * as clipboard from "clipboard-polyfill";
import { useSelector } from "react-redux";
import config from "../../../config";
import Exchange from "./exchange";

function CryptoDeposit({ payment }) {
  const [crypto, getCrypto] = useState(null),
    adress = useRef(null),
    login = (
      useSelector((state) => state.UserReducers?.userData?.login) || ""
    ).toLowerCase(),
    copyText = () => {
      clipboard.writeText(adress.current.innerText);
      helpers.infoMessage(_t("Text copied to clipboard."));
    },
    isExchange = payment.name === config.payment.exchange.name;

  useEffect(() => {
    async function Wrapper() {
      try {
        let result = await getCryptoInfo(payment.currency, login);

        getCrypto(result);
      } catch (e) {
        console.log(e);
      }
    }
    Wrapper();
  }, [payment.currency]);

  if (!crypto || crypto.currency !== payment.currency) {
    return null;
  }
  const box = (
    <div className="input_item_label qr__code-box">
      <div className="qr__code-copy">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3cca3f"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-copy qr__code-img"
          onClick={copyText}
          dangerouslySetInnerHTML={{
            __html: `
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        `,
          }}
        />
      </div>
      <div className="qr__code" ref={adress}>
        {crypto.address}
      </div>
    </div>
  );

  if (isExchange) {
    return <Exchange box={box} />;
  }
  return [
    <div className="qr">
      <div className="deposit-form__info text-center">
        {_t(
          "{{paymentMethod}} minimum deposit amount is {{amount}} {{currency}}",
          {
            "{{paymentMethod}}": crypto.currency,
            "{{amount}}": parseFloat(payment.min),
            "{{currency}}": crypto.currency,
          }
        )}
      </div>
      <div
        className="deposit-form__info text-center"
        dangerouslySetInnerHTML={{
          __html: _t(
            `This is your personal deposit address. Payment to this address will be credited to your balance shortly. Send the desired amount of <b>{{currency}}</b> including a miner fee.`,
            { "{{currency}}": crypto.currency }
          ),
        }}
      />
      {box}
      {!!crypto.tag && [
        <div className="deposit-form__info text-center" key="label">
          TAG:
        </div>,
        <div className="input_item_label qr__code-box" key="tag">
          <span className="qr__code">{crypto.tag}</span>
        </div>,
      ]}
      <a
        href={crypto.link || ""}
        className="qr__img-link text-center"
        title={crypto.link}
      >
        <QrCode value={crypto.link || ""} />
      </a>
      <div className="text-center">
        <span className="btn btn_big btn_green" onClick={copyText}>
          {_t("Copy text")}
        </span>
      </div>
    </div>,
  ];
}

export default React.memo(CryptoDeposit);
