import helpers from "../../../helpers";
const _t = helpers.translate.getTranslation;

function validator(values) {
  let errors = {};
  const { amount, method } = values;
  if (amount < method?.minDeposit) {
    errors.ammount = _t("Minimum deposit amount is {{amount}} {{currency}}!", {
      "{{amount}}": method.minDeposit,
      "{{currency}}": "",
    });
  }
  if (amount > method?.maxDeposit) {
    errors.ammount = _t("Maximum deposit amount is {{amount}} {{currency}}!", {
      "{{amount}}": method.maxDeposit,
      "{{currency}}": "",
    });
  }
  return errors;
}
export default validator;
