import history from "../../history";

function updatePopUp() {
  window.openUpdate = () => {
    history.push({
      search: "update",
      state: { update: true },
    });
  };
}

export default updatePopUp;
