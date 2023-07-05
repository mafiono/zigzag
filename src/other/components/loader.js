import React from "react";
import loaderSVG from "./loader/loadersvg";
import { useSelector } from "react-redux";

import "./css/loader.css";

function Loader() {
  const show = useSelector(({ loader }) => loader.show);

  return (
    <div className={`preloader${show ? "" : " hidden"}`}>
      <div className="loader-container">
        <svg
          version="1.1"
          id="LoaderTimer"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          style={{ enableBackground: "new 0 0 300 300" }}
          dangerouslySetInnerHTML={{ __html: loaderSVG }}
        />
      </div>
    </div>
  );
}

export default React.memo(Loader);
