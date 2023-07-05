import React from "react";
import { connect } from "react-redux";
import BonusPage from "./bonuses/bonus-page";

const mapStateToProps = (state, ownProps) => {
  let bonuses = state.UserReducers.userData.availableBonuses,
    isSport = ownProps.match.url.includes("sport-bonus"),
    activeBonus = isSport
      ? state.UserReducers.userData?.sportBonus
      : state.UserReducers.userData?.casinoBonus,
    currency = state.UserReducers.userData.currency;

  bonuses = bonuses.filter(
    (bonus) => bonus.type === (isSport ? "sport" : "casino")
  );

  return {
    bonuses,
    isSport,
    activeBonus,
    currency,
  };
};

function Bonus(props) {
  return <BonusPage {...props} />;
}

export default connect(mapStateToProps)(React.memo(Bonus));
