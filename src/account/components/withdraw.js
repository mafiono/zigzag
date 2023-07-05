import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import InputRange from "react-input-range";

import helpers, { _t } from "../../helpers";
import config from "../../config";
import request from "../../request";
import withdraw from "../withdraw";
import validator from "./withdraw/validator";

let isMounted = false;

const initialValues = {
  method: "",
  amount: null,
  isCrypto: false,
  account: "",
};

function Withdraw(props) {
  const [allMethods, allMethodsDidMount] = useState([]),
    [allCryptoMethods, allCryptoMethodsDidMount] = useState([]),
    specialInput = useRef(null);

  useEffect(() => {
    isMounted = true;
    async function Wrapper() {
      const paymentMethods = await request.make({}, "/payment/get-list");
      if (paymentMethods && paymentMethods.length) {
        let depositMethods = paymentMethods.filter(
          (key) => key.withdrawEnabled
        );
        if (isMounted) {
          allMethodsDidMount(depositMethods);
        }
      }
      const cryptoMethods = await request.make({}, "/payment/cp-list");
      if (cryptoMethods && cryptoMethods.length) {
        if (isMounted) {
          allCryptoMethodsDidMount(cryptoMethods);
        }
      }
    }
    Wrapper();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="tab-content">
      <Formik
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={withdraw.makeWithdraw}
        validate={validator}
      >
        {({
          values,
          isValidating,
          setErrors,
          errors,
          isSubmitting,
          touched,
          handleSubmit,
          setFieldValue,
          setValues,
        }) => {
          let depositValues = config.common.depositValues[props.currency] || [];
          let amountArray = depositValues;

          if (!values["isCrypto"]) {
            amountArray = values["method"]
              ? depositValues.filter(
                  (val) =>
                    val >= values["method"]["minWithdraw"] &&
                    val <= values["method"]["maxWithdraw"]
                )
              : depositValues;

            if (values["method"] && values["amount"] === null) {
              setFieldValue(
                "amount",
                amountArray[0] || values["method"]["minWithdraw"]
              );
              if (specialInput.current) {
                specialInput.current.value =
                  amountArray[0] || values["method"]["minWithdraw"];
              }
            }
          }

          const paymentClick = (payment, isCrypto) => {
            setFieldValue("method", payment);

            if (!isCrypto) {
              setFieldValue("isCrypto", false);
              if (
                values["amount"] <= payment.minWithdraw ||
                values["amount"] >= payment.maxWithdraw
              ) {
                let firstOk = depositValues.filter(
                  (val) =>
                    val >= payment["minWithdraw"] &&
                    val <= payment["maxWithdraw"]
                )[0];
                if (firstOk) {
                  setFieldValue("amount", firstOk);
                  if (specialInput.current) {
                    specialInput.current.value = firstOk;
                  }
                }
              }
            } else {
              setValues({
                method: payment,
                isCrypto: true,
                amount: null,
                account: "",
              });
              if (specialInput.current) {
                specialInput.current.value = "";
              }
            }
          };

          function changePayment(e) {
            const paymentName = e.currentTarget.value;
            const isCrypto = paymentName.startsWith("crypto_");
            let payment;
            if (isCrypto) {
              let val = paymentName.slice(7); // 7 === crypto_.length
              payment = allCryptoMethods.find((p) => p.currency === val);
            } else {
              payment = allMethods.find((p) => p.name === paymentName);
            }

            if (payment) {
              paymentClick(payment, isCrypto);
            }

            return false;
          }

          const amountClick = (amount) => {
            setFieldValue("amount", amount);
            if (specialInput.current) {
              specialInput.current.value = amount;
            }
          };

          const changeAmount = (e) => {
            const value = e.currentTarget.value;
            setFieldValue("amount", parseInt(value) || 0);
          };

          if (Object.keys(errors).length) {
            Object.keys(errors).map((err) => {
              helpers.errorMessage(errors[err], 3000, {
                className: "validation-warning",
                toastId: "profile-error-" + err,
              });
              return null;
            });
            setErrors({});
          }
          let value = values.method?.name;

          if (values["isCrypto"]) {
            value = "crypto_" + values.method.currency;
          }

          return (
            <div className="main__body">
              <h2 className="h_decor">{_t("withdraw")}</h2>
              <div className="main__bg">
                <Form className="account__form">
                  <label className="input_item_label">
                    <span className="input_item_select_box">
                      <select
                        className="input_item_select"
                        name="payment_company"
                        value={value}
                        onChange={changePayment}
                        required
                      >
                        <option key="00" value="" hidden>
                          {_t("Choose payment method")}
                        </option>
                        {allMethods.map((payment) => (
                          <option key={payment.name} value={payment.name}>
                            {payment.title}
                          </option>
                        ))}
                        {allCryptoMethods.map((payment) => (
                          <option
                            key={payment.currency}
                            value={"crypto_" + payment.currency}
                          >
                            {payment.currency}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                  {!values["isCrypto"] ? (
                    <label
                      className="input_item_range"
                      data-min={values.method?.minWithdraw}
                      data-max={values.method?.maxWithdraw}
                    >
                      <InputRange
                        maxValue={values.method?.maxWithdraw}
                        minValue={values.method?.minWithdraw}
                        value={values["amount"] || 0}
                        step={100}
                        onChange={amountClick}
                      />
                    </label>
                  ) : null}
                  <label className="input_item_label bold">
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
                  <label className="input_item_label">
                    <Field
                      name="account"
                      tabIndex="0"
                      placeholder={
                        values["isCrypto"]
                          ? _t("{{cryptoCurrency}} address", {
                              "{{cryptoCurrency}}": values.method.currency,
                            })
                          : _t("Please enter your card/wallet number")
                      }
                      className="input_item"
                      type="text"
                      required
                    />
                    <span className="input_item_bg" />
                  </label>
                  <div className="account__submit_box">
                    <label>
                      <input
                        type="submit"
                        readOnly
                        value=""
                        className="hidden"
                      />
                      <span className="btn btn_big btn_green">
                        {_t("withdraw")}
                      </span>
                    </label>
                  </div>
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
export default connect(mapState)(Withdraw);
