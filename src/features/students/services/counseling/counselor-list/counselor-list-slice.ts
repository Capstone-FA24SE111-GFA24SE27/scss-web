import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

interface CounselorListState {
  open: boolean;
  counselorType: 'ACADEMIC' | 'NON_ACADEMIC';
  availableFrom: string,
  availableTo: string,
  searchTerm: string;
  specializationId: number | '';
  departmentId: number | '';
  majorId: number | '';
  expertiseId: number | '';
}

const initialState: CounselorListState = {
  open: true,
  searchTerm: '',
  counselorType: 'ACADEMIC',
  availableFrom: ``,
  availableTo: ``,
  specializationId: '',
  expertiseId: '',
  departmentId: '',
  majorId: '',
}
/**
 * The filter slice.
 */
export const counselorListSlice = createSlice({
  name: 'counselorList',
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
    },
    setAvailableFrom: (state, action: PayloadAction<string>) => {
      state.availableFrom = action.payload
    },
    setAvailableTo: (state, action: PayloadAction<string>) => {
      state.availableTo = action.payload
    },
    setSpecializationId: (state, action: PayloadAction<number | ''>) => {
      state.specializationId = action.payload;
    },
    setDepartmentId: (state, action: PayloadAction<number | ''>) => {
      state.departmentId = action.payload;
    },
    setMajorId: (state, action: PayloadAction<number | ''>) => {
      state.majorId = action.payload;
    },
    setExpertiseId: (state, action: PayloadAction<number | ''>) => {
      state.expertiseId = action.payload;
    },
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
  setAvailableFrom,
  setAvailableTo,
  setSpecializationId,
  setDepartmentId,
  setMajorId,
  setExpertiseId
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