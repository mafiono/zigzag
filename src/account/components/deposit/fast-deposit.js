import React, { useEffect, useState } from "react";
import { Form } from "formik";
import { useLocation } from "react-router-dom";
import AdditionalFields from "./additional-fields";
import config from "../../../config";
import helpers, {
  _t,
  usePreventScroll,
  useCloseOnOutsideClick,
} from "../../../helpers";
import InputRange from "react-input-range";
import CryptoDeposit from "./crypto-deposit";

function FastDeposit(props) {
  const location = useLocation();
  const [openMethod, setOpenMethod] = useState(false);

  usePreventScroll();
  useCloseOnOutsideClick(openMethod, () => setOpenMethod(false), true);

  const { values } = props;

  useEffect(() => {
    if (location?.state?.fastDepositValue) {
      props.amountClick(location?.state?.fastDepositValue);
    }
  }, []);

  function buildBlock(payment, isCrypto) {
    const onClick = (e) => {
      if (isCrypto) {
        props.setFieldValue("method", payment);
      } else {
        props.paymentClick(payment);
      }
      props.setFieldValue("isCrypto", isCrypto);
    };

    let image;
    if (isCrypto) {
      if (payment.name === config.payment.exchange.name) {
        image = config.payment.exchange.getImage(props.lang);
      } else {
        image = config.cryptoImg(payment.currency);
      }
    } else if (payment.image?.startsWith("http")) {
      image = payment.image;
    } else {
      image = config.payment.payMethodUrl + "/" + payment.image;
    }

    let key = `${payment.name || ""}_${payment.title || ""}_${
      payment.currency || ""
    }`;
    const active = helpers.objectsAreEqual(payment, values.method || {});
    return (
      <li key={key}>
        <label
          className={`payment-choice__select-item${active ? " active" : ""}`}
        >
          <input
            type="radio"
            name="payment-choice"
            value={key}
            // checked={active}
            onChange={onClick}
          />
          <img src={image} alt="" className="payment-choice__img" />
        </label>
      </li>
    );
  }
  let paymentImg;
  if (values["isCrypto"]) {
    if (values["method"].name === config.payment.exchange.name) {
      paymentImg = config.payment.exchange.getImage(props.lang);
    } else {
      paymentImg = config.cryptoImg(values["method"]?.currency || "");
    }
  } else if (values["method"]?.image?.startsWith("http")) {
    paymentImg = values["method"].image;
  } else {
    paymentImg =
      config.payment.payMethodUrl + "/" + values["method"]?.image || "";
  }

  return (
    <div className="widget__box">
      <span className="widget__close_btn" onClick={props.closePopUp}>
        <img
          src={config.initialImgPath + "other/back-menu.svg"}
          alt=""
          className="widget__close_btn_img"
        />
      </span>
      <div className="widget__content">
        <span className="h3 font_blue">{_t("Deposit")}</span>
        <Form className="widget__form">
          <div className="input_item_label payment-choice">
            <div
              className={`input_item_select_box payment-choice__box${
                openMethod ? " active" : ""
              }`}
            >
              <ul className="payment-choice__select-list">
                {buildBlock(config.payment.exchange, true)}
                {props.allCryptoMethods.map((payment) =>
                  buildBlock(payment, true)
                )}
                {props.allMethods.map((payment) => buildBlock(payment))}
              </ul>
              <span
                className="input_item_select__center-text ttu"
                onClick={() => setOpenMethod(true)}
              >
                {values.method ? (
                  <img
                    src={paymentImg}
                    alt=""
                    className="payment-choice__img"
                  />
                ) : (
                  _t("Choose payment method")
                )}
              </span>
            </div>
          </div>
          {values["isCrypto"] ? (
            <CryptoDeposit payment={values["method"]} />
          ) : (
            <div>
              {props.customValues ? (
                <div className="money_value_box">
                  {props.amountArray.map((val) => {
                    let selected = val === values["amount"],
                      onClick = () => props.amountClick(val),
                      className = "money_value_box__label";

                    return (
                      <label className={className} onChange={onClick}>
                        <input
                          name="money-value"
                          value={val}
                          type="radio"
                          defaultChecked={selected}
                          className="money_value_box__input"
                        />
                        <span className="btn">{val}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <label
                  className="input_item_range"
                  data-min={props.min}
                  data-max={props.max}
                >
                  <InputRange
                    maxValue={props.max}
                    minValue={props.min}
                    value={values["amount"] || 0}
                    step={props.step}
                    onChange={props.amountClick}
                  />
                </label>
              )}
              <label
                className={`input_item_label bold${
                  props.customValues ? " hidden" : ""
                }`}
              >
                <input
                  name="amount"
                  tabIndex="0"
                  defaultValue="0"
                  className="input_item"
                  ref={props.specialInput}
                  onChange={props.changeAmount}
                  onKeyDown={helpers.onlyNumbers}
                  id="special_amount"
                  type="text"
                  placeholder={_t("Amount")}
                  required
                />
              </label>
              {!!values["method"] && (
                <AdditionalFields
                  values={values["extra"]}
                  extra={values["method"].extra}
                  setFieldValue={props.setFieldValue}
                  lang={props.lang}
                />
              )}
              <div className="widget__submit_box">
                <label>
                  <input type="submit" readOnly value="" className="hidden" />
                  <span className="btn btn_green">{_t("Deposit")}</span>
                </label>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}

export default React.memo(FastDeposit);
