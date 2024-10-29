import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

const initialState = {
  open: true,
  // mobileOpen: false,
  // foldedOpen: false
  searchTerm: '',
  counselorType: 'ACADEMIC'
};
/**
 * The filter slice.
 */
export const counselorListSlice = createSlice({
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
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setCounselorType: (state, action: PayloadAction<'ACADEMIC' | 'NON_ACADEMIC'>) => {
      state.counselorType = action.payload
    }
  },
  selectors: {
    selectFilter: (filter) => filter,
    selectSearchTerm: (state) => state.searchTerm,
    selectCounselorType: (state) => state.counselorType,
  }
});
/**
 * Lazy loading
 */
rootReducer.inject(counselorListSlice);
const injectedSlice = counselorListSlice.injectInto(rootReducer);
export const {
  filterOpen,
  filterClose,
  filterToggle,
  setSearchTerm,
  setCounselorType,
} = counselorListSlice.actions;
export const {
  selectFilter,
  selectSearchTerm,
  selectCounselorType
} = injectedSlice.selectors;
export default counselorListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof counselorListSlice> { }
}