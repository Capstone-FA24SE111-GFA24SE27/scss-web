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
  isIncludeBehavior: false,
  semesterIdForBehavior: '',
  promptForBehavior: '',
  sortBy: 'createdDate',
  sortDirection: 'ASC',
  page: '',
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
  },
  selectors: {
    selectFilter: (filter: StudentListState) => filter,
    selectSearchTerm: (state: StudentListState) => state.searchTerm,
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
  setIsIncludeBehavior,
  setSemesterIdForBehavior,
  setPromptForBehavior,
  setSortBy,
  setSortDirection,
  setPage,
} = studentListSlice.actions;

export const {
  selectFilter,
  selectSearchTerm,
} = injectedSlice.selectors;

export default studentListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof studentListSlice> { }
}
