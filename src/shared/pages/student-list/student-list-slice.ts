import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';

interface StudentListState {
  open: boolean;
  searchTerm: string;
  studentCode: string;
  specializationId: number ;
  departmentId: number ;
  majorId: number ;
  currentTerm: number ;
  semesterIdForGPA: number ;
  minGPA: number ;
  maxGPA: number ;
  isUsingPrompt: boolean;
  semesterIdForBehavior: number ;
  promptForBehavior: string;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  page: number ;
  tab: '' | 'RECOMMENDED';
  behaviorList: string;
  typeOfAttendanceFilter: 'COUNT' | 'PERCENTAGE'; // New state
  semesterIdForAttendance: number ; // New state
  fromForAttendanceCount: number ; // New state
  toForAttendanceCount: number ; // New state
  fromForAttendancePercentage: number ; // New state
  toForAttendancePercentage: number ; // New state
  minSubjectForAttendance: number ; // New state
}

const initialState: StudentListState = {
  open: true,
  searchTerm: undefined,
  studentCode: undefined,
  specializationId: undefined,
  departmentId: undefined,
  majorId: undefined,
  currentTerm: undefined,
  semesterIdForGPA: undefined,
  minGPA: undefined,
  maxGPA: undefined,
  isUsingPrompt: false,
  semesterIdForBehavior: undefined,
  promptForBehavior: undefined,
  sortBy: 'createdDate',
  sortDirection: 'ASC',
  page: undefined,
  tab: undefined,
  behaviorList: undefined,
  typeOfAttendanceFilter: 'COUNT', 
  semesterIdForAttendance: undefined, 
  fromForAttendanceCount: undefined, 
  toForAttendanceCount: undefined, 
  fromForAttendancePercentage: 0, 
  toForAttendancePercentage: 100, 
  minSubjectForAttendance: undefined, 
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
    setSpecializationId: (state, action: PayloadAction<number>) => {
      state.specializationId = action.payload;
    },
    setDepartmentId: (state, action: PayloadAction<number>) => {
      state.departmentId = action.payload;
    },
    setMajorId: (state, action: PayloadAction<number>) => {
      state.majorId = action.payload;
    },
    setCurrentTerm: (state, action: PayloadAction<number>) => {
      state.currentTerm = action.payload;
    },
    setSemesterIdForGPA: (state, action: PayloadAction<number | undefined>) => {
      state.semesterIdForGPA = action.payload;
    },
    setMinGPA: (state, action: PayloadAction<number | undefined>) => {
      state.minGPA = action.payload;
    },
    setMaxGPA: (state, action: PayloadAction<number | undefined>) => {
      state.maxGPA = action.payload;
    },
    setIsUsingPrompt: (state, action: PayloadAction<boolean>) => {
      state.isUsingPrompt = action.payload;
    },
    setSemesterIdForBehavior: (state, action: PayloadAction<number | undefined>) => {
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
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTab: (state, action: PayloadAction<'' | 'RECOMMENDED'>) => {
      state.tab = action.payload;
    },
    resetFilter: () => {
      return { ...initialState }
    },
    setBehaviorList: (state, action: PayloadAction<string>) => {
      state.behaviorList = action.payload;
    },
    setTypeOfAttendanceFilter: (state, action: PayloadAction<'COUNT' | 'PERCENTAGE'>) => {
      state.typeOfAttendanceFilter = action.payload;
    },
    setSemesterIdForAttendance: (state, action: PayloadAction<number>) => {
      state.semesterIdForAttendance = action.payload;
    },
    setFromForAttendanceCount: (state, action: PayloadAction<number>) => {
      state.fromForAttendanceCount = action.payload;
    },
    setToForAttendanceCount: (state, action: PayloadAction<number>) => {
      state.toForAttendanceCount = action.payload;
    },
    setFromForAttendancePercentage: (state, action: PayloadAction<number>) => {
      state.fromForAttendancePercentage = action.payload;
    },
    setToForAttendancePercentage: (state, action: PayloadAction<number>) => {
      state.toForAttendancePercentage = action.payload;
    },
    setMinSubjectForAttendance: (state, action: PayloadAction<number>) => {
      state.minSubjectForAttendance = action.payload;
    },
  },
  selectors: {
    selectFilter: (filter: StudentListState) => filter,
    selectSearchTerm: (state: StudentListState) => state.searchTerm,
    selectBehaviorList: (state: StudentListState) => state.behaviorList,
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
  setBehaviorList,
  setTypeOfAttendanceFilter,
  setSemesterIdForAttendance,
  setFromForAttendanceCount,
  setToForAttendanceCount,
  setFromForAttendancePercentage,
  setToForAttendancePercentage,
  setMinSubjectForAttendance
} = studentListSlice.actions;

export const {
  selectFilter,
  selectSearchTerm,
  selectBehaviorList,
} = injectedSlice.selectors;

export default studentListSlice.reducer;

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof studentListSlice> {}
}
