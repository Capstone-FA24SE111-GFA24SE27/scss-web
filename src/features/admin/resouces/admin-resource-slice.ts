import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

const initialState = {
	selectedProblemTagUpdate: null,
	selectedProblemTagCategoryUpdate: null,
	problemTagSearch: '',
	problemTagCategorySearch: '',
	selectedProblemTagCategory: undefined,
	timeSlotsSearch: '',
	academicTab: 0,
	semesterSearch: undefined,
	departmentFilter: {
		keyword: undefined,
		page: 1,
		size: 10,
		sortDirection: 'DESC',
	},
	majorFilter: {
		keyword: undefined,
		page: 1,
		size: 10,
		sortDirection: 'DESC',
	},
	specializationFilter: {
		keyword: undefined,
		page: 1,
		size: 10,
		sortDirection: 'DESC',
	},
};
/**
 * The filter slice.
 */
export const adminResourceSlice = createSlice({
	name: 'adminResourceSlice',
	initialState,
	reducers: {
		setAcademicTab: (state, action) => {
			state.academicTab = action.payload;
		},
		setSelectedFilterProblemTagCategory: (state, action) => {
			state.selectedProblemTagCategory = action.payload;
		},
		setSelectedProblemTagUpdate: (state, action) => {
			state.selectedProblemTagUpdate = action.payload;
		},
		setDepartmentFilter: (state, action) => {
			state.departmentFilter = action.payload;
		},
		setMajorFilter: (state, action) => {
			state.majorFilter = action.payload;
		},
		setSpecializationFilter: (state, action) => {
			state.specializationFilter = action.payload;
		},
		setDepartmentFilterSearchTerm: (state, action) => {
			state.departmentFilter.keyword = action.payload;
		},
		setMajorFilterSearchTerm: (state, action) => {
			state.majorFilter.keyword = action.payload;
		},
		setSpecializationFilterSearchTerm: (state, action) => {
			state.specializationFilter.keyword = action.payload;
		},
		setSemesterAdminSearch: (state, action) => {
			state.semesterSearch = action.payload;
		},
		setProblemTagSearch: (state, action) => {
			state.problemTagSearch = action.payload;
		},
		setProblemTagCategorySearch: (state, action) => {
			state.problemTagCategorySearch = action.payload;
		},
		setTimeSlotSearch: (state, action) => {
			state.timeSlotsSearch = action.payload;
		},
		setProblemTagCategoryUpdate: (state, action) => {
			state.selectedProblemTagCategoryUpdate = action.payload;
		},
	},
	selectors: {
		selectResourceState: (state) => state,
		selectAdminAcademicTab: (state) => state.academicTab,
		selectDepartmentFilter: (state) => state.departmentFilter,
		selectMajorFilter: (state) => state.majorFilter,
		selectSpecializationFilter: (state) => state.specializationFilter,
		selectSemesterSearchAdmin: (state) => state.semesterSearch,
		selectProblemTagSearch: (state) => state.problemTagSearch,
		selectProblemTagCategorySearch: (state) =>
			state.problemTagCategorySearch,
		selectProblemTagFilterCategory: (state) =>
			state.selectedProblemTagCategory,
		selectTimeSlotSearch: (state) => state.timeSlotsSearch,
		selectProblemTagUpdate: (state) => state.selectedProblemTagUpdate,
		selectProblemTagCategoryUpdate: (state) =>
			state.selectedProblemTagCategoryUpdate,
	},
});
/**
 * Lazy loading
 */
rootReducer.inject(adminResourceSlice);
const injectedSlice = adminResourceSlice.injectInto(rootReducer);
export const {
	setAcademicTab,
	setProblemTagCategorySearch,
	setProblemTagSearch,
	setDepartmentFilter,
	setMajorFilter,
	setSpecializationFilter,
	setDepartmentFilterSearchTerm,
	setMajorFilterSearchTerm,
	setSpecializationFilterSearchTerm,
	setSemesterAdminSearch,
	setSelectedFilterProblemTagCategory,
	setTimeSlotSearch,
	setSelectedProblemTagUpdate,
	setProblemTagCategoryUpdate,
} = adminResourceSlice.actions;
export const {
	selectResourceState,
	selectAdminAcademicTab,
	selectDepartmentFilter,
	selectMajorFilter,
	selectSpecializationFilter,
	selectSemesterSearchAdmin,
	selectProblemTagCategorySearch,
	selectProblemTagSearch,
	selectProblemTagFilterCategory,
	selectTimeSlotSearch,
	selectProblemTagUpdate,
	selectProblemTagCategoryUpdate,
} = injectedSlice.selectors;

export default adminResourceSlice.reducer;

declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof adminResourceSlice> {}
}
