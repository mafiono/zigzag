import React from "react";
import ReactDOM from "react-dom";
import "babel-polyfill";
import ErrorBoundary from "./ErrorBoundary";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/index.scss";
import App from "./App";

import registerServiceWorker from "./registerServiceWorker";
import {unregister} from './registerServiceWorker';

ReactDOM.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  document.getElementById("root")
);
registerServiceWorker();
unregister();
