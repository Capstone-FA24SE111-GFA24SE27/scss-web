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
  studentType: 'ACADEMIC'
};
/**
 * The filter slice.
 */
export const studentListSlice = createSlice({
  name: 'studentList',
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
    setStudentType: (state, action: PayloadAction<'ACADEMIC' | 'NON_ACADEMIC'>) => {
      state.studentType = action.payload
    }
  },
  selectors: {
    selectFilter: (filter) => filter,
    selectSearchTerm: (state) => state.searchTerm,
    selectStudentType: (state) => state.studentType,
  }
});
/**
 * Lazy loading
 */
rootReducer.inject(studentListSlice);
const injectedSlice = studentListSlice.injectInto(rootReducer);
export const {
  filterOpen,
  filterClose,
  filterToggle,
  setSearchTerm,
  setStudentType,
} = studentListSlice.actions;
export const {
  selectFilter,
  selectSearchTerm,
  selectStudentType
} = injectedSlice.selectors;
export default studentListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof studentListSlice> { }
}