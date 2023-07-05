import React from "react";
import moment from "moment";

import { _t } from "../../../helpers";
import { TableHeader } from "./transaction-history-helper";

export default ({ result, nextPage }) => {
  if (!result) return null;
  return (
    <div className="account__table_wrap">
      <table className="account__table">
        <thead>
          <TableHeader />
        </thead>
        <tbody>
          {result.data.map((row, index) => {
            const { type, amount, date_init, status } = row;
            let statusClassName = "sort-item " + status + "_operation";

            return (
              <tr key={index}>
                <td>{_t(type)}</td>
                <td>{row["paymethod.title"]}</td>
                <td>{amount}</td>
                <td>{moment(date_init).format("DD.MM.YYYY HH:mm")}</td>
                <td className={statusClassName}>{_t(status)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {result.nextPage && (
        <div className="text-center" style={{ padding: "20px 0" }}>
          <span className="btn btn-second" onClick={nextPage}>
            {_t("More")}
          </span>
        </div>
      )}
    </div>
  );
};
