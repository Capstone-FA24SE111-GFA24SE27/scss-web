import { combineSlices } from '@reduxjs/toolkit';
import apiService from './api-service';
import { userSlice } from './user-slice';

// eslint-disable-next-line
// @ts-ignore
export interface LazyLoadedSlices { }

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
  userSlice,
  {
    [apiService.reducerPath]: apiService.reducer
  }
).withLazyLoadedSlices<LazyLoadedSlices>();
