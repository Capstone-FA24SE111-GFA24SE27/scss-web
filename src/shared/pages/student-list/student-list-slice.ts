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
  isUsingPrompt: boolean;
  semesterIdForBehavior: number | '';
  promptForBehavior: string;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  page: number | '';
  tab: '' | 'RECOMMENDED';
  behaviorList: string; // Added new property
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
  isUsingPrompt: false,
  semesterIdForBehavior: '',
  promptForBehavior: '',
  sortBy: 'createdDate',
  sortDirection: 'ASC',
  page: '',
  tab: '',
  behaviorList: '', // Initialize with an empty string
};

/**
 * The filter slice.
 */
export const studentListSlice = createSlice({
  name: 'studentList',
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
    setIsUsingPrompt: (state, action: PayloadAction<boolean>) => {
      state.isUsingPrompt = action.payload;
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
      state.tab = action.payload;
    },
    resetFilter: (state) => {
      state = initialState;
    },
    setBehaviorList: (state, action: PayloadAction<string>) => {
      state.behaviorList = action.payload; // Action for modifying behaviorList
    },
  },
  selectors: {
    selectFilter: (filter: StudentListState) => filter,
    selectSearchTerm: (state: StudentListState) => state.searchTerm,
    selectBehaviorList: (state: StudentListState) => state.behaviorList, // Selector for behaviorList
  },
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
  setStudentCode,
  setSpecializationId,
  setDepartmentId,
  setMajorId,
  setCurrentTerm,
  setSemesterIdForGPA,
  setMinGPA,
  setMaxGPA,
  setIsUsingPrompt,
  setSemesterIdForBehavior,
  setPromptForBehavior,
  setSortBy,
  setSortDirection,
  setPage,
  setTab,
  resetFilter,
  setBehaviorList, // Exporting the new action
} = studentListSlice.actions;

export const {
  selectFilter,
  selectSearchTerm,
  selectBehaviorList, // Exporting the new selector
} = injectedSlice.selectors;

export default studentListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof studentListSlice> {}
}
