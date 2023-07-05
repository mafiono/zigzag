import React from "react";
import { Formik, Form } from "formik";
import { connect } from "react-redux";
import countryData from "../../other/components/countries";
import config from "../../config";
import Avatar from "../../other/components/registration/avatar";
import BuildFieldBox from "./profile/build-field";
import { _t } from "../../helpers";
import userValidator from "../../other/user/validator";
import user from "../../other/user";
import userProps from "../../userHelper";

const { editFields } = config.common;

function Profile(props) {
  let editObjects = userValidator.methodFields.edit,
    fields = Object.keys(editObjects),
    initialValues = {},
    { userData } = props,
    userCountry = userProps.getUserProp("countryCode");

  fields.sort((next, prev) => {
    return editObjects[next].order - editObjects[prev].order;
  });

  fields.map((field) => {
    if (userValidator.methodFields.edit[field]["option"] && !userData[field]) {
      initialValues[field] =
        userValidator.methodFields.edit[field]["option"][0].value;
    } else {
      initialValues[field] =
        userData[field] ||
        (userData.customData && userData.customData[field]) ||
        "";
    }
    return null;
  });

  if (!initialValues["country"]) {
    initialValues["country"] =
      userCountry && userCountry !== "00"
        ? userCountry
        : countryData[0].alpha2Code;
  }
  if (!initialValues["avatar"]) {
    initialValues.avatar = config.avatars.baseAvatar;
  }

  return (
    <div className="main__body">
      <h2 className="h_decor">{_t("Profile")}</h2>
      <div className="main__bg">
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={user.edit}
          validate={userValidator.methodValidator.edit}
        >
          {({
            values,
            isValidating,
            isSubmitting,
            handleSubmit,
            setErrors,
            errors,
            touched,
            setFieldValue,
          }) => {
            let buildStats = {
              errors,
              touched,
              setFieldValue,
              userData,
              values,
            };

            let buildFields = (field, index) => (
              <BuildFieldBox
                {...buildStats}
                field={field}
                index={index}
                key={field}
              />
            );
            let avatarField = setFieldValue.bind(null, "avatar");
            return (
              <Form className="account_form account__content_box">
                <Avatar setFieldValue={avatarField} value={values["avatar"]} />
                {editFields.map(buildFields)}
                <div className="account__submit_box">
                  <label>
                    <input type="submit" className="hidden" value="" readOnly />
                    <span className="btn btn_big btn_green">{_t("Save")}</span>
                  </label>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userData: state.UserReducers.userData,
  };
};

export default connect(mapStateToProps, null)(Profile);
