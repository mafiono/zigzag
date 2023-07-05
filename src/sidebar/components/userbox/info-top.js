import React from "react";
import config from "../../../config";
import helpers from "../../../helpers";

export default function InfoTop(props) {
  const { userData, isSport, toggleAccountMenu } = props;

  let progressBarWidth = -1,
    bonusValue = 0,
    activeBonus;

  if (isSport && userData.sportBonus) {
    const { rolloverTotal, rolloverPlayed, amount } = userData.sportBonus;

    bonusValue = amount;
    if (amount && rolloverTotal && rolloverPlayed) {
      progressBarWidth = (100 / (rolloverTotal / rolloverPlayed)).toFixed(2);
    }
    activeBonus = userData.sportBonus;
  } else if (!isSport && userData?.casinoBonus) {
    const { rolloverTotal, rolloverPlayed, amount } = userData.casinoBonus;

    bonusValue = amount;
    if (amount && rolloverTotal && rolloverPlayed) {
      progressBarWidth = (100 / (rolloverTotal / rolloverPlayed)).toFixed(2);
    }
    activeBonus = userData.casinoBonus;
  }

  return (
    <div className="user_box__info_top">
      <div
        className={`user_box__info_bonus_line${activeBonus ? " active" : ""}`}
      >
        <div className="user_box__bonus_progress_box">
          <div
            className="user_box__bonus_progress_line"
            style={{ width: progressBarWidth + "%" }}
          />
        </div>
        <div className="user_box__bonus_progress_cash_info">
          <img
            src={config.initialImgPath + "other/cr.svg"}
            alt=""
            className="user_box__bonus_line_img"
          />
          {bonusValue}
        </div>
        <div className="user_box__bonus_progress_info">
          {helpers.beatifyNumber(activeBonus?.rolloverPlayed || 0)}/
          {helpers.beatifyNumber(activeBonus?.rolloverTotal || 0)}
        </div>
        <div className="user_box__cash_line">
          <span className="cash_type">{userData.currency + " "}</span>
          <span className="cash_current_balance">
            {helpers.beatifyNumber(userData.balance)}
          </span>
        </div>
      </div>
      <div className="user_box__login_line" onClick={toggleAccountMenu}>
        <span>{userData.login}</span>
      </div>
    </div>
  );
}
