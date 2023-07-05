import React, { useState, useEffect } from "react";
import request from "../../request";
import helpers, { _t } from "../../helpers";
import user from "../../other/user";
import moment from "moment";

const tableHeading = ["Payment Method", "Amount", "Date", "cancel"];

async function getWithrawData(getData) {
  let result = null;
  try {
    result = await request.make({}, "/payment/pending-withdraws");
    getData(result);
  } catch (e) {
    helpers.errorMessage(e.message);
  }
}

function WithdrawCancel(props) {
  const [data, getData] = useState([]),
    setData = getWithrawData.bind(null, getData);

  useEffect(() => {
    setData();
  }, []);

  return (
    <div className="main__body">
      <h2 className="h_decor">{_t("Cancel withdraw")}</h2>
      <div className="main__bg">
        <div className="account__table_wrap">
          <table className="account__table table_responsive">
            <thead>
              <tr>
                {tableHeading.map((cell) => (
                  <th key={cell}>
                    <span className="sort_item">{_t(cell)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const onClickFunction = async () => {
                    await user.cancelWithdraw({ uuid: row.uuid });
                    setData();
                  },
                  { paymethod, amount, date_init } = row;
                return (
                  <tr key={row.uuid}>
                    <td data-title={_t("Payment Method")}>{paymethod}</td>
                    <td data-title={_t("Amount")}>{amount}</td>
                    <td data-title={_t("Date")}>
                      {moment(date_init).format("DD/MM/YYYY, hh:mm")}
                    </td>
                    <td data-title={_t("cancel")}>
                      <span
                        className="btn btn_small btn_green"
                        onClick={onClickFunction}
                      >
                        {_t("cancel")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// mocks
// [{"paymethod":"Bank Cards","amount":1000,"date_init":"2020-08-17T08:16:55.000Z","uuid":"3a5b0960-f25d-4419-96e9-95779500518c"},{"paymethod":"Bank Cards","amount":1000,"date_init":"2020-08-17T08:16:55.000Z","uuid":"3a5b0960-f25d-4419-96e9-95779500518c"}]

export default WithdrawCancel;
