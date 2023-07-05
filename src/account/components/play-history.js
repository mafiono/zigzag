import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { _t } from "../../helpers";
import user from "../../other/user";
import HistoryTable from "./play-history/history-table.js";
import Calendar from "../../utils-components/calendar";

let isMounted = false;
const currentYear = new Date().getFullYear(),
  perPageValues = [
    {
      label: 20,
      value: 20,
    },
    {
      label: 30,
      value: 30,
    },
    {
      label: 50,
      value: 50,
    },
  ];
let initialValues = {
  from: "",
  to: "",
  page: 0,
  perPage: 20,
  sortType: "modified",
  sortDirection: "desc",
};
let years = [];
for (let i = 1930; i < currentYear; i++) {
  years.push(i);
}
years.push(currentYear);

const changeZIndex = (e, increment = true) => {
    e.currentTarget.style.zIndex = increment ? 3 : 2;
  },
  changeZIndexFalse = (e) => changeZIndex(e, false);

const formSubmit = async (getTableInfo, formJson) => {
  let result = await user.buildPlayHistory(formJson);
  if (result && isMounted) {
    getTableInfo((prevState) => {
      if (!prevState) {
        return result;
      }
      let newResult = { ...result };
      newResult.data = [...prevState.data, ...result.data];
      return newResult;
    });
  }
};

export default function PlayHistory(props) {
  const [tableInfo, getTableInfo] = useState(null),
    [table, useTable] = useState(true),
    submitFunction = formSubmit.bind(null, getTableInfo),
    now = new Date();
  initialValues = { ...initialValues, to: new Date() };

  useEffect(() => {
    isMounted = true;
    submitFunction(initialValues);
    return () => (isMounted = false);
  }, []);

  return (
    <div className="account__content_box">
      <Formik initialValues={initialValues} onSubmit={submitFunction}>
        {({ values, handleSubmit, isSubmitting, setFieldValue }) => {
          let perPageFunction = (e) => {
              setFieldValue("perPage", e.currentTarget.value, false);
              handleSubmit();
            },
            calendarFunction = (field, val) => {
              setFieldValue(field, val, false);
              handleSubmit();
            };

          return (
            <div className="main__body">
              <h2 className="h_decor">{_t("Play history")}</h2>
              <div className="main__bg">
                <Form>
                  <div className="account__filter_box">
                    <div
                      className="input_item_label input_item_select_box big_label"
                      onFocus={changeZIndex}
                      onBlur={changeZIndexFalse}
                    >
                      <Calendar
                        selectedDate={values["from"]}
                        maxDate={values["to"] || now}
                        showTime
                        placeholder={_t("Bet date from")}
                        onChangeTrigger={calendarFunction.bind(this, "from")}
                      />
                    </div>
                    <div
                      className="input_item_label input_item_select_box big_label"
                      onFocus={changeZIndex}
                      onBlur={changeZIndexFalse}
                    >
                      <Calendar
                        selectedDate={values["to"]}
                        maxDate={now}
                        showTime
                        minDate={values["from"]}
                        onChangeTrigger={calendarFunction.bind(this, "to")}
                      />
                    </div>
                    <label className="input_item_label small_label">
                      <span className="input_item_select_box">
                        <select
                          className="input_item_select"
                          defaultValue={values["perPage"]}
                          onChange={perPageFunction}
                        >
                          {perPageValues.map(({ value, label }) => {
                            return (
                              <option value={value} key={value}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                        <span className="input_item_select__center-text">
                          {
                            perPageValues.find(
                              (v) => v.value === parseInt(values["perPage"])
                            )?.label
                          }
                        </span>
                      </span>
                    </label>
                    {
                      // <button type="button" className="btn btn-second" onClick={changeDateWithPage.bind(null,setFieldValue,handleSubmit)}>show</button>
                      // <button type="button" className="btn btn-second" onClick={() => useTable(!table)}>ChangeView</button>
                    }
                  </div>
                  {
                    tableInfo && table ? (
                      <HistoryTable
                        sortDirection={values["sortDirection"]}
                        sortType={values["sortType"]}
                        setFieldValue={setFieldValue}
                        handleSubmit={handleSubmit}
                        row={tableInfo}
                        page={values["page"]}
                      />
                    ) : null
                    // <Statistics row={tableInfo}/>
                  }
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}
