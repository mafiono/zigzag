import helpers from "../../helpers";
import config from "../../config";
import moment from "moment";

const _t = helpers.translate.getTranslation,
  noTagRegex = /(<([^>]+)>)/gi;

let fieldValidator = {
  login: (fields, required, errors) => {
    let login = fields.login.trim(),
      loginRegex = /[^a-zA-Z0-9_-]+/;

    if (!login) {
      return (errors.login = _t("Login is not indicated"));
    }
    if (loginRegex.test(login)) {
      return (errors.login = _t(
        "The login contains forbidden characters. You can use letters (A-Z a-z), numbers (0-9) and the following characters: -_"
      ));
    }
    if (login.length > 12 || login.length < 5) {
      return (errors.login = _t(
        "Login should be between 5-12 chars with no spaces"
      ));
    }
    fields.login = login;
  },
  password: (fields, required, errors) => {
    let password = fields.password,
      regex = /[^\w\d !"#$%&'()*+,\-.\/:;<=>?@[\]^_`{|}../..]+/;
    if (!password && required) {
      return (errors.password = _t("Password not specified"));
    }
    if (typeof password !== "string" || password.length < 6) {
      return (errors.password = _t(
        "Minimum password length is {{minlength}} characters",
        { "{{minlength}}": 6 }
      ));
    }
    if (password.length > 50) {
      return (errors.password = _t("Maximum password length is 50 characters"));
    }
    if (regex.test(password)) {
      return (errors.password = _t(
        `The password contains forbidden characters. You can use letters (A-Z a-z), numbers (0-9) and the following characters: !"#$%&amp;'()*+,-./:;&lt;=&gt;?@[]^_\`{|}../..`
      ));
    }
  },
  retype: (fields, required, errors) => {
    if (!fields.retype && required) {
      errors.retype = _t("Please confirm your password");
    } else if (fields.retype !== fields.password) {
      errors.retype = _t(
        "There was an error validating the password confirmation, please make sure you filled the fields in correctly"
      );
    }
  },
  email: (fields, required, errors) => {
    let email = fields.email.trim(),
      emailRegex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (typeof email !== "string" || (!email && required)) {
      errors.email = _t("please enter your email address");
    }
    if (email.length > 254) {
      errors.email = _t("Please enter E-mail no more than 100 characters");
    }
    if (!emailRegex.test(email)) {
      errors.email = _t("The format of the e-mail address is incorrect");
    }
    fields.email = email;
  },
  name: (fields, required, errors) => {
    let name = fields.name.trim();
    if (name || required) {
      if (
        typeof name !== "string" ||
        name.length > 30 ||
        noTagRegex.test(name)
      ) {
        errors.name = _t("Name should be max 30 characters long");
      }
    }
    fields.name = helpers.escapeHtml(name);
  },

  surname: (fields, required, errors) => {
    let surname = fields.surname.trim();
    if (surname || required) {
      if (
        typeof surname !== "string" ||
        surname.length > 30 ||
        noTagRegex.test(surname)
      ) {
        errors.surname = _t("Surname should be max 30 characters long");
      }
    }
    fields.surname = helpers.escapeHtml(surname);
  },
  city: (fields, required, errors) => {
    let city = fields.city.trim();
    if (city || required) {
      if (
        typeof city !== "string" ||
        city.length < 3 ||
        city.length > 50 ||
        noTagRegex.test(city)
      ) {
        errors.city = _t(
          "City should be between {{min}} and {{max}} characters long",
          { "{{min}}": 3, "{{max}}": 50 }
        );
      }
    }
    fields.city = helpers.escapeHtml(city);
  },
  phone: (fields, required, errors) => {
    let phone = fields.phone.replace(/\s/g, ""),
      regexNumbers = /\D/;
    if (phone || required) {
      if (phone.length < 7 || phone.length > 14) {
        errors.phone = _t("Incorrect phone number");
      }
      if (regexNumbers.test(phone.substr(1))) {
        errors.phone = _t("Incorrect phone number");
      }
    }
    // fields.phone = phone || '';
  },
  accept: (fields, required, errors) => {
    if (typeof fields.accept !== "boolean" || !fields.accept) {
      errors.accept = _t("The Terms & Conditions field is required");
    }
  },
  gender: (fields, required, errors) => {
    let gender = fields.gender;
    if (gender || required) {
      if (["m", "f"].indexOf(gender.toLowerCase()) === -1) {
        errors.gender = _t("Specify gender");
      }
    }
    fields.gender = gender.toLowerCase();
  },
  currency: (fields, required, errors, currencies) => {
    let currency = fields.currency;

    if (currency || required) {
      currency = currency.toLowerCase();
      if (typeof currency !== "string" || currency?.length !== 3) {
        errors.currency = _t("Incorrect currency");
      }
      if (!currencies.includes(currency)) {
        errors.currency = _t("Incorrect currency");
      }
      fields.currency = currency;
    }
  },
  notifications: (fields, required, errors) => {
    if (fields.notifications && typeof fields.notifications !== "boolean") {
      errors.notifications = _t("Incorrect notification param");
    }
  },
  sms: (fields, required, errors) => {
    if (fields.sms && typeof fields.sms !== "boolean") {
      errors.sms = _t("Incorrect sms param");
    }
  },
  autobonus: (fields, required, errors) => {
    if (fields.autobonus && typeof fields.autobonus !== "boolean") {
      errors.autobonus = _t("Incorrect autobonus param");
    }
  },
  birthDay: (fields, required, errors) => {
    let birthday = fields.birthDay;
    let birthdayObject = moment(birthday);
    if (!birthdayObject.isValid()) {
      errors.birthDay = _t("Incorrect birthday");
    }
    if (moment().diff(birthdayObject, "years", true) < 18) {
      errors.birthDay = _t("You must be at least 18 years old to register");
    }
    fields.birthDay = birthday;
  },
  address: (fields, required, errors) => {
    let address = fields.address.trim();
    if (address || required) {
      if (
        address.length < 5 ||
        address.length > 100 ||
        noTagRegex.test(address)
      ) {
        errors.address = _t(
          "Address should be between 5 and 100 characters long"
        );
      }
    }
    fields.address = address;
  },
  country: (fields, required, errors) => {
    let country = fields.country;
    if (country || required) {
      if (typeof country !== "string" || country.length !== 2) {
        errors.country = _t(
          "The c code must match the two-letter ISO 3166 format"
        );
      }
    }
    fields.country = helpers.escapeHtml(country).toUpperCase();
  },
  zipCode: (fields, required, errors) => {
    let zipCode = fields.zipCode.trim();
    if (zipCode || required) {
      if (zipCode.length < 3 || zipCode.length > 12) {
        errors.zipCode = _t(
          "ZIP code should be between 3 and 12 characters long"
        );
      }
    }
    fields.zipCode = helpers.escapeHtml(zipCode);
  },
  loginOrEmail: (fields, required, errors) => {
    let login = fields.loginOrEmail.trim();
    if (
      !login ||
      typeof login !== "string" ||
      login.length < 5 ||
      login.length > 25
    ) {
      //25 for compatibility, max length in the db as of 26/06/2019 is 25chars
      errors.loginOrEmail = _t("Wrong username or password");
    }
    fields.loginOrEmail = helpers.escapeHtml(login);
  },
  passwordLogin: (fields, required, errors) => {
    let password = fields.passwordLogin;
    if (!password || typeof password !== "string" || password.length < 6) {
      errors.passwordLogin = _t("Wrong username or password");
    }
    fields.passwordLogin = helpers.escapeHtml(password);
  },
  remember: (fields, required, errors) => {
    if (fields.remember && typeof fields.remember !== "boolean") {
      helpers.errorMessage(_t("Some bad message regarding form manipulation"));
    }
  },
  promocode: (fields, required, errors) => {
    let promo = fields.promocode.trim();

    if (promo && !/^[a-z0-9]{5,32}$/i.test(promo)) {
      errors.promocode = _t("This promo code is invalid");
    }
  },
  avatar: (fields, required, errors) => null,
};
export default fieldValidator;
