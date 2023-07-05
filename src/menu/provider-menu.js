import config from "../config";
let providerMenu = {};

//redux
export const ProviderMenuConstants = {
  PROVIDER_MENU_SET_PROVIDERS: "PROVIDER_MENU_SET_PROVIDERS",
};

let ProviderMenuActions = {};

ProviderMenuActions.setProviders = (providers = config.providersArray) => {
  return {
    type: ProviderMenuConstants.PROVIDER_MENU_SET_PROVIDERS,
    providers,
  };
};

export { ProviderMenuActions };

export default providerMenu;
