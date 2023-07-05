let translateHelper = {};

let translations = {};
translateHelper.setTranslations = (data) => {
  if (typeof data !== "object") {
    throw new Error("Incorrect translations");
  }
  translations = data;
};
translateHelper.getTranslation = (key, placeholders = {}) => {
  let translation = translations[key] || key;
  return translateHelper.replacePlaceholders(translation, placeholders);
};
translateHelper.replacePlaceholders = (str, placeholders = {}) => {
  let placeholderKeys = Object.keys(placeholders);

  if (placeholderKeys.length === 0) {
    return str;
  }

  for (let i = 0; i < placeholderKeys.length; i++) {
    str = str.replace(placeholderKeys[i], placeholders[placeholderKeys[i]]);
  }

  return str;
};

export default translateHelper;
