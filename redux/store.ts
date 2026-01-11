import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import adminReducer from "./slice/adminSlice";
import settingsReducer from "./slice/settingsSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["admin", "settings"],
};

const rootReducer = combineReducers({
  admin: adminReducer,
  settings: settingsReducer,
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
