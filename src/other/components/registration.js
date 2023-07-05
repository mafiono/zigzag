import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import config from "../../config";
import { Redirect } from "react-router-dom";
import BuildRegistration from "./registration/build-registration";
import SocialBlock from "../../other/components/social-block";
import RegistrationHeader from "./registration/registration-header";
import RegistrationLogin from "./registration/registration-login";

import { _t } from "../../helpers";
import user from "../../other/user";
import countryData from "./countries";
import userProps from "../../userHelper";
import userValidator from "../../other/user/validator";

let revalidate = false;

export const keyDownConfirm = (e) =>
  ~[9, 13, 32].indexOf(e.keyCode) ? e.currentTarget.click() : null;

function Registration(props) {
  const [language, changeLanguage] = useState(props.language),
    [autorization, setAutorization] = useState(false),
    currencies = useSelector(
      (state) => state.UserReducers?.availableCurrencies || []
    ),
    { online } = props,
    { registrationFields } = config.common;

  useEffect(() => {
    if (!currencies.length) {
      user.getAvaibleCurrencies();
    }
  }, []);
  useEffect(() => {
    if (language !== props.language) {
      revalidate = true;
      changeLanguage(props.language);
    }
  }, [props.language]);

  if (autorization) {
    return (
      <RegistrationLogin
        language={props.language}
        active={autorization}
        setAutorization={setAutorization}
      />
    );
  }
  if (online) {
    return <Redirect to={"/" + props.language} />;
  }

  const userCountry = userProps.getUserProp("countryCode");

  let registrationObjects = { ...userValidator.methodFields.registration };
  let newCurrencies = [];

  for (let i = 0; i < currencies.length; i++) {
    newCurrencies.push({
      value: currencies[i],
      label: currencies[i].toUpperCase(),
    });
  }
  registrationObjects.currency.option = newCurrencies;

  let fields = Object.keys(registrationObjects),
    initialValues = {};

  for (let i = 0; i < fields.length; i++) {
    let key = fields[i],
      value = "";

    if (typeof registrationObjects[key].defaultValue !== "undefined") {
      value = registrationObjects[key].defaultValue;
    }
    initialValues[fields[i]] = value;
  }

  fields.sort(
    (next, prev) =>
      registrationObjects[next].order - registrationObjects[prev].order
  );
  initialValues.avatar = config.avatars.baseAvatar;
  initialValues.country =
    userCountry && userCountry !== "00"
      ? userCountry
      : countryData[0].alpha2Code;

  if (userCountry && userCountry === "RU") {
    initialValues.currency = "rub";
  }

  return (
    <div className="main__body">
      <div className="tab__wrapper">
        <RegistrationHeader
          language={props.language}
          active={autorization}
          setAutorization={setAutorization}
        />
        <div className="tab__content">
          <div className="main__bg active">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validateOnBlur={true}
              validateOnChange={false}
              onSubmit={user.createUser}
              validate={(fields) =>
                userValidator.methodValidator.registration(currencies, fields)
              }
            >
              {({
                values,
                errors,
                touched,
                validateForm,
                setFieldValue,
                isSubmitting,
                status,
                setStatus,
              }) => {
                if (revalidate) {
                  validateForm({ ...values });
                  revalidate = false;
                }

                let buildStats = {
                  errors,
                  touched,
                  setFieldValue,
                  values,
                  status,
                };
                let buildRegistration = (field) => (
                    <BuildRegistration
                      {...buildStats}
                      field={field}
                      key={field + language}
                    />
                  ),
                  index = 0;

                return (
                  <>
                    <SocialBlock
                      additionalClassList="registration-social-block"
                      alwaysHover
                      language={props.language}
                    />
                    <Form className="registration_form">
                      <div className="user_box__user_data_fields_box">
                        <div className="user_box__user_data_fields_part">
                          {registrationFields[index++].map(buildRegistration)}
                        </div>
                        <div className="user_box__user_data_fields_part">
                          {registrationFields[index++].map(buildRegistration)}
                          <div className="text-center">
                            <button
                              className="btn btn_big btn_green"
                              type="submit"
                              tabIndex="0"
                              disabled={isSubmitting}
                              onKeyDown={keyDownConfirm}
                            >
                              {_t("Registration")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  online: state.UserReducers.online,
  language: state.UserReducers.language,
});

export default connect(mapStateToProps)(Registration);
