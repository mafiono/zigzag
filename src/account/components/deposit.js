import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import FastDeposit from "./deposit/fast-deposit";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import InputRange from "react-input-range";

import helpers, { _t, useCloseOnOutsideClick } from "../../helpers";
import config from "../../config";
import request from "../../request";
import history from "../../history";
import validator from "./deposit/validator";
import AdditionalFields from "./deposit/additional-fields";
import CryptoDeposit from "../../account/components/deposit/crypto-deposit";

let isMounted = false;
let initialValues = {
  method: "",
  amount: null,
  isCrypto: false,
  extra: [],
};

async function makeDepositFunction(location, values) {
  try {
    helpers.setGoogleEvent("Deposit");
    let state = location.state ? { ...location.state } : {};

    state.depositPopUpData = values;

    const to = {
      pathname: location.pathname,
      search: "deposit-popup",
      state,
    };
    return history.push(to);
  } catch (e) {
    console.log(e.message);
  }
}

function Deposit(props) {
  const [allMethods, allMethodsDidMount] = useState([]),
    [allCryptoMethods, allCryptoMethodsDidMount] = useState([]),
    location = useLocation(),
    specialInput = useRef(null),
    makeDeposit = makeDepositFunction.bind(null, location);

  const [openMethod, setOpenMethod] = useState(false);

  if (location.state && location.state.depositAmount) {
    initialValues.amount = location.state.depositAmount;
    if (specialInput.current) {
      specialInput.current.value = location.state.depositAmount;
    }
  }

  useCloseOnOutsideClick(openMethod, () => setOpenMethod(false), true);
  useEffect(() => {
    isMounted = true;
    async function Wrapper() {
      const cryptoMethods = await request.make({}, "/payment/cp-list");
      // const cryptoMethods = [{"currency":"BTC","min":"0.00020000"},{"currency":"ETH","min":"0.01000000"}]
      if (cryptoMethods && cryptoMethods.length) {
        if (isMounted) {
          allCryptoMethodsDidMount(cryptoMethods);
        }
      }
      const paymentMethods = await request.make({}, "/payment/get-list");

      if (paymentMethods && paymentMethods.length) {
        let depositMethods = paymentMethods.filter((key) => key.depositEnabled);
        if (isMounted) {
          allMethodsDidMount(depositMethods);
        }
      }
    }
    try {
      Wrapper();
    } catch (error) {
      console.log(error);
    }
    return () => {
      isMounted = false;
    };
  }, [props.lang]);

  let containerClassName = "account__content_box";

  if (props.fast) {
    containerClassName = "widget active";
  }

  return (
    <div className={containerClassName}>
      <Formik
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={makeDeposit}
        validate={validator}
      >
        {({
          values,
          isValidating,
          setErrors,
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => {
          let depositValues = config.common.depositValues[props.currency] || [],
            amountArray = depositValues,
            customValues = false;

          if (values["isCrypto"]) {
            if (values.extra?.length) {
              setFieldValue("extra", []);
            }
            if (values["method"]) {
              if (values["method"]?.amountOptions?.length) {
                amountArray = values["method"].amountOptions;
                customValues = true;
              } else {
                amountArray = depositValues.filter(
                  (val) =>
                    val >= values["method"]["minDeposit"] &&
                    val <= values["method"]["maxDeposit"]
                );
              }
            }
            if (values["method"] && values["amount"] === null) {
              setFieldValue(
                "amount",
                amountArray[0] || values["method"]["minDeposit"]
              );
              if (specialInput.current) {
                specialInput.current.value =
                  amountArray[0] || values["method"]["minDeposit"];
              }
            }
            if (
              customValues &&
              values["amount"] &&
              !amountArray.includes(values["amount"])
            ) {
              let filtredArr = [...amountArray].filter(
                  (val) => val < values["amount"]
                ),
                selectedVal = filtredArr?.[filtredArr.length - 1];

              if (!selectedVal) {
                selectedVal = amountArray?.[0];
              }
              setFieldValue("amount", selectedVal);
              if (specialInput.current) {
                specialInput.current.value = selectedVal;
              }
            }
          }

          const changeAmount = (e) => {
            if (customValues) {
              return;
            }
            const value = e.currentTarget.value;
            setFieldValue("amount", parseInt(value) || 0);
          };

          if (Object.keys(errors).length) {
            Object.keys(errors).map((err) =>
              helpers.errorMessage(errors[err], 3000, {
                className: "validation-warning",
                toastId: "profile-error-" + err,
              })
            );
            setErrors({});
          }

          const paymentClick = (payment) => {
            setFieldValue("method", payment);
            let extraDataLength = payment.extra?.data?.length;

            if (extraDataLength) {
              let extra = [];
              for (let i = 0; i < extraDataLength; i++) {
                let item = payment.extra.data[i]?.rules;

                if (item.type !== "hidden") {
                  continue;
                }
                extra.push({ name: item.name, value: item.value });
              }
              setFieldValue("extra", extra);
            } else {
              setFieldValue("extra", []);
            }
            if (
              values["amount"] <= payment.minDeposit ||
              values["amount"] >= payment.maxDeposit
            ) {
              let firstOk = depositValues.filter(
                (val) =>
                  val >= payment["minDeposit"] && val <= payment["maxDeposit"]
              )[0];
              if (firstOk) {
                setFieldValue("amount", firstOk);
                if (specialInput.current) {
                  specialInput.current.value = firstOk;
                }
              }
            }
          };

          const amountClick = (amount) => {
            setFieldValue("amount", amount);
            if (specialInput.current) {
              specialInput.current.value = amount;
            }
          };
          let min = values.method?.minDeposit,
            max = values.method?.maxDeposit,
            step = config.common.depositStep[props.currency];

          if (customValues) {
            min = amountArray?.[0];
            max = amountArray?.[amountArray?.length - 1];
          }
          if (props.fast) {
            const fastProps = {
              paymentClick,
              amountClick,
              values,
              allMethods,
              allCryptoMethods,
              customValues,
              amountArray,
              specialInput,
              min,
              max,
              step,
              setFieldValue,
              changeAmount,
              currency: props.currency,
              lang: props.lang,
              closePopUp: props.closePopUp,
            };
            return <FastDeposit {...fastProps} />;
          }

          function buildBlock(payment, isCrypto = false) {
            const onClick = (e) => {
              if (isCrypto) {
                setFieldValue("method", payment);
              } else {
                paymentClick(payment);
              }
              setFieldValue("isCrypto", isCrypto);
            };

            const isActive = helpers.objectsAreEqual(
              payment,
              values["method"] || {}
            );
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
            return (
              <li key={key}>
                <label
                  className={`payment-choice__select-item${
                    isActive ? " active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-choice"
                    value={payment.name}
                    checked={values.method?.name}
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
            <div className="main__body">
              <h2 className="h_decor">{_t("Deposit")}</h2>
              <div className="main__bg">
                <Form className="deposit_form account__form">
                  <div className="input_item_label payment-choice">
                    <div
                      className={`input_item_select_box payment-choice__box${
                        openMethod ? " active" : ""
                      }`}
                    >
                      <ul className="payment-choice__select-list">
                        {/*{buildBlock(config.payment.exchange, true)}*/}
                        {allMethods.map((payment) => buildBlock(payment))}
                        {allCryptoMethods.map((payment) =>
                          buildBlock(payment, true)
                        )}
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
                      {customValues ? (
                        <div className="money_value_box">
                          {amountArray.map((val) => {
                            let selected = val === values["amount"],
                              onClick = () => amountClick(val),
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
                          data-min={min}
                          data-max={max}
                        >
                          <InputRange
                            maxValue={max}
                            minValue={min}
                            value={values["amount"] || 0}
                            step={step}
                            onChange={amountClick}
                          />
                        </label>
                      )}
                      <label
                        className={`input_item_label bold${
                          customValues ? " hidden" : ""
                        }`}
                      >
                        <input
                          name="amount"
                          tabIndex="0"
                          defaultValue="0"
                          className="input_item"
                          ref={specialInput}
                          onChange={changeAmount}
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
                          setFieldValue={setFieldValue}
                          lang={props.lang}
                        />
                      )}
                      <div className="account__submit_box">
                        <label>
                          <input
                            type="submit"
                            readOnly
                            value=""
                            className="hidden"
                          />
                          <span className="btn btn_big btn_green">
                            {_t("Deposit")}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

const mapState = (state) => ({
  currency: state.UserReducers.userData
    ? state.UserReducers.userData.currency
    : "rub",
  lang: state.UserReducers.language,
});
export default connect(mapState)(React.memo(Deposit));
