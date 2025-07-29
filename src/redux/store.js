import { applyMiddleware, combineReducers, createStore } from "redux";
import celebretiesReducer from "./reducers/celebreties-reducer";
import {thunk} from 'redux-thunk';
import articlesReducer from "./reducers/articles-reduser";
import usersReducer from "./reducers/users-reduser";

const reducers = combineReducers({ 
    celebreties: celebretiesReducer,
    articles: articlesReducer,
    users: usersReducer
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
window.store = store;