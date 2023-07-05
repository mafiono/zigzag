import React, { useState } from "react";
import { _t } from "../../helpers";
import TransactionHistoryForm from "./transaction-history/transaction-history-form";

export default function TransactionHistory(props) {
  const [result, getResult] = useState(null);
  return (
    <div className="main__body">
      <h2 className="h_decor">{_t("Transaction history")}</h2>
      <div className="main__bg">
        <TransactionHistoryForm getResult={getResult} result={result} />
      </div>
    </div>
  );
}
