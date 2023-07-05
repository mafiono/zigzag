import { ProviderMenuConstants } from "./provider-menu";

export default (state = [], action) => {
  switch (action.type) {
    case ProviderMenuConstants.PROVIDER_MENU_SET_PROVIDERS:
      return action.providers;
    default:
      return state;
  }
};
