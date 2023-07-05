import helpers, { sleep } from "../helpers";
import user from "../other/user";
import config from "../config";

let withdraw = {};

withdraw.makeWithdraw = async (values) => {
  try {
    let bodyObject;

    if (values.isCrypto) {
      bodyObject = {
        paymethod: config.cpWithdrawName,
        amount: values.amount,
        account: values.method.prefix + values.account,
      };
    } else {
      bodyObject = {
        paymethod: values.method.name,
        amount: values.amount,
        account: values.account,
      };
    }
    return user.makeWithdraw(bodyObject);
  } catch (e) {
    return helpers.errorMessage(e.message);
  } finally {
    await sleep(500);
  }
};

export default withdraw;
