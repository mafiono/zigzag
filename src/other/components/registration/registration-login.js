import React from "react";
import RegistrationHeader from "./registration-header";
import Login from "../../../other/components/login";

const RegistrationLogin = (props) => {
  return (
    <div className="main__body">
      <div className="tab__wrapper">
        <RegistrationHeader {...props} />
        <div className="tab__content">
          <div className="main__bg active">
            <Login noPopUp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RegistrationLogin);
