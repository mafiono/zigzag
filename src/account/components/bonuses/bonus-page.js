import React, { useState } from "react";
import user from "../../../other/user";
import ConfirmPopUp from "../../../utils-components/confirm-pop-up";
import { _t } from "../../../helpers";
import ActiveBonus from "./active-bonus";
import AvailableBonuses from "./available-bonuses";

const openFunction = (togglePopUp, changeSelectedAction, type, uuid) => {
  changeSelectedAction({ type, uuid });
  return togglePopUp(true);
};

const functionRequest = (selectedAction, type, togglePopUp, changeRow) => {
  if (selectedAction.type === "reset") {
    user.resetBonus(type);
  } else {
    user.activateBonus(type, selectedAction.type, selectedAction.uuid);
  }
  togglePopUp(false);
  changeRow(-1);
};

const tableHeader = [
  "Bonus name",
  "Bonus Crediting Date",
  "Bonus cancellation",
  "Amount",
  "Bonus rollover",
];

export default ({ bonuses, isSport, activeBonus, currency }) => {
  const className = isSport ? "sport" : "casino",
    [popUpIsOpen, togglePopUp] = useState(false),
    [selectedAction, changeSelectedAction] = useState(null),
    [openRow, changeRow] = useState(0),
    openPopUp = openFunction.bind(null, togglePopUp, changeSelectedAction),
    closePopUp = () => togglePopUp(false),
    resetBonus = openPopUp.bind(null, "reset", ""),
    confirmFunction = functionRequest.bind(
      null,
      selectedAction,
      className,
      togglePopUp,
      changeRow
    );

  return (
    <div className="main__body">
      <h2 className="h_decor">{_t("Bonus")}</h2>
      <div className="main__bg">
        <ConfirmPopUp
          open={popUpIsOpen}
          closeFunction={closePopUp}
          heading="Please Confirm your action"
          confirmFunction={confirmFunction}
        />
        <ActiveBonus
          activeBonus={activeBonus}
          resetBonus={resetBonus}
          currency={currency}
          tableHeader={tableHeader}
        />
        <br />
        <br />
        <AvailableBonuses
          hasActiveBonus={!!(activeBonus && activeBonus.amount)}
          openPopUp={openPopUp}
          isSport={isSport}
          bonuses={bonuses}
          openRow={openRow}
          currency={currency}
          changeRow={changeRow}
          tableHeader={tableHeader}
        />
      </div>
    </div>
  );
};
