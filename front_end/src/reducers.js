import {combineReducers} from "redux";

import LoginReducer from "./Components/UserProfile/Login/redux/reducer";
import BasketReducer from "./Components/Basket/redux/reducer";
/*
 * Combines all reducers and their state to be used when creating the store
 */

const combinedReducers = combineReducers({
    LoginReducer, BasketReducer
});

const rootReducer = (state, action) => combinedReducers(state, action);

export default rootReducer;