import React from "react";
import { _t } from "../../../helpers";

const RegistrationHeader = ({ language, active, setAutorization }) => {
  return (
    <ul className="tab__menu">
      <li
        className={!active ? " active" : ""}
        onClick={() => setAutorization(false)}
      >
        {_t("Registration")}
      </li>
      <li
        className={active ? " active" : ""}
        onClick={() => setAutorization(true)}
      >
        {_t("Login")}
      </li>
    </ul>
  );
};

export default React.memo(RegistrationHeader);
