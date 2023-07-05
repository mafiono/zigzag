import React, { useEffect } from "react";
import ReactDom from "react-dom";
// import config from "../config";
import "./css/popup.scss";

export default function Popup(props) {
  const closePortal = () => props.closeHandler(null);
  window.closePortal = closePortal;
  useEffect(() => {
    let htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.style.overflowY = "hidden";
    return () => {
      htmlTag.style.overflowY = "scroll";
    };
  }, []); // ScrollPrevent
  let PopupComponent = null;

  if (props.children) {
    if (props.fullContainer) {
      PopupComponent = props.children;
    } else {
      PopupComponent = (
        <div>
          <div className="overlay" onClick={closePortal} />
          <div className="popup active">{props.children}</div>
        </div>
      );
    }
  } else {
    PopupComponent = (
      <div>
        <div className="overlay" onClick={closePortal} />
        <div
          className={`popup active ${props.deposit ? " deposit_popup" : ""}`}
        >
          <div className="custom-popup-body popup_item_body">
            <div className="custom-popup-title">
              <h2> {props.title} </h2>
              <i onClick={closePortal} className="widget__close_btn" />
            </div>
            <div className="custom-popup-content">{props.content}</div>
          </div>
        </div>
      </div>
    );
  }
  return ReactDom.createPortal(
    PopupComponent,
    document.getElementById("modal-root")
  );
}
