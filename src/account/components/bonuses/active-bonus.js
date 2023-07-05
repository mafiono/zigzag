import React from "react";
import { _t } from "../../../helpers";
import moment from "moment";

function ActiveBonus({ activeBonus, resetBonus, currency, tableHeader }) {
  const isActiveBonus = !(!activeBonus || !Object.keys(activeBonus).length);

  let tableClassName = "account__table table_responsive";

  if (isActiveBonus) {
    tableClassName += " active";
  }
  const dang = {
    __html: _t(
      "Bonus will be cancelled if you click on the <b>Cancel</b> button."
    ),
  };

  let i = 0;
  return (
    <div>
      <h2 className="font_black">{_t("Active Bonus")}</h2>
      <div className="account__table_wrap">
        <table className={tableClassName}>
          <thead>
            {tableHeader.map((head) => (
              <th key={head}>{_t(head)}</th>
            ))}
            <th />
          </thead>
          {isActiveBonus && (
            <tbody>
              <tr>
                <td data-title={_t(tableHeader[i++])}>{_t("Active Bonus")}</td>
                <td data-title={_t(tableHeader[i++])}>{"----"}</td>
                <td data-title={_t(tableHeader[i++])}>
                  {moment(activeBonus.expires).format("DD-MM-YYYY")}
                </td>
                <td data-title={_t(tableHeader[i++])}>
                  {activeBonus.amount + " " + currency?.toUpperCase()}
                </td>
                <td data-title={_t(tableHeader[i++])}>
                  {parseInt(activeBonus.rolloverTotal) -
                    parseInt(activeBonus.rolloverPlayed)}
                </td>
                <td data-title={_t("cancel")}>
                  <span
                    className="btn btn_small btn_yellow"
                    onClick={resetBonus}
                  >
                    {_t("cancel")}
                  </span>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div className="text-center" dangerouslySetInnerHTML={dang} />
    </div>
  );
}

export default ActiveBonus;
