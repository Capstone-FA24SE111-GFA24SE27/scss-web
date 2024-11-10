import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

const initialState = {
  counselorView: '',
};
/**
 * The filter slice.
 */
export const counselorListSlice = createSlice({
  name: 'studentsLayout',
  initialState,
  reducers: {
    closeCounselorView: (state) => {
      state.counselorView = '';
    },
    openCounselorView: (state, action: PayloadAction<string>) => {
      state.counselorView = action.payload;
    },
  },
  selectors: {
    selectCounselorsLayout: (state) => state,
    selectCounselorView: (state) => state.counselorView,
  }
});
/**
 * Lazy loading
 */
rootReducer.inject(counselorListSlice);
const injectedSlice = counselorListSlice.injectInto(rootReducer);
export const {
  openCounselorView,
  closeCounselorView,
} = counselorListSlice.actions;
export const {
  selectCounselorsLayout,
  selectCounselorView,
} = injectedSlice.selectors;

export default counselorListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof counselorListSlice> { }
}