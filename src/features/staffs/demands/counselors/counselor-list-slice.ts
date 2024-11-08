import { CounselingType, Counselor } from '@/shared/types';
import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

type initialType = {
  open: boolean;
  counselor: Counselor | null;
  searchTerm: string;
  counselorType: CounselingType;
  availableFrom: string;
  availableTo: string;
};

const initialState: initialType = {
  open: true,
  counselor: null,
  searchTerm: '',
  counselorType: 'ACADEMIC',
  availableFrom: ``,
  availableTo: ``,
};
/**
 * The filter slice.
 */
export const counselorListSlice = createSlice({
  name: 'counselorListStaff',
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
    setCounselorType: (state, action: PayloadAction<CounselingType>) => {
      state.counselorType = action.payload
    },
    setAvailableFrom: (state, action: PayloadAction<string>) => {
      state.availableFrom = action.payload
    },
    setAvailableTo: (state, action: PayloadAction<string>) => {
      state.availableTo = action.payload
    },
    setSelectedCounselor: (state, action: PayloadAction<Counselor>) => {
      state.counselor = action.payload
    }
  },
  selectors: {
    selectFilter: (filter) => filter,
    selectSearchTerm: (state) => state.searchTerm,
    selectCounselorType: (state) => state.counselorType,
    selectCounselor: (state) => state.counselor
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
  setAvailableFrom,
  setAvailableTo,
  setSelectedCounselor
} = counselorListSlice.actions;
export const {
  selectFilter,
  selectSearchTerm,
  selectCounselorType,
  selectCounselor
} = injectedSlice.selectors;
export default counselorListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof counselorListSlice> { }
}