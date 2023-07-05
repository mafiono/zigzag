import { combineReducers } from "redux";

import CommonReducers from "./common-reducers";
import WinTableReducers from "./sidebar/components/win-table-reducers";
import ProvidersMenuReducers from "./menu/provider-menu-reducers";
import LoaderReducers from "./other/loader-reducers";
import UserReducers from "./other/user-reducers";
import TournamentsReducers from "./tournaments/tournaments-reducers";
import BonusesReducers from "./bonuses/bonuses-reducers";
import PagesReducers from "./pages/pages-reducers";
import SlidersReducers from "./sliders/sliders-reducers";

export default combineReducers({
  CommonReducers,
  winTable: WinTableReducers,
  loader: LoaderReducers,
  ProvidersMenuReducers,
  UserReducers,
  TournamentsReducers,
  BonusesReducers,
  PagesReducers,
  SlidersReducers,
});
