import React, { useState, useRef } from "react";
import config from "../../../config";
import { useHistory, useParams } from "react-router-dom";
import store from "../../../store";
import gamesModel from "../../../games/games";
import helpers, { _t } from "../../../helpers";

const defaultState = {
    category: "all",
    filterStart: 0,
    filterEnd: config.common.searchLimit,
  },
  initialDataState = {
    games: [],
    moreLink: null,
  },
  { dispatch } = store;

let timeout = null;

const keyDownSubmit = (morePlayLink, toggleSearch, e) => {
  switch (e.keyCode) {
    case 13:
      if (e.currentTarget.value) {
        morePlayLink(e.currentTarget.value);
      }
      break;
    case 27:
      toggleSearch();
      break;
    default:
  }
};

const getGames = async (setSearchData, e) => {
  const name = e.currentTarget.value;
  clearTimeout(timeout);

  timeout = setTimeout(async function () {
    let result = await gamesModel.loadGames({
        ...defaultState,
        name,
        dispatch,
      }),
      newData = {
        games: [...result.gameData],
        moreLink: result.loadMore ? name : null,
      };
    setSearchData(newData);
  }, 300);
};

function SearchContainer(props) {
  const [searchData, setSearchData] = useState(initialDataState),
    history = useHistory(),
    searchInput = useRef(),
    params = useParams(),
    language = props.language || params.language,
    changeInputSearch = getGames.bind(null, setSearchData),
    initialSearchLink = "/" + language + "/games/search/",
    morePlayLink = (link) => {
      props.toggleSearch();
      history.push(initialSearchLink + (link || searchData.moreLink));
    },
    moreArchor = (e) => morePlayLink(e.currentTarget.value),
    inputKeyDown = keyDownSubmit.bind(null, morePlayLink, props.toggleSearch);

  React.useEffect(() => {
    searchInput.current?.focus?.();
  }, [props.showSearch]);

  return (
    <div className="search_game__result_popup">
      <div className="search_game__result_box">
        <span className="search_game__close_btn">
          <img
            src={config.initialImgPath + "other/close-hover.svg"}
            alt=""
            onClick={props.toggleSearch}
            className="search_game__close_img"
          />
        </span>
        <label className="search_game__label">
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              id="search-input"
              autoFocus
              defaultValue={params.name}
              ref={searchInput}
              autoComplete="off"
              tabIndex="0"
              className="search_game__input"
              onChange={changeInputSearch}
              onKeyDown={inputKeyDown}
              placeholder={_t("Search")}
            />
            <img
              src={config.initialImgPath + "other/search.svg"}
              className="search_game__label_img"
              alt=""
            />
          </form>
        </label>
        <ul className="search_game__result_list">
          {searchData.games.map((game) => {
            let playLink = helpers.user.isOnline
                ? {
                    pathname: gamesModel.buildRealPlayLink(language, game),
                    state: { from: history.location },
                  }
                : {
                    pathname: gamesModel.buildDemoPlayLink(language, game),
                    state: { from: history.location },
                  },
              onClickLink = () => {
                props.toggleSearch();
                history.push(playLink);
              },
              imgSrc = config.games.thumbsUrl + game.image;

            return (
              <li key={game.id} className="search_game__result_item">
                <div className="search_game__result_game">
                  <div className="game_item game_item_short">
                    <div className="game_item__box">
                      <div className="game_item__img_box">
                        <img
                          src={imgSrc}
                          alt=""
                          className="game_item__game_img"
                        />
                      </div>
                    </div>
                  </div>
                  <a
                    onClick={onClickLink}
                    className="search_game__result_title"
                    dangerouslySetInnerHTML={{ __html: game.name }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        {searchData.moreLink && (
          <span className="search_game__show_more_btn">
            <a onClick={moreArchor} className="btn">
              {_t("More")}
            </a>
          </span>
        )}
      </div>
    </div>
  );
}
export default SearchContainer;
