import React from "react";
import Logo from "./sidebar/components/logo";
import { ToastContainer } from "react-toastify";
import helpers, { _t } from "./helpers";
import config from "./config";
import tawk, { tawkOpen } from "./tawk";
import * as clipboard from "clipboard-polyfill";

const errorImg = config.initialImgPath + "other/error.png";

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errors: false,
    };
    this.textError = React.createRef();
    this.copyText = this.copyText.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { errors: error };
  }
  componentDidMount() {
    if (!tawk.isInit()) {
      tawk.createChat();
    }
  }
  componentDidCatch(error, errorInfo) {
    return this.setState({ errors: { error, errorInfo } });
  }
  copyText(e) {
    e.preventDefault();
    if (this.textError.current) {
      clipboard.writeText(this.textError.current.innerText);
      helpers.infoMessage("Text copied to clipboard.");
    }
  }
  render() {
    const { errors } = this.state;

    let documentText = "";

    if (!errors) {
      return this.props.children;
    }
    if (errors.error) {
      documentText += JSON.stringify(errors.error.message) + "\n";
    }
    if (errors.errorInfo) {
      documentText += JSON.stringify(errors.errorInfo);
    }
    return (
      <div className="error_page">
        <header className="header">
          <div className="header_top__section"></div>
          <div className="header_bottom_section">
            <Logo nolink />
          </div>
        </header>
        <main>
          <div className="main__body">
            <h2 className="h_decor">{_t("An error has occurred.")}</h2>
            <img className="error_page__main_img" src={errorImg} alt="" />
            <div className="main__bg">
              <div className="account__form">
                <p>
                  {_t(
                    "Copy the error text by clicking on the button below and provide to Live Chat for assistance."
                  )}
                </p>
                <div
                  className="input_item_label"
                  style={{ marginBottom: "20px" }}
                >
                  <span
                    className="document_input_description"
                    ref={this.textError}
                  >
                    {documentText}
                  </span>
                </div>
                <div className="account__submit_box">
                  <span
                    className="btn btn_big btn_green"
                    onClick={this.copyText}
                  >
                    {_t("Copy text")}
                  </span>
                </div>
              </div>
            </div>
            <div className="footer_section__fixed_box">
              <span className="live_chat_btn" onClick={tawkOpen}>
                {_t("Open chat")}
              </span>
            </div>
            <ToastContainer
              draggable={false}
              className={"new-toast-settings"}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default ErrorBoundary;
