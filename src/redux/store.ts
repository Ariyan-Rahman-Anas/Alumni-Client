import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './apis/baseApi';
import authReducer from './slice/authSlice';
import { rtkQueryErrorLogger } from './middleware/errorMiddleware';

const rootReducer = combineReducers({
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(baseApi.middleware, rtkQueryErrorLogger),
});

export default store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;