import config from "../../config";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case "INITIALIZE_WIN_TABLE":
      return { ...state, winnersTable: payload };
    case "REWRITE_WIN_TABLE":
      if (!Array.isArray(state.winnersTable)) {
        return { ...state };
      }
      let newTable = [...state.winnersTable];
      newTable.push(payload);
      if (newTable.length > config.winTableLength) {
        newTable.shift();
      }
      return { ...state, winnersTable: newTable };
    default:
      return { ...state };
  }
};
