import React from "react";
import { _t } from "../../../helpers";
import moment from "moment";

function AvailableBonuses({
  hasActiveBonus,
  isSport,
  currency,
  openPopUp,
  bonuses,
  openRow,
  changeRow,
  tableHeader,
}) {
  return (
    <div>
      <h2 className="font_black">{_t("Available bonuses")}</h2>
      <div className="account__table_wrap">
        <table className="account__table table_responsive">
          <thead>
            <tr>
              {tableHeader.map((head) => (
                <th>{_t(head)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bonuses?.map((bonus, index) => {
              let mergeBonus = openPopUp.bind(null, "merge", bonus.uuid),
                activateBonus = openPopUp.bind(null, "replace", bonus.uuid),
                { name, created, expired, amount, rollover } = bonus;

              let i = 0;
              return (
                <>
                  <tr>
                    <td data-title={tableHeader[i++]}>{_t(name)}</td>
                    <td data-title={tableHeader[i++]}>
                      {moment(created).format("DD.MM.YYYY")}
                    </td>
                    <td data-title={tableHeader[i++]}>
                      {moment(expired).format("DD.MM.YYYY")}
                    </td>
                    <td data-title={tableHeader[i++]}>
                      {amount + " " + currency?.toUpperCase()}
                    </td>
                    <td data-title={tableHeader[i++]}>
                      {rollover + " " + currency?.toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5">
                      {hasActiveBonus ? (
                        <div className="text-center">
                          <span
                            className="btn btn_small"
                            onClick={activateBonus}
                          >
                            {_t("Replace Bonus")}
                          </span>
                          {!isSport && (
                            <span
                              className="btn btn_small btn_yellow"
                              onClick={mergeBonus}
                            >
                              {_t("Merge Bonuses")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <span
                            className="btn btn_small"
                            onClick={activateBonus}
                          >
                            {_t("Bonus Activate")}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      {!!bonuses?.length && (
        <p className="text-center">
          <span
            dangerouslySetInnerHTML={{
              __html: _t(
                `When you click the <b class="bold">"Replace"</b> button, the current bonus will be cancelled and replaced as well as it's wagering`
              ),
            }}
          />
          <br />
          {!isSport && (
            <span
              dangerouslySetInnerHTML={{
                __html: _t(
                  `When you click the <b class="bold">"Merge"</b> button, the amount of bonuses will be combined, as well as their wagering`
                ),
              }}
            />
          )}
        </p>
      )}
    </div>
  );
}
export default AvailableBonuses;
