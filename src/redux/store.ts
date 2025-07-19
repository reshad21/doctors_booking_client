import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/api/features/authSlice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";
import adminReducer from "./api/features/adminSlice";
import { permissionReducer } from "./api/features/permissionSlice";

const persistAuthConfig = {
  key: "userInfo",
  storage,
};

const persistAdminConfig = { key: "adminInfo", storage };

const persisterAuthReducer = persistReducer(persistAuthConfig, authReducer);
const persistedAdminReducer = persistReducer(persistAdminConfig, adminReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persisterAuthReducer,
    admin: persistedAdminReducer,
    routes: permissionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const persister = persistStore(store);
