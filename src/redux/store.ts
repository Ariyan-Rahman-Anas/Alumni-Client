import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './apis/baseApi';

// Combine multiple reducers
const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
});

// Create the Redux store with middleware
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(baseApi.middleware),
});

export default store;