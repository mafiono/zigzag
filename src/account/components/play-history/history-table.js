import React from "react";
import moment from "moment";
import { _t } from "../../../helpers";

const headerInfo = {
  gamedate: "Bet date",
  modified: "Last win date",
  gamename: "Game",
  bet: "Bet",
  win: "Win",
  balance: "Balance",
  bonus: "Bonus",
};

const onClickHeaderFunction = ({
  column,
  isActive,
  descendingOrder,
  setFieldValue,
  handleSubmit,
}) => {
  if (isActive) {
    setFieldValue("sortDirection", descendingOrder ? "asc" : "desc", false);
    return handleSubmit();
  }

  setFieldValue("sortDirection", "desc", false);
  setFieldValue("sortType", column, false);

  return handleSubmit();
};

const TableHeader = (props) => {
  let { sortDirection, sortType } = props,
    descendingOrder = sortDirection === "desc",
    loadMore = () => {
      props.setFieldValue("page", props.page + 1);
      props.handleSubmit();
    };

  return (
    <div className="account__table_wrap">
      <table className="account__table">
        <thead>
          <tr>
            {Object.keys(headerInfo).map((column) => {
              const isActive = sortType === column,
                clickFunction = onClickHeaderFunction.bind(null, {
                  ...props,
                  isActive,
                  column,
                  descendingOrder,
                });

              return (
                <th key={column}>
                  <span
                    onClick={clickFunction}
                    className={`sort_item${
                      isActive
                        ? descendingOrder
                          ? " ascensing"
                          : " descensing"
                        : ""
                    }`}
                  >
                    {_t(headerInfo[column])}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {props.row &&
            props.row.data.map((key, index) => {
              const { betDate, winDate, gameName, bet, win, balance, bonus } =
                key;
              return (
                <tr key={index}>
                  <td>{moment(betDate).format("DD.MM.YYYY HH:mm")}</td>
                  <td>{moment(winDate).format("DD.MM.YYYY HH:mm")}</td>
                  <td>{gameName}</td>
                  <td>{printNumber(bet)}</td>
                  <td>{printNumber(win)}</td>
                  <td>{printNumber(balance)}</td>
                  <td>{printNumber(bonus)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="account__submit_box">
        {props.row.pages && props.page + 1 !== props.row.pages && (
          <span className="btn btn_big btn_green" onClick={loadMore}>
            {_t("Load more")}
          </span>
        )}
      </div>
    </div>
  );
};

function printNumber(num) {
  return Number.isInteger(Number(num)) ? Number(num) : Number(num).toFixed(2);
}

function PlayHistoryTable(props) {
  return (
    <div className="history_table_wrap">
      <div className="history_table_mobile_wrap">
        <TableHeader {...props} />
      </div>
    </div>
  );
}

export default React.memo(PlayHistoryTable);
