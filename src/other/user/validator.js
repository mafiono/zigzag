import fieldValidator from "./field-validator";
import helpers, { _t } from "../../helpers";
import config from "../../config";

let userValidator = {};
userValidator.fieldValidator = fieldValidator;
userValidator.methodValidator = {};
userValidator.methodFields = {};

userValidator.methodValidator.registration = (currencies, baseFields) => {
  let registrationFields = userValidator.methodFields.registration;

  const fieldsKeys = Object.keys(baseFields).sort();
  if (
    JSON.stringify(Object.keys(registrationFields).sort()) !==
    JSON.stringify(fieldsKeys)
  ) {
    helpers.errorMessage(_t("Some bad message regarding form manipulation"));
  }

  let errors = {},
    fieldsKeysLength = fieldsKeys?.length;
  for (let i = 0; i < fieldsKeysLength; i++) {
    if (userValidator.fieldValidator[fieldsKeys[i]]) {
      userValidator.fieldValidator[fieldsKeys[i]](
        baseFields,
        registrationFields[fieldsKeys[i]].required,
        errors,
        currencies
      );
    } else {
      helpers.errorMessage(_t("Some bad message regarding form manipulation"));
      break;
    }
    // check if it exist
  }
  return errors;
};

userValidator.methodValidator.edit = (fields) => {
  const fieldsKeys = Object.keys(fields).sort();

  if (
    JSON.stringify(Object.keys(userValidator.methodFields.edit).sort()) !==
    JSON.stringify(fieldsKeys)
  ) {
    helpers.errorMessage(_t("Some bad message regarding form manipulation"));
  }
  const editFields = userValidator.methodFields.edit;
  let errors = {},
    fieldsKeysLength = fieldsKeys.length;
  for (let i = 0; i < fieldsKeysLength; i++) {
    if (userValidator.fieldValidator[fieldsKeys[i]]) {
      userValidator.fieldValidator[fieldsKeys[i]](
        fields,
        editFields[fieldsKeys[i]].required,
        errors
      );
    } else {
      helpers.errorMessage(_t("Some bad message regarding form manipulation"));
      break;
    }
    // check if it exist
  }
  return errors;
};
userValidator.methodValidator.login = (fields) => {
  const fieldsKeys = Object.keys(fields).sort();

  if (
    JSON.stringify(Object.keys(userValidator.methodFields.login).sort()) !==
    JSON.stringify(fieldsKeys)
  ) {
    helpers.errorMessage(_t("Some bad message regarding form manipulation"));
  }
  const loginFields = userValidator.methodFields.login;
  let errors = {},
    fieldsKeysLength = fieldsKeys.length;
  for (let i = 0; i < fieldsKeysLength; i++) {
    if (userValidator.fieldValidator[fieldsKeys[i]]) {
      userValidator.fieldValidator[fieldsKeys[i]](
        fields,
        loginFields[fieldsKeys[i]].required,
        errors
      );
    } else {
      helpers.errorMessage(_t("Some bad message regarding form manipulation"));
      break;
    }
    // check if it exist
  }
  return errors;
};

userValidator.methodFields = {
  registration: {
    login: {
      order: 0,
      label: "login_field_registration_form",
      required: true,
      half: true,
    },
    password: {
      order: 5,
      label: "Password",
      required: true,
      type: "password",
      half: true,
    },
    email: {
      order: 15,
      label: "Email",
      required: true,
      type: "email",
      half: true,
    },
    name: {
      order: 20,
      label: "Name",
      half: true,
    },
    surname: {
      order: 25,
      label: "Surname",
      half: true,
    },
    phone: {
      order: 30,
      label: "Phone",
      type: "custom",
      defaultValue: "",
      customTag: "phoneInput",
    },
    city: {
      order: 35,
      label: "City",
    },
    birthDay: {
      order: 42,
      type: "custom",
      customTag: "calendar",
      label: "Date of Birth",
      defaultValue: null,
      half: true,
    },
    country: {
      order: 37,
      label: "Country",
      required: true,
      type: "custom",
      customTag: "countrySelect",
    },
    avatar: {
      order: 38,
      required: true,
      type: "custom",
      customTag: "avatar",
      defaultValue: config.avatars.baseAvatar,
      label: "Avatar",
    },
    accept: {
      order: 40,
      required: true,
      label:
        'I confirm that I am 18 years or older and accept the <a href="/en/p/rules">Terms and Conditions</a>  and <a href="/en/p/privacy-policy">Privacy Policy</a> of  {{casino}}.  I consent to the processing of my personal data to use this service.',
      labelHtml: true,
      type: "checkbox",
      defaultValue: true,
    },
    notifications: {
      order: 41,
      required: false,
      label: "Notifications",
      type: "checkbox",
      defaultValue: true,
    },
    sms: {
      order: 42,
      required: false,
      label: "SMS-Bonus",
      type: "checkbox",
      defaultValue: true,
    },
    autobonus: {
      order: 43,
      required: false,
      label: "i would like bonuses to be automatically credited to my account",
      type: "checkbox",
      defaultValue: true,
    },
    gender: {
      order: 45,
      required: true,
      type: "custom",
      customTag: "customSelect",
      defaultValue: "m",
      placeholder: "Gender",
      half: true,
      option: [
        {
          value: "m",
          label: "Male",
        },
        {
          value: "f",
          label: "Female",
        },
      ],
    },
    currency: {
      order: 50,
      required: true,
      type: "custom",
      customTag: "customSelect",
      defaultValue: "",
      option: [],
    },
    promocode: {
      order: 60,
      label: "Promo code",
      pattern: "[a-zA-Z0-9]{5,32}",
      required: false,
    },
  },
  login: {
    loginOrEmail: {
      order: 1,
      label: "Login",
      required: true,
    },
    passwordLogin: {
      order: 5,
      type: "password",
      label: "Password",
      required: true,
    },
    remember: {
      order: 10,
      label: "Password",
      required: true,
    },
  },
  edit: {
    name: {
      order: 2,
      label: "Name",
      required: true,
    },
    surname: {
      order: 5,
      label: "Surname",
      required: true,
    },
    country: {
      order: 7,
      label: "Country",
      required: true,
      type: "custom",
      customTag: "countrySelect",
    },
    city: {
      order: 10,
      label: "City",
      required: true,
    },
    address: {
      order: 15,
      label: "Address",
    },
    avatar: {
      order: 1,
      label: "Avatar",
      required: true,
      defaultValue: config.avatars.baseAvatar,
      type: "custom",
      customTag: "avatar",
    },
    zipCode: {
      order: 20,
      label: "Post Code",
      required: false,
    },
    birthDay: {
      order: 25,
      label: "Date of Birth",
      required: true,
      type: "custom",
      placeholder: "Date of Birth",
      customTag: "calendar",
      defaultValue: null,
    },
    phone: {
      order: 30,
      label: "Phone",
      required: false,
      type: "custom",
      customTag: "phoneInput",
    },
    email: {
      order: 35,
      label: "Email",
      required: true,
      type: "email",
    },
    gender: {
      order: 45,
      required: true,
      label: "Gender",
      type: "custom",
      customTag: "customSelect",
      defaultValue: "m",
      option: [
        {
          value: "m",
          label: "Male",
        },
        {
          value: "f",
          label: "Female",
        },
      ],
    },
  },
};

export default userValidator;
