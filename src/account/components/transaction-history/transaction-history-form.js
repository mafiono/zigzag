import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import moment from "moment";

import { _t } from "../../../helpers";
import TransactionHistoryBody from "./transaction-history-body";
import Calendar from "../../../utils-components/calendar";
import {
  typeOptions,
  timeOptions,
  selectDateChange,
  formSubmit,
} from "./transaction-history-helper";

const now = moment().utc().endOf("day").toDate(),
  today = moment().utc().startOf("day").toDate();

const initialValues = {
  type: "",
  page: 0,
  to: now,
  from: today,
  period: "day",
};

const changeZIndex = (e, increment = true) => {
    e.currentTarget.style.zIndex = increment ? 3 : 2;
  },
  changeZIndexFalse = (e) => changeZIndex(e, false);

let prevFormState = initialValues;

export default ({ getResult, result }) => {
  const [showCalendar, toggleCalendar] = useState(false),
    formSubmitFunction = async (formJson) => {
      const formResult = await formSubmit(
        prevFormState,
        getResult,
        result,
        formJson
      );
      prevFormState = formResult;
    };

  useEffect(() => {
    formSubmitFunction(initialValues);
  }, []);
  return (
    <Formik initialValues={initialValues} onSubmit={formSubmitFunction}>
      {({
        values,
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => {
        let changeDateRange = selectDateChange.bind(
            null,
            setFieldValue,
            toggleCalendar,
            handleSubmit
          ),
          typeOptionsText = typeOptions.filter(
            (key) => key.value === values["type"]
          )[0],
          timeOptionsText = timeOptions.filter(
            (key) => key.value === values["period"]
          )[0];
        if (typeOptionsText) {
          typeOptionsText = typeOptionsText.label;
        }
        if (timeOptionsText) {
          timeOptionsText = timeOptionsText.label;
        }
        const changeWithSubmit = (key, value) => {
          setFieldValue(key, value, false);
          handleSubmit();
        };
        const nextPage = () => {
          setFieldValue("page", values["page"] + 1);
          handleSubmit();
        };
        return (
          <Form>
            <div className="account__filter_box">
              <label className="input_item_label">
                <span className="input_item_select_box">
                  <select
                    className="input_item_select"
                    defaultValue={values["type"]}
                    onChange={(e) =>
                      changeWithSubmit("type", e?.currentTarget?.value)
                    }
                  >
                    {typeOptions.map(({ value, label }) => {
                      return (
                        <option value={value} key={value}>
                          {_t(label)}
                        </option>
                      );
                    })}
                  </select>
                </span>
                <span className="input_item_select__center-text">
                  {_t(
                    typeOptions.find((v) => v.value === values["type"])?.label
                  )}
                </span>
              </label>
              <label className="input_item_label">
                <span className="input_item_select_box">
                  <select
                    className="input_item_select"
                    defaultValue={values["period"]}
                    onChange={changeDateRange}
                  >
                    {timeOptions.map(({ value, label }) => {
                      return (
                        <option value={value} key={value}>
                          {_t(label)}
                        </option>
                      );
                    })}
                  </select>
                </span>
                <span className="input_item_select__center-text">
                  {_t(
                    timeOptions.find((v) => v.value === values["period"])?.label
                  )}
                </span>
              </label>
              {showCalendar && (
                <>
                  <div
                    className="input_item_label input_item_select_box big_label"
                    onFocus={changeZIndex}
                    onBlur={changeZIndexFalse}
                  >
                    <Calendar
                      selectedDate={values["from"]}
                      maxDate={values["to"] || now}
                      showTime
                      className="account__input"
                      onChangeTrigger={changeWithSubmit.bind(null, "from")}
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
                      onChangeTrigger={changeWithSubmit.bind(null, "to")}
                    />
                  </div>
                </>
              )}
            </div>
            <TransactionHistoryBody nextPage={nextPage} result={result} />
          </Form>
        );
      }}
    </Formik>
  );
};
