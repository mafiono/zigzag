import React from "react";
import user from "../../../other/user";
import moment from "moment";
import helpers, { _t } from "../../../helpers";

const today = moment().utc().startOf("day").toDate(),
  monthAgo = moment().utc().add("-1", "months").startOf("day").toDate();

export const typeOptions = [
  {
    value: "",
    label: "all",
  },
  {
    value: "deposit",
    label: "Deposits",
  },
  {
    value: "withdraw",
    label: "Withdrawals",
  },
];

export const timeOptions = [
  {
    value: "day",
    label: "Today",
  },
  {
    value: "month",
    label: "Month",
  },
  {
    value: "specific",
    label: "Period",
  },
];

export const selectDateChange = (
  setFieldValue,
  toggleCalendar,
  handleSubmit,
  e
) => {
  let now = moment().utc().endOf("day").toDate();
  const val = e.currentTarget.value;

  switch (val) {
    case "day":
      setFieldValue("from", today, false);
      setFieldValue("to", now, false);
      toggleCalendar(false);
      break;
    case "month":
      setFieldValue("from", monthAgo, false);
      setFieldValue("to", now, false);
      toggleCalendar(false);
      break;
    default:
      toggleCalendar(true);
  }
  setFieldValue("period", val, false);
  handleSubmit();
};

const headers = ["Type", "Payment Method", "Amount", "Date", "Status"];

export const TableHeader = () => {
  return (
    <tr>
      {headers.map((key) => (
        <th key={key}>
          <span className="sort_item">{_t(key)}</span>
        </th>
      ))}
    </tr>
  );
};
export const formSubmit = async (
  prevFormState,
  getResult,
  result,
  formJson
) => {
  let formData = { ...formJson };
  let nextPage =
    result && helpers.objectsAreEqual(prevFormState, formJson, ["page"]);
  if (!nextPage) {
    formData.page = 0;
  }

  let jsonResult = await user.buildTransactionHistory(formData);

  if (nextPage) {
    let newData = { ...result, ...jsonResult };
    newData.data = result.data.concat(jsonResult.data);
    getResult(newData);
    return prevFormState;
  }

  getResult(jsonResult);
  return (prevFormState = formJson);
};

// mocks
// {"nextPage":1,"data":[{"type":"withdraw","amount":1000,"status":"cancel","date_init":"2020-08-17T08:16:55.000Z","paymethod.title":"Bank Cards"},{"type":"deposite","amount":500,"status":"complete","date_init":"2020-08-17T08:16:25.000Z","paymethod.title":null},{"type":"deposite","amount":1000,"status":"pending","date_init":"2020-08-10T11:40:58.000Z","paymethod.title":"Visa & Master"},{"type":"deposite","amount":1000,"status":"pending","date_init":"2020-08-10T11:38:45.000Z","paymethod.title":"Visa & Master"},{"type":"deposite","amount":1000,"status":"pending","date_init":"2020-08-10T11:38:35.000Z","paymethod.title":"Visa & Master"}]}
