import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';

/**
 * The initial state of the filter slice.
 */

interface CounselorListState {
  counselingTab?: number;
  open: boolean;
  counselorType: 'ACADEMIC' | 'NON_ACADEMIC';
  availableFrom: string;
  availableTo: string;
  searchTerm: string;
  specializationId?: number;
  departmentId?: number;
  majorId?: number;
  expertiseId?: number;
  ratingFrom?: number;
  ratingTo?: number;
}

const initialState: CounselorListState = {
  counselingTab: 0,
  open: true,
  searchTerm: '',
  counselorType: 'ACADEMIC',
  availableFrom: '',
  availableTo: '',
  // specializationId: '',
  // expertiseId: '',
  // departmentId: '',
  // majorId: '',
  // ratingFrom: '',
  // ratingTo: '',
};

/**
 * The filter slice.
 */
export const adminCounselorListSlice = createSlice({
  name: 'adinCounselorListSlice',
  initialState,
  reducers: {
    setCounselingTab: (state, action?: PayloadAction<number>) => {
      state.counselingTab = action.payload;
    },
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
      state.searchTerm = action.payload;
    },
    setCounselorType: (state, action: PayloadAction<'ACADEMIC' | 'NON_ACADEMIC'>) => {
      state.counselorType = action.payload;
    },
    setAvailableFrom: (state, action: PayloadAction<string>) => {
      state.availableFrom = action.payload;
    },
    setAvailableTo: (state, action: PayloadAction<string>) => {
      state.availableTo = action.payload;
    },
    setSpecializationId: (state, action: PayloadAction<number>) => {
      state.specializationId = action.payload;
    },
    setDepartmentId: (state, action: PayloadAction<number>) => {
      state.departmentId = action.payload;
    },
    setMajorId: (state, action: PayloadAction<number>) => {
      state.majorId = action.payload;
    },
    setExpertiseId: (state, action: PayloadAction<number>) => {
      state.expertiseId = action.payload;
    },
    setRatingFrom: (state, action: PayloadAction<number>) => {
      state.ratingFrom = action.payload; // New reducer for ratingFrom
    },
    setRatingTo: (state, action: PayloadAction<number>) => {
      state.ratingTo = action.payload; // New reducer for ratingTo
    },
  },
  selectors: {
    selectFilter: (filter) => filter,
    selectCounselingTab: (filter) => filter.counselingTab,
    selectSearchTerm: (state) => state.searchTerm,
    selectCounselorType: (state) => state.counselorType,
  },
});

/**
 * Lazy loading
 */
rootReducer.inject(adminCounselorListSlice);
const injectedSlice = adminCounselorListSlice.injectInto(rootReducer);

export const {
  setCounselingTab,
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
  setExpertiseId,
  setRatingFrom, // Export action for ratingFrom
  setRatingTo, // Export action for ratingTo
} = adminCounselorListSlice.actions;

export const {
  selectCounselingTab,
  selectFilter,
  selectSearchTerm,
  selectCounselorType,
} = injectedSlice.selectors;

export default adminCounselorListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof adminCounselorListSlice> { }
}
