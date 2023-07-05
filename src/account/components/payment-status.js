import React from "react";
import { Redirect } from "react-router-dom";

export default (props) => {
  if (window.top && window.top.closePortal) {
    window.top.closePortal(null);
  }
  return <Redirect to="/" />;
};
