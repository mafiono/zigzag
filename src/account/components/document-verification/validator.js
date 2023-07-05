import helpers from "../../../helpers";
import config from "../../../config";

const _t = helpers.translate.getTranslation;
const { VALID_EXTENSIONS, MIN_FILE_SIZE, MAX_FILE_SIZE } =
  config.documentVerification;

function documentFormValidate({ verification_doc, comment }) {
  let errors = {};
  if (!verification_doc) {
    errors.verification_doc = _t("Please select a document file");
  } else if (!~VALID_EXTENSIONS.indexOf(verification_doc.type)) {
    errors.verification_doc = _t(
      "Invalid file extension! Allowed only: {{document_extensions}}",
      {
        "{{document_extensions}}": "png, jpg, jpeg, pdf",
      }
    );
  } else if (verification_doc.size < MIN_FILE_SIZE) {
    errors.verification_doc = _t(
      "File size is too small: {{document_actual_size}} ( min {{document_min_size}} )",
      {
        "{{document_min_size}}": `${(MIN_FILE_SIZE / 1024).toFixed(2)} KB`,
        "{{document_actual_size}}": `${(verification_doc.size / 1024).toFixed(
          2
        )} KB`,
      }
    );
  } else if (verification_doc.size > MAX_FILE_SIZE) {
    errors.verification_doc = _t(
      "File size is too big: {{document_actual_size}} ( max {{document_max_size}})",
      {
        "{{document_max_size}}": `${(MAX_FILE_SIZE / 1024).toFixed(2)} KB`,
        "{{document_actual_size}}": `${(verification_doc.size / 1024).toFixed(
          2
        )} KB`,
      }
    );
  }

  return errors;
}

export default documentFormValidate;
