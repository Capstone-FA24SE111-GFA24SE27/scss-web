import { createSlice, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */
const initialState = {
  open: true,
  // mobileOpen: false,
  // foldedOpen: false
};
/**
 * The filter slice.
 */
export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // filterToggleFolded: (state) => {
    //     state.foldedOpen = !state.foldedOpen;
    // },
    // filterOpenFolded: (state) => {
    //     state.foldedOpen = true;
    // },
    // filterCloseFolded: (state) => {
    //     state.foldedOpen = false;
    // },
    // filterToggleMobile: (state) => {
    //     state.mobileOpen = !state.mobileOpen;
    // },
    // filterOpenMobile: (state) => {
    //     state.mobileOpen = true;
    // },
    // filterCloseMobile: (state) => {
    //     state.mobileOpen = false;
    // },
    filterClose: (state) => {
      state.open = false;
    },
    filterOpen: (state) => {
      state.open = true;
    },
    filterToggle: (state) => {
      state.open = !state.open;
    }
  },
  selectors: {
    selectFilter: (filter) => filter
  }
});
/**
 * Lazy loading
 */
rootReducer.inject(filterSlice);
const injectedSlice = filterSlice.injectInto(rootReducer);
export const {
  filterOpen,
  filterClose,
  filterToggle,
} = filterSlice.actions;
export const { selectFilter } = injectedSlice.selectors;
export default filterSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof filterSlice> { }
}