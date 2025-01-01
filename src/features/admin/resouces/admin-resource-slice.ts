import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

const initialState = {
	questionCardSearch: '',
	questionCardCategorySearch: '',
	problemTagSearch: '',
	problemTagCategorySearch: '',
	timeSlotsSearch: '',
	academicTab: 0,
	questionCardtab: 0,
	semesterSearch: undefined,
	departmentFilter: {
		keyword: undefined,
		page: 1,
		size: 5,
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
		setQuestionSearch: (state, action) => {
			state.questionCardSearch = action.payload;
		},
		setAcademicTab: (state, action) => {
			state.academicTab = action.payload;
		},
		setQuestionTab: (state, action) => {
			state.questionCardtab = action.payload;
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
	},
	selectors: {
		selectResourceState: (state) => state,
		selectAdminQuestionCardSearchCategory: (state) =>
			state.questionCardCategorySearch,
		selectAdminQuestionCardSearch: (state) => state.questionCardSearch,
		selectAdminAcademicTab: (state) => state.academicTab,
		selectAdminQuestionTab: (state) => state.academicTab,
		selectDepartmentFilter: (state) => state.departmentFilter,
		selectMajorFilter: (state) => state.majorFilter,
		selectSpecializationFilter: (state) => state.specializationFilter,
		selectSemesterSearchAdmin: (state) => state.semesterSearch,
	},
});
/**
 * Lazy loading
 */
rootReducer.inject(adminResourceSlice);
const injectedSlice = adminResourceSlice.injectInto(rootReducer);
export const {
	setQuestionSearch,
	setAcademicTab,
	setQuestionTab,
	setDepartmentFilter,
	setMajorFilter,
	setSpecializationFilter,
	setDepartmentFilterSearchTerm,
	setMajorFilterSearchTerm,
	setSpecializationFilterSearchTerm,
	setSemesterAdminSearch,
} = adminResourceSlice.actions;
export const {
	selectAdminQuestionCardSearch,
	selectAdminQuestionCardSearchCategory,
	selectResourceState,
	selectAdminAcademicTab,
	selectAdminQuestionTab,
	selectDepartmentFilter,
	selectMajorFilter,
	selectSpecializationFilter,
	selectSemesterSearchAdmin,
} = injectedSlice.selectors;

export default adminResourceSlice.reducer;

declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof adminResourceSlice> {}
}
