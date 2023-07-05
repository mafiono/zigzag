import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import config from "./config";
import rootReducer from "./root-reducer";

const composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

const initialState = {
  loader: {
    show: true,
  },
  ProvidersMenuReducers: config.providersArray,
};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
