import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';

interface StudentListState {
  open: boolean;
  searchTerm: string;
  studentCode: string;
  specializationId: number | '';
  departmentId: number | '';
  majorId: number | '';
  currentTerm: number | '';
  semesterIdForGPA: number | '';
  minGPA: number | '';
  maxGPA: number | '';
  isIncludeBehavior: boolean;
  semesterIdForBehavior: number | '';
  promptForBehavior: string;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  page: number | '';
  tab: '' | 'RECOMMENDED'
}

const initialState: StudentListState = {
  open: true,
  searchTerm: '',
  studentCode: '',
  specializationId: '',
  departmentId: '',
  majorId: '',
  currentTerm: '',
  semesterIdForGPA: '',
  minGPA: '',
  maxGPA: '',
  isIncludeBehavior: true,
  semesterIdForBehavior: '',
  promptForBehavior: '',
  sortBy: 'createdDate',
  sortDirection: 'ASC',
  page: '',
  tab: '',
};

/**
 * The filter slice.
 */
export const recommendedStudentListSlice = createSlice({
  name: 'staffRecommendedStudentList',
  initialState,
  reducers: {
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
    setStudentCode: (state, action: PayloadAction<string>) => {
      state.studentCode = action.payload;
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
    setCurrentTerm: (state, action: PayloadAction<number | ''>) => {
      state.currentTerm = action.payload;
    },
    setSemesterIdForGPA: (state, action: PayloadAction<number | ''>) => {
      state.semesterIdForGPA = action.payload;
    },
    setMinGPA: (state, action: PayloadAction<number | ''>) => {
      state.minGPA = action.payload;
    },
    setMaxGPA: (state, action: PayloadAction<number | ''>) => {
      state.maxGPA = action.payload;
    },
    setIsIncludeBehavior: (state, action: PayloadAction<boolean>) => {
      state.isIncludeBehavior = action.payload;
    },
    setSemesterIdForBehavior: (state, action: PayloadAction<number | ''>) => {
      state.semesterIdForBehavior = action.payload;
    },
    setPromptForBehavior: (state, action: PayloadAction<string>) => {
      state.promptForBehavior = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'ASC' | 'DESC'>) => {
      state.sortDirection = action.payload;
    },
    setPage: (state, action: PayloadAction<number | ''>) => {
      state.page = action.payload;
    },
    setTab: (state, action: PayloadAction<'' | 'RECOMMENDED'>) => {
      state.tab = action.payload
    },
    resetFilter: (state) => {
      state = initialState
    }
  },
  selectors: {
    selectFilter: (filter: StudentListState) => filter,
    selectSearchTerm: (state: StudentListState) => state.searchTerm,
  },
});

/**
 * Lazy loading
 */
rootReducer.inject(recommendedStudentListSlice);
const injectedSlice = recommendedStudentListSlice.injectInto(rootReducer);

export const {
  filterOpen,
  filterClose,
  filterToggle,
  setSearchTerm,
  setStudentCode,
  setSpecializationId,
  setDepartmentId,
  setMajorId,
  setCurrentTerm,
  setSemesterIdForGPA,
  setMinGPA,
  setMaxGPA,
  // setIsIncludeBehavior,
  setSemesterIdForBehavior,
  setPromptForBehavior,
  setSortBy,
  setSortDirection,
  setPage,
  resetFilter
} = recommendedStudentListSlice.actions;

export const {
  selectFilter,
  selectSearchTerm,
} = injectedSlice.selectors;

export default recommendedStudentListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof recommendedStudentListSlice> { }
}
