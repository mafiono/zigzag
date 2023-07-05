import helpers from "../helpers";
import request from "../request";
import loader from "../other/loader";

let bonuses = {};

//redux
export const BonusesConstants = {
  SET_BONUSES: "SET_BONUSES",
};
let BonusesActions = {};

BonusesActions.setBonuses = (bonuses = []) => {
  return {
    type: BonusesConstants.SET_BONUSES,
    bonuses,
  };
};

export { BonusesActions };

bonuses.getAllBonuses = async (props) => {
  try {
    loader.show();
    let allBonuses = await request.make({}, "/data/get-bonuses");
    props.dispatch(BonusesActions.setBonuses(allBonuses));
    loader.hide();
    return Promise.resolve();
  } catch (err) {
    helpers.errorMessage(err.message);
    loader.hide();
    return Promise.resolve();
  }
};

export default bonuses;
