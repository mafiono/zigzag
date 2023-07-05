import React, { useEffect, useState } from "react";
import store from "../../store";
import loader from "../loader";
import helpers from "../../helpers";
import request from "../../request";

function Mail(props) {
  const [data, getData] = useState(null);
  useEffect(() => {
    loader.show();
    request
      .make({ id: props.match.params.id }, "/data/mail")
      .then((res) => {
        getData(res);
        loader.hide();
      })
      .catch((e) => {
        loader.hide();
        helpers.errorMessage(e.message);
      });
  }, []);
  if (!data) {
    return null;
  }
  return <div dangerouslySetInnerHTML={{ __html: data.content }} />;
}

export default React.memo(Mail);
