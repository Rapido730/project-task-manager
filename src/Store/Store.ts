import { compose, applyMiddleware } from "redux";
import { legacy_createStore as createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { logger } from "redux-logger";
import { Root_Reducer } from "./Root_Reducer";
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["User"],
};

const persistedReducer = persistReducer(persistConfig, Root_Reducer);

const middleWares = [process.env.NODE_ENV !== "production" && logger].filter(
  Boolean
);

const composeEnhancers = process.env.NODE_ENV !== "production" || compose;

// const composedEnhancers = composeEnhancers(applyMiddleware(...middleWares));

export const Store = createStore(persistedReducer);
export const persistor = persistStore(Store);
