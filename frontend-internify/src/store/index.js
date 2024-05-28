import { configureStore } from '@reduxjs/toolkit';
import { combinedReducer } from './combined-reducers';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
	reducer: persistedReducer,
});

export const persistor = persistStore(store);