import React, { useRef, useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";

import helpers, { _t } from "../../helpers";
import request from "../../request";
import config from "../../config";
import user from "../../other/user";
import validator from "./document-verification/validator";

const {
  VALID_EXTENSIONS,
  CANVAS_IMAGE_WIDTH,
  CANVAS_IMAGE_HEIGHT,
  IMAGE_MIN_WIDTH,
  IMAGE_MIN_HEIGHT,
  CANVAS_IMAGE_SIZE,
} = config.documentVerification;

const acceptedFilesExtensions = VALID_EXTENSIONS.join(", ");
let preventSubmit = false;

const folderImg =
  config.common.s3CloudFrontAssets +
  config.common.assets.img.other +
  "/folder.svg";

const receiveFile = async (setFieldValue, name, canvasRef, acceptedFiles) => {
  if (!acceptedFiles || !acceptedFiles.length) {
    return false;
  }
  let file = acceptedFiles[0],
    canvas = canvasRef.current,
    ctx = canvas.getContext("2d"),
    img = new Image(),
    imageUrl = URL.createObjectURL(file);

  preventSubmit = false;
  if (!file.type.includes("image") || typeof ctx.filter === "undefined") {
    return setFieldValue(name, file);
  }

  img.onload = function () {
    if (img.width < IMAGE_MIN_WIDTH || img.height < IMAGE_MIN_HEIGHT) {
      preventSubmit = true;
      return helpers.errorMessage(
        _t(
          "File size is too small: {{document_actual_size}} ( min {{document_min_size}} )",
          {
            "{{document_min_size}}": `${IMAGE_MIN_WIDTH}x${IMAGE_MIN_HEIGHT}`,
            "{{document_actual_size}}": `${img.width}x${img.height}`,
          }
        )
      );
    }

    if (
      img.width > CANVAS_IMAGE_WIDTH ||
      img.height > CANVAS_IMAGE_HEIGHT ||
      file.size > CANVAS_IMAGE_SIZE
    ) {
      if (img.width > CANVAS_IMAGE_WIDTH) {
        canvas.width = CANVAS_IMAGE_WIDTH;
        canvas.height = canvas.width * (img.height / img.width);
      } else if (img.height > CANVAS_IMAGE_HEIGHT) {
        canvas.height = CANVAS_IMAGE_HEIGHT;
        canvas.width = canvas.height * (img.width / img.height);
      } else if (file.size > CANVAS_IMAGE_SIZE) {
        canvas.width = CANVAS_IMAGE_WIDTH;
        canvas.height = canvas.width * (img.height / img.width);
      }

      // step 1
      const oc = document.createElement("canvas");
      const octx = oc.getContext("2d");
      oc.width = this.width;
      oc.height = this.height;

      // steo 2: pre-filter image using steps as radius
      const steps = (oc.width / canvas.width) >> 1;
      octx.filter = `blur(${steps}px)`;
      octx.drawImage(this, 0, 0);

      // step 3, draw scaled
      ctx.drawImage(
        oc,
        0,
        0,
        oc.width,
        oc.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      let newFile = helpers.base64toFile(
        canvas.toDataURL("image/jpeg", 0.85),
        file
      );
      return setFieldValue(name, newFile);
    }
    return setFieldValue(name, file);
  };
  img.src = imageUrl;
};

const submitForm = (formJson, { resetForm }) => {
  if (preventSubmit) return null;
  return user.verifyDocument(formJson, resetForm);
};

let isMounted = false;

const setVerifiedStatus = async (setStatus) => {
  try {
    let response = await request.make({}, "/player/verification-status");
    setStatus(response);
  } catch (e) {
    return null;
  }
};
function DocumentVerification(props) {
  const canvas = useRef(null),
    [isPending, setStatus] = useState(false);

  useEffect(() => {
    isMounted = true;
    if (!props.verified) {
      if (isMounted) {
        setVerifiedStatus(setStatus);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [props.verified]);

  if (props.verified) {
    return (
      <div className="main__body">
        <div className="account__content_box">
          <label className="input_item_label text-center document-label">
            <textarea
              type="text"
              value={_t("Verification is approved")}
              readOnly
              className="document_input_description"
              disabled
            />
            <span className="input_item_bg" />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="main__body">
      <h2 className="h_decor">{_t("Documents")}</h2>
      <div className="main__bg">
        {!!isPending && <h2>{_t("Documents awaiting verification")}</h2>}
        <div className="account__info text-center">
          {_t(
            "KYC Verification or Know Your Customer  is the process of a business verifying the identity of its clients and assessing potential risks of illegal intentions for the business relationship."
          )}
        </div>
        <br />
        <Formik
          initialValues={{ verification_doc: "", comment: "" }}
          onSubmit={submitForm}
          validate={validator}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleReset,
            handleSubmit,
            setFieldValue,
          }) => {
            let imageUrl = null,
              inputFileFunction = receiveFile.bind(
                null,
                setFieldValue,
                "verification_doc",
                canvas
              );

            if (
              values.verification_doc &&
              values.verification_doc.type.includes("image")
            ) {
              imageUrl = values.verification_doc
                ? URL.createObjectURL(values.verification_doc)
                : "";
            }

            let labelClassName = (field) =>
              errors[field] && touched[field]
                ? "input_item_label error"
                : "input_item_label";

            return (
              <Form className="verification_form">
                <div className="account__frame_box">
                  <Dropzone
                    onDrop={inputFileFunction}
                    accept={acceptedFilesExtensions}
                    multiple={false}
                  >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                      <div {...getRootProps()}>
                        <span
                          className={labelClassName("verification_doc")}
                          data-error={errors["verification_doc"]}
                        >
                          <input
                            type="file"
                            id="document-file"
                            style={{ display: "none" }}
                            {...getInputProps()}
                          />
                          {isDragActive ? (
                            <span className="input_item_placeholder_text">
                              {_t("Drop file here")}
                            </span>
                          ) : (
                            <span className="input_item_placeholder_text document-input">
                              {_t("Please select a document file")}
                            </span>
                          )}
                          <span className="input_item_bg" />
                          <img
                            className="account__verification_img"
                            alt=""
                            src={folderImg}
                          />
                        </span>
                      </div>
                    )}
                  </Dropzone>
                  <label
                    htmlFor="document-file"
                    className="text-center selected-img-container"
                  >
                    <canvas ref={canvas} style={{ display: "none" }} />
                    {imageUrl && (
                      <>
                        <img
                          src={imageUrl}
                          alt=""
                          style={{ maxWidth: 300, maxHeight: 300 }}
                        />
                        <div className="verification_doc">
                          {values.verification_doc &&
                            values.verification_doc.name}
                        </div>
                        <span className="btn" onClick={handleReset}>
                          {_t("Clear")}
                        </span>
                      </>
                    )}
                  </label>
                  <label
                    className={labelClassName("comment")}
                    data-error={errors["comment"]}
                  >
                    <Field
                      component="textarea"
                      className="document_input_description"
                      name="comment"
                      cols="30"
                      rows="10"
                      placeholder={_t("Description")}
                    />
                    <span className="input_item_bg" />
                  </label>
                  <div>
                    {errors.comment && touched.comment && errors.comment}
                  </div>
                  <div className="account__submit_box">
                    <span
                      onClick={handleSubmit}
                      className="btn btn_green"
                      disabled={isSubmitting}
                    >
                      {_t("Send")}
                    </span>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

const mapState = (state) => ({
  verified: state.UserReducers.userData
    ? state.UserReducers.userData.verified
    : null,
});
export default connect(mapState)(React.memo(DocumentVerification));
