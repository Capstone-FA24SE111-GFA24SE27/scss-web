import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

const initialState = {
  studentView: '',
};
/**
 * The filter slice.
 */
export const counselorListSlice = createSlice({
  name: 'counselorsLayout',
  initialState,
  reducers: {
    closeStudentView: (state) => {
      state.studentView = '';
    },
    openStudentView: (state, action: PayloadAction<string>) => {
      state.studentView = action.payload;
    },
  },
  selectors: {
    selectCounselorsLayout: (state) => state,
    selectStudentView: (state) => state.studentView,
  }
});
/**
 * Lazy loading
 */
rootReducer.inject(counselorListSlice);
const injectedSlice = counselorListSlice.injectInto(rootReducer);
export const {
  openStudentView,
  closeStudentView,
} = counselorListSlice.actions;
export const {
  selectCounselorsLayout,
  selectStudentView,
} = injectedSlice.selectors;

export default counselorListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof counselorListSlice> { }
}