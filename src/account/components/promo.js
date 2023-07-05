import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import user from "../../other/user";
import helpers, { sleep, _t } from "../../helpers";
import config from "../../config";
import ReactWOW from "react-wow";

const codeValidator = (values) => {
  let errors = {};

  if (!values.code || values.code.length < 3 || values.code.length > 32) {
    errors.code = "Code Error";
    helpers.errorMessage(_t("This promo code is invalid"));
  }
  return errors;
};
const submitCodeForm = async (activatePromo, values) => {
  await sleep(500);
  await activatePromo(values.code);
};

let isMounted = false;

const getAvailablePromos = async (setData) => {
  let result = await user.getAvailablePromoCodes();

  if (isMounted) {
    setData(result);
    setData([{"promocode":"J7NVB4","info":"Get 3 RUB to your balance.","type":1},{"promocode":"B8UU7R","info":"Get 1 RUB casino bonus with wagering requirement X30.","type":2},{"promocode":"HIEGO1","info":"Activate 10 free spins on TK-pinkelephants.","type":3}]);
  }
};

const activatePromoAndList = async (getPromos, promoCode) => {
  await user.activatePromoCode(promoCode);
  getPromos();
};

export default (props) => {
  const [promos, setPromos] = useState([]);
  const getPromos = getAvailablePromos.bind(null, setPromos);
  const activatePromo = activatePromoAndList.bind(null, getPromos);
  const submitForm = submitCodeForm.bind(null, activatePromo);

  useEffect(() => {
    isMounted = true;
    getPromos();

    return () => {
      isMounted = false;
    };
  }, [getPromos]);

  return (
    <div className="main__body">
      <h2>{_t("My Promo")}</h2>
      {promos.map((promo, index) => {
        const activate = activatePromo.bind(null, promo.promocode);

        return (
          <div
            key={promo.promocode}
            className="main__bg bonus_section__page_item"
          >
            <div className="tournament_section__item">
              <ReactWOW animation="fadeInDown">
                <div className="tournament_section__img_box">
                  <img
                    src={config.promo.images[promo.type - 1]}
                    alt=""
                    className="tournament_section__tournament_img"
                  />
                </div>
              </ReactWOW>
              <div className="tournament_section__info_box">
                <h3>{promo.info}</h3>
                <div className="bonus_section__btn_row">
                  <span className="btn btn_big" onClick={activate}>
                    {_t("Activate")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="main__bg">
        <h2 className="h_decor">{_t("PromoCode")}</h2>
        <Formik
          initialValues={{ code: "" }}
          validate={codeValidator}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={submitForm}
        >
          {({ values, isSubmitting, handleSubmit }) => (
            <Form className="account__form">
              <label className="input_item_label">
                <Field
                  name="code"
                  type="text"
                  id="code"
                  required
                  className="input_item"
                  placeholder={_t("PromoCode")}
                />
              </label>
              <div className="account__submit_box">
                <button type="submit" className="btn btn_big btn_green">
                  {_t("Confirm")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="text-center" style={{ margin: "10px 0" }}>
          {_t("Please contact Live Chat if a promo code is not found.")}
        </div>
      </div>
    </div>
  );
};
