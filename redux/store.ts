import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import adminReducer from "./slice/adminSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["admin"],
};

const rootReducer = combineReducers({
  admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ✅ Persistor for Redux Persist
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
