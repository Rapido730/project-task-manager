import { compose, applyMiddleware } from "redux";
import { legacy_createStore as createStore } from "redux";

import { logger } from "redux-logger";
import { Root_Reducer } from "./Root_Reducer";

const middleWares = [logger];

const Composed_Enhancers = compose(applyMiddleware(...middleWares));

export const Store = createStore(Root_Reducer, undefined, Composed_Enhancers);
