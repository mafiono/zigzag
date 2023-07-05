import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import helpers from "../helpers";
import "react-datepicker/dist/react-datepicker.css";
import "./css/calendar.scss";
import { connect } from "react-redux";

const _t = helpers.translate.getTranslation;
const years = [],
  hours = [],
  minutes = [],
  nowYear = new Date().getFullYear();

for (let i = 1930; i < nowYear; i++) {
  years.push(i);
}
years.push(nowYear);
for (let i = 0; i < 60; i++) {
  let result = i;
  if (i < 10) {
    result = "0" + i;
  }
  if (i < 25) {
    hours.push(result);
  }
  minutes.push(result);
}
const Locales = {
  en: "en-US",
  ru: "ru",
  pl: "pl",
  pt: "pt",
  de: "de",
  ro: "ro",
  zh: "zh-CN",
  uk: "uk",
  tr: "tr",
};

class Calendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openSelect: null,
      ready: false,
    };
    this.hoursSelect = React.createRef();
    this.minuteSelect = React.createRef();
    this.inputRef = React.createRef();
    this.customHeader = this.customHeader.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.registerCalendarLocale = this.registerCalendarLocale.bind(this);
  }
  componentDidMount() {
    this.registerCalendarLocale();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.registerCalendarLocale();
    }
  }
  registerCalendarLocale() {
    const { language } = this.props;

    import(`date-fns/locale/${Locales[language] || Locales["en"]}`).then(
      (module) => {
        registerLocale(language, module.default);
        this.setState(() => ({ ready: true }));
      }
    );
  }
  render() {
    if (!this.state.ready) {
      return null;
    }
    const Input = React.forwardRef((props, ref) => {
      return (
        <input
          type="text"
          ref={ref}
          onFocus={props.onFocus}
          value={props.value}
          placeholder={props.placeholder}
          onKeyDown={props.onKeyDown}
          className={`react-datepicker-input ${props.className}`}
          onClick={props.onClick}
          readOnly
        />
      );
    });
    let datePickerProps = {
      locale: this.props.language,
      selected: this.props.selectedDate,
      onChange: this.props.onChangeTrigger,
      dateFormat: this.props.dateFormat || "dd.MM.yyyy HH:mm",
      showTimeSelect: this.props.showTime,
      shouldCloseOnSelect: true,
      placeholderText: this.props.placeholder,
      timeIntervals: this.props.showTime ? 60 : undefined,
      calendarClassName: this.props.showTime
        ? "time-select-calendar"
        : undefined,
      maxDate: this.props.maxDate,
      minDate: this.props.minDate,
      popperPlacement: "top-end",
      tabIndex: 0,
      customInput: <Input />,
    };
    datePickerProps.renderCustomHeader = (props) => {
      let newProps = { ...props, ...datePickerProps };
      let hours = this.hoursSelect.current;
      let minute = this.minuteSelect.current;
      if (hours) {
        newProps.date.setHours(hours.value);
        newProps.date.setMinutes(minute.value);
      }
      return this.customHeader(newProps);
    };
    return <DatePicker {...datePickerProps} />;
  }
  changeTime(onChange, date, e) {
    let newDate = date,
      hours = this.hoursSelect.current,
      itHours = e.currentTarget === hours,
      minute = this.minuteSelect.current;

    if (itHours) {
      newDate.setHours(hours.value);
      hours.previousSibling.children[0].innerText = hours.value;
    } else {
      newDate.setMinutes(minute.value);
      minute.previousSibling.children[0].innerText = minute.value;
    }
    this.setState({ openSelect: null });
    return onChange(newDate);
  }
  customHeader(props) {
    const {
      date,
      changeYear,
      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled,
      maxDate,
      onChange,
      timeIntervals,
    } = props;
    const changeTimeFunction = this.changeTime.bind(null, onChange, date),
      showHours = () =>
        this.setState((prevState) => ({
          openSelect: prevState.openSelect === "hours" ? null : "hours",
        })),
      showMinutes = () =>
        this.setState((prevState) => ({
          openSelect: prevState.openSelect === "minutes" ? null : "minutes",
        })),
      closeYearSelect = () =>
        this.inputRef.current ? (this.inputRef.current.checked = false) : null,
      isMobile = helpers.user.getUserProp("isMobile"),
      changeYearFunction = (e) => {
        changeYear(e.currentTarget.value);
        closeYearSelect();
      };
    const months = [
        _t("January"),
        _t("February"),
        _t("March"),
        _t("April"),
        _t("May"),
        _t("June"),
        _t("July"),
        _t("August"),
        _t("September"),
        _t("October"),
        _t("November"),
        _t("December"),
      ],
      weekdays = [
        _t("Sunday"),
        _t("Monday"),
        _t("Tuesday"),
        _t("Wednesday"),
        _t("Thursday"),
        _t("Friday"),
        _t("Saturday"),
      ];
    let showedYears = years;
    if (maxDate && maxDate instanceof Date) {
      let year = maxDate.getFullYear(),
        index = showedYears.indexOf(year) + 1;
      showedYears = showedYears.slice(0, index);
    }
    return (
      <div className="calendar_box">
        <div className="calendar_heading">
          <div className="select_item">
            {!isMobile && (
              <>
                <label htmlFor="start_year" className="start_year label-toggle">
                  {date.getFullYear()}
                </label>
                <input
                  type="checkbox"
                  ref={this.inputRef}
                  className="calendar-toggle-input"
                  id="start_year"
                />
              </>
            )}
            <select
              size={!isMobile ? 5 : 1}
              className={`start_year_select ${
                !isMobile ? "hidden-select" : " mobile-header"
              }`}
              onChange={changeYearFunction}
              defaultValue={date.getFullYear()}
            >
              {showedYears.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <span className="select_date">{`${
            months[date.getMonth()]
          } ${date.getDate()}, ${weekdays[date.getDay()]}`}</span>
        </div>
        <div className="month-container">
          <button
            onClick={decreaseMonth}
            type="button"
            style={{ pointerEvents: prevMonthButtonDisabled ? "none" : "" }}
          >
            {`<`}
          </button>
          <span className="react-datepicker-header-month">
            {months[date.getMonth()]}
          </span>
          <button
            onClick={increaseMonth}
            type="button"
            style={{ pointerEvents: nextMonthButtonDisabled ? "none" : "" }}
          >
            {`>`}
          </button>
        </div>
        {timeIntervals && (
          <div className="time_box">
            <div className="select_item">
              <label onClick={showHours}>
                {_t("Time")}{" "}
                <span
                  className="border_select_option"
                  id="calendar-hour-container"
                >
                  {date.getHours() < 10
                    ? "0" + date.getHours()
                    : date.getHours()}
                </span>
              </label>
              <select
                size="5"
                className={`start_hour_select ${
                  this.state.openSelect !== "hours" ? "hidden-select" : ""
                }`}
                defaultValue={date.getHours()}
                ref={this.hoursSelect}
                onChange={changeTimeFunction}
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            <div className="select_item">
              <label onClick={showMinutes}>
                :{" "}
                <span
                  className="border_select_option"
                  id="calendar-minute-container"
                >
                  {date.getMinutes() < 10
                    ? "0" + date.getMinutes()
                    : date.getMinutes()}
                </span>
              </label>
              <select
                size="5"
                className={`start_minute_select ${
                  this.state.openSelect !== "minutes" ? "hidden-select" : ""
                }`}
                defaultValue={date.getMinutes()}
                ref={this.minuteSelect}
                onChange={changeTimeFunction}
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.UserReducers.language,
});

export default connect(mapStateToProps)(Calendar);
