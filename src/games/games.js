import helpers from "../helpers";
import config from "../config";
import loader from "../other/loader";
import { ProviderMenuActions } from "../menu/provider-menu";
import request from "../request";

let timestamp = 0;

let games = {};

let defaultState = {
  loadMore: false,
  category: config.games.categories[0],
  provider: "",
  tag: "",
  name: "",
  filterStart: 0,
  filterEnd: config.games.paginatorLoadLimit,
};

//module methods
let allGamesCacheKey = "games";
let intervalSet = false;
let allGames;
let loadingRemoteData = false;
let firstCall = true;

games.loadGames = async (props) => {
  let filters = Object.assign({}, defaultState, props);
  let {
    filterStart,
    filterEnd,
    loadMore,
    category,
    tag,
    provider,
    name,
    dispatch,
  } = filters;

  loader.show();

  let gameData = [],
    providers = [];
  if (tag) {
    [gameData, filterEnd, loadMore, providers] = await games.getByTag(
      tag,
      filterStart,
      filterEnd
    );
  } else if (provider) {
    [gameData, filterEnd, loadMore, providers] = await games.getByProvider(
      category,
      provider,
      filterStart,
      filterEnd
    );
  } else if (name) {
    [gameData, filterEnd, loadMore, providers] = await games.getByName(
      category,
      name,
      filterStart,
      filterEnd
    );
  } else if (category) {
    [gameData, filterEnd, loadMore, providers] = await games.getByCategory(
      category,
      filterStart,
      filterEnd
    );
  }
  dispatch(ProviderMenuActions.setProviders(providers));
  loader.hide(tag || provider || name || category);

  return Promise.resolve({
    gameData,
    filterEnd: config.games.paginatorLoadLimit + filterEnd,
    loadMore,
  });
};

games.getAllGames = async () => {
  try {
    if (firstCall) {
      loadingRemoteData = true;
      firstCall = false;
    } else {
      await checkLoadingRemoteData();
    }

    setGameRefreshInterval();

    if (helpers.validateLocalCache(allGames, config.games.cacheTime)) {
      loadingRemoteData = false;
      timestamp = allGames.timestamp;
      return Promise.resolve([allGames.data, allGames.providers]);
    }

    allGames = localStorage.getItem(allGamesCacheKey);
    allGames = allGames ? JSON.parse(allGames) : allGames;

    if (helpers.validateLocalCache(allGames, config.games.cacheTime)) {
      loadingRemoteData = false;
      timestamp = allGames.timestamp;
      return Promise.resolve([allGames.data, allGames.providers]);
    }

    allGames = await request.make({}, "/data/get-games");

    let newGames = {};
    let providers = [];
    let gameKeys = Object.keys(allGames);
    let countryCode = helpers.user.getUserProp("countryCode");

    for (let i = 0; i < gameKeys.length; i++) {
      if (
        allGames[gameKeys[i]].country_restricted.indexOf(countryCode) === -1
      ) {
        let index = config.providersArray.indexOf(
            allGames[gameKeys[i]].provider
          ),
          providerObject = config.providers.find(
            (pr) => pr.name === allGames[gameKeys[i]].provider
          );

        if (index === -1 || providerObject?.disabled) {
          continue;
        }

        if (
          typeof providerObject.restricted === "object" &&
          providerObject.restricted.indexOf(countryCode) !== -1
        ) {
          continue;
        }

        providers.indexOf(allGames[gameKeys[i]].provider) === -1 &&
          providers.push(allGames[gameKeys[i]].provider);

        newGames[gameKeys[i]] = allGames[gameKeys[i]];
      }
    }

    timestamp = new Date().valueOf();
    localStorage.setItem(
      allGamesCacheKey,
      JSON.stringify({
        timestamp: timestamp,
        data: newGames,
        providers,
      })
    );

    loadingRemoteData = false;

    return Promise.resolve([newGames, providers]);
  } catch (err) {
    loadingRemoteData = false;
    return Promise.reject(err);
  }
};
games.getByCategory = async (
  category,
  start = 0,
  length = config.games.paginatorLoadLimit
) => {
  try {
    let gameKey = "games-category-" + category;

    let gamesByCategory = localStorage.getItem(gameKey);
    gamesByCategory = gamesByCategory
      ? JSON.parse(gamesByCategory)
      : gamesByCategory;

    if (helpers.validateLocalCache(gamesByCategory, config.games.cacheTime)) {
      return Promise.resolve([
        ...(await paginateGames(gamesByCategory.data, start, length, true)),
        gamesByCategory.providers,
      ]);
    }

    let [allGames] = await games.getAllGames();

    let newGames = [];
    let providers = [];
    let gameKeys = Object.keys(allGames);
    for (let i = 0; i < gameKeys.length; i++) {
      if (!allGames[gameKeys[i]].category[category]) {
        continue;
      }
      newGames.push(allGames[gameKeys[i]]);

      providers.indexOf(allGames[gameKeys[i]].provider) === -1 &&
        config.providersArray.indexOf(allGames[gameKeys[i]].provider) > -1 &&
        providers.push(allGames[gameKeys[i]].provider);
    }

    providers = config.providersArray.filter(function (n) {
      return providers.indexOf(n) > -1;
    });

    newGames.sort(function (a, b) {
      return a.category[category].priority - b.category[category].priority;
    });

    localStorage.setItem(
      gameKey,
      JSON.stringify({
        timestamp: timestamp,
        data: newGames.map((gameItem) => {
          return gameItem.id;
        }),
        providers,
      })
    );

    return Promise.resolve([
      ...(await paginateGames(newGames, start, length, false)),
      providers,
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
};

games.getByTag = async (
  tag,
  start = 0,
  length = config.games.paginatorLoadLimit
) => {
  try {
    let gameKey = "games-tag-" + tag;

    let gamesByTag = localStorage.getItem(gameKey);
    gamesByTag = gamesByTag ? JSON.parse(gamesByTag) : gamesByTag;

    if (helpers.validateLocalCache(gamesByTag, config.games.cacheTime)) {
      return Promise.resolve([
        ...(await paginateGames(gamesByTag.data, start, length, true)),
        gamesByTag.providers,
      ]);
    }

    let [allGames] = await games.getAllGames();

    let newGames = [];
    let providers = config.providersArray;
    let gameKeys = Object.keys(allGames);
    for (let i = 0; i < gameKeys.length; i++) {
      if (allGames[gameKeys[i]].tag.indexOf(tag) === -1) {
        continue;
      }
      newGames.push(allGames[gameKeys[i]]);
    }

    newGames.sort(function (a, b) {
      return b.name > a.name ? -1 : 1;
    });

    localStorage.setItem(
      gameKey,
      JSON.stringify({
        timestamp: timestamp,
        data: newGames.map((gameItem) => {
          return gameItem.id;
        }),
        providers,
      })
    );

    return Promise.resolve([
      ...(await paginateGames(newGames, start, length, false)),
      providers,
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
};

games.getByProvider = async (
  category,
  provider,
  start = 0,
  length = config.games.paginatorLoadLimit
) => {
  try {
    let gameKey = "games-category-" + category + "-provider-" + provider;

    let gamesByProvider = localStorage.getItem(gameKey);
    gamesByProvider = gamesByProvider
      ? JSON.parse(gamesByProvider)
      : gamesByProvider;

    if (helpers.validateLocalCache(gamesByProvider, config.games.cacheTime)) {
      return Promise.resolve([
        ...(await paginateGames(gamesByProvider.data, start, length, true)),
        gamesByProvider.providers,
      ]);
    }

    let [gamesByCategory, filterEnd, loadMore, providers] =
      await games.getByCategory(category, 0, Number.MAX_SAFE_INTEGER);

    let newGames = [];
    for (let i = 0; i < gamesByCategory.length; i++) {
      if (gamesByCategory[i].provider !== provider) {
        continue;
      }
      newGames.push(gamesByCategory[i]);
    }

    localStorage.setItem(
      gameKey,
      JSON.stringify({
        timestamp: timestamp,
        data: newGames.map((gameItem) => {
          return gameItem.id;
        }),
        providers,
      })
    );
    return Promise.resolve([
      ...(await paginateGames(newGames, start, length, false)),
      providers,
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
};

games.getByName = async (
  category,
  name,
  start = 0,
  length = config.games.paginatorLoadLimit
) => {
  try {
    name = name.toLowerCase();
    let [allGames] = await games.getByCategory(
      category,
      0,
      Number.MAX_SAFE_INTEGER
    );

    let foundGames = [];
    let providers = config.providersArray;
    for (let i = 0; i < allGames.length; i++) {
      if (allGames[i].name.toLowerCase().indexOf(name.toLowerCase()) > -1) {
        config.providersArray.indexOf(allGames[i].provider) > -1 &&
          foundGames.push(allGames[i]);
      }
    }

    return Promise.resolve([
      ...(await paginateGames(foundGames, start, length, false)),
      providers,
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
};

games.getById = async (gameId) => {
  try {
    let [allGames] = await games.getAllGames();
    return Promise.resolve(allGames[gameId]);
  } catch (err) {
    return Promise.reject(err);
  }
};
games.getByIds = async (arrayId) => {
  try {
    let [allGames] = await games.getAllGames(),
      gamesArray = [],
      arrayIdLength = arrayId.length;

    for (let i = 0; i < arrayIdLength; i++) {
      gamesArray.push(allGames[arrayId[i]]);
    }

    return Promise.resolve(gamesArray);
  } catch (err) {
    return Promise.reject(err);
  }
};

games.getByCode = async (gamesCodeArray, limit) => {
  try {
    let [allGames] = await games.getAllGames(),
      filteredGames = [],
      gamesArray = Object.keys(allGames).filter((game) =>
        gamesCodeArray.some(
          (selectedGame) => selectedGame === allGames[game].code
        )
      ),
      gamesArrayLength = limit <= gamesArray.length ? limit : gamesArray.length;

    for (let i = 0; i < gamesArrayLength; i++) {
      filteredGames.push(allGames[gamesArray[i]]);
    }
    return Promise.resolve(filteredGames);
  } catch (err) {
    return Promise.reject(err);
  }
};

games.getForTournament = async (gamesCodeArray, id) => {
  let localStorageKey = `tournament-${id}`,
    localStorageData = localStorage.getItem(localStorageKey),
    result = null;

  localStorageData = localStorageData
    ? JSON.parse(localStorageData)
    : localStorageData;

  if (helpers.validateLocalCache(localStorageData, config.games.cacheTime)) {
    return Promise.resolve(games.getByIds(localStorageData.data));
  }

  result = await games.getByCode(gamesCodeArray);

  let resultLenght = result.length,
    cacheArray = [];

  for (let i = 0; i < resultLenght; i++) {
    cacheArray.push(result[i].id);
  }

  localStorage.setItem(
    localStorageKey,
    JSON.stringify({
      timestamp: timestamp,
      data: cacheArray,
    })
  );

  return result;
};

games.getMeta = (props) => {
  let title = config.common.meta.titleCommon,
    description = config.common.meta.descriptionCommon,
    keywords = config.common.meta.keywordsCommon;

  return {
    title,
    description,
    keywords,
  };
};

games.buildRealPlayLink = (language, gameObject) => {
  return "/" + language + "/games/play/" + gameObject.slug;
};
games.buildDemoPlayLink = (language, gameObject) => {
  return "/" + language + "/games/demo/" + gameObject.slug;
};

let paginateGames = async (gamesArray, start, length, onlyIds = true) => {
  try {
    length = gamesArray.length >= length ? length : gamesArray.length;
    let data = gamesArray.slice(start, length);

    if (!onlyIds) {
      return Promise.resolve([
        gamesArray.slice(start, length),
        length,
        length < gamesArray.length,
      ]);
    }

    let paginatedData = await games.getByIds(data);

    return Promise.resolve([paginatedData, length, length < gamesArray.length]);
  } catch (err) {
    return Promise.reject(err);
  }
};

let setGameRefreshInterval = () => {
  if (intervalSet) return;
  //check
  setInterval(async () => {
    try {
      if (
        new Date().valueOf() - timestamp > config.games.cacheTime ||
        localStorage.getItem(allGamesCacheKey) === null
      ) {
        await games.getAllGames();
      }
    } catch (err) {}
  }, config.games.cacheCheckTimeout);
  intervalSet = true;
};

let checkLoadingRemoteData = () => {
  return new Promise((resolve, reject) => {
    if (!loadingRemoteData) {
      resolve();
    }
    let remoteDataInterval = setInterval(() => {
      if (!loadingRemoteData) {
        clearInterval(remoteDataInterval);
        resolve();
      }
    }, 50);
  });
};

export default games;
