import { _t } from "../../../helpers";

function validator(values, formProps) {
  let errors = {};
  const { amount, method, account } = values;
  if (amount < method?.minWithdraw) {
    errors.ammount = _t("Withdrawal amount is less than required");
  }
  if (amount > method?.maxWithdraw) {
    errors.ammount = _t(
      "Maximum withdrawal amount is {{amount}} {{currency}}!",
      {
        "{{amount}}": method.maxWithdraw,
        "{{currency}}": "",
      }
    );
  }
  if (!account) {
    errors.account = _t("Please enter your card/wallet number");
  }
  return errors;
}

export default validator;
