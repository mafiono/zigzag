import helpers from "../../../helpers";

const _t = helpers.translate.getTranslation;

function validateForm({ oldPassword, newPassword, retype }) {
  let errors = {};
  if (!oldPassword) {
    errors.oldPassword = _t("Password not specified");
  } else if (oldPassword.length < 6) {
    errors.oldPassword = _t(
      "Password should be at least 6 chars with no spaces"
    );
  }

  if (!newPassword) {
    errors.newPassword = _t("Please enter new password");
  } else if (newPassword < 6) {
    errors.newPassword = _t(
      "Password should be at least 6 chars with no spaces"
    );
  }

  if (!retype) {
    errors.retype = _t("Confirm password");
  } else if (retype !== newPassword) {
    errors.retype = _t(
      "There was an error validating the password confirmation, please make sure you filled the fields in correctly"
    );
  }
  return errors;
}
export default validateForm;
