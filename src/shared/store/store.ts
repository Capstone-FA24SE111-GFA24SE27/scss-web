import { configureStore, Middleware, ThunkAction, Action } from '@reduxjs/toolkit'
import { rootReducer } from './root-reducer'
import apiService from './api-service';

const middlewares: Middleware[] = [apiService.middleware];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
