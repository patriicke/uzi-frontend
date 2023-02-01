import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import roomReducer from "./slices/roomSlice";

const persistConfig = {
    key: 'root',
    storage,
}

const ALL_REDUCERS = combineReducers({
    user:userReducer,
    room: roomReducer
})

const persistedReducer = persistReducer(persistConfig, ALL_REDUCERS)

export const store = configureStore({
    reducer:persistedReducer,
    devTools: import.meta.env.VITE_NODE_ENV !== 'production',
    middleware:[thunk]
});

export const persistor = persistStore(store)
