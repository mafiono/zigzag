import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

// import UserMenu from "../../menu/components/user-menu";

import Profile from "./profile";
import Deposit from "./deposit";
import Withdraw from "./withdraw";
import WithdrawCancel from "./withdraw-cancel";
import DocumentVerification from "./document-verification";
import PlayHistory from "./play-history";
import Promo from "./promo";
import ChangePassword from "./change-password";
import TransactionHistory from "./transaction-history";
import Bonuses from "./bonuses";

import { _t, Meta } from "../../helpers";
// import config from "../../config";

function Account(props) {
  const { online, language } = props;

  if (!online) {
    return (
      <Redirect
        to={{
          pathname: "/" + language,
          search: "?login",
        }}
      />
    );
  }
  const initialPath = "/" + language + "/account/";

  return (
    <>
      <Meta text={_t("Account")} />
      <div className="account">
        <Switch>
          <Route path={initialPath + "profile"} Component={Profile} />
          <Route path={initialPath + "deposit"} Component={Deposit} />
          <Route path={initialPath + "withdraw"} Component={Withdraw} />
          <Route
            path={initialPath + "withdraw-cancel"}
            Component={WithdrawCancel}
          />
          <Route
            path={initialPath + "document-verification"}
            Component={DocumentVerification}
          />
          <Route path={initialPath + "promo"} Component={Promo} />
          <Route path={initialPath + "casino-bonus"} Component={Bonuses} />
          <Route path={initialPath + "play-history"} Component={PlayHistory} />
          <Route path={initialPath + "sport-bonus"} Component={Bonuses} />
          <Route
            path={initialPath + "transaction-history"}
            Component={TransactionHistory}
          />
          <Route
            path={initialPath + "change-password"}
            Component={ChangePassword}
          />
        </Switch>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    online: state.UserReducers.online,
    language: state.UserReducers.language,
  };
};

export default connect(mapStateToProps)(React.memo(Account));
