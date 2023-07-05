import React, { useState, useEffect } from "react";
import Popup from "../../../utils-components/popup";
import { useLocation } from "react-router-dom";
import depositModel from "../../../account/deposit";
import { _t } from "../../../helpers";

let isMounted = false;

function DepositPopUp(props) {
  const location = useLocation(),
    [response, setResponse] = useState(null),
    { depositPopUpData } = location.state;

  useEffect(() => {
    isMounted = true;
    async function Wrapper() {
      const result = await depositModel.makeDeposit(depositPopUpData);
      if (isMounted) {
        setResponse(result);
      }
    }
    Wrapper();
    return () => {
      isMounted = false;
    };
  }, [depositPopUpData]);

  return response ? (
    <Popup
      closeHandler={props.closeFunction}
      content={buildPopUp(response)}
      deposit
    />
  ) : null;
}

function buildPopUp(response) {
  switch (response.type) {
    case "offline":
      return <div>{response.data}</div>;
    case "url":
      if (response.iframe) {
        return (
          <iframe
            style={{ width: "100%", height: "100%" }}
            src={response.data}
            title="deposit"
          />
        );
      }
      let paymentFunc = () => {
        window.open(response.data, "_blank");
      };
      return (
        <div className="deposit-pop-up-link">
          <h2>{_t("The payment will continue in a new window")}</h2>
          <span onClick={paymentFunc} className="btn">
            {_t("Continue")}
          </span>
          {/* <a href={response.data} className="btn">
                            {_t('Continue')}
                        </a> */}
        </div>
      );
    default:
      return null;
  }
}
export default DepositPopUp;
