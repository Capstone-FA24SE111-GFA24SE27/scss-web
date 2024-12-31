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
	},
	selectors: {
		selectResourceState: (state) => state,
		selectAdminQuestionCardSearchCategory: (state) =>
			state.questionCardCategorySearch,
		selectAdminQuestionCardSearch: (state) => state.questionCardSearch,
		selectAdminAcademicTab: (state) => state.academicTab,
	},
});
/**
 * Lazy loading
 */
rootReducer.inject(adminResourceSlice);
const injectedSlice = adminResourceSlice.injectInto(rootReducer);
export const { setQuestionSearch, setAcademicTab } = adminResourceSlice.actions;
export const {
	selectAdminQuestionCardSearch,
	selectAdminQuestionCardSearchCategory,
	selectResourceState,
	selectAdminAcademicTab,
} = injectedSlice.selectors;

export default adminResourceSlice.reducer;

declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof adminResourceSlice> {}
}
