import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

const initialState = {
	questionCardSearch: '',
	contributedQuestionFilter: {
		search: '',
		status: undefined,
		counselorId: undefined,
		category: undefined,
	},
	questionCardCategorySearch: '',
	contributedQuestionTab: 0,
	questionCardtab: 0,
};
/**
 * The filter slice.
 */
export const adminQuestionSlice = createSlice({
	name: 'adminQuestionSlice',
	initialState,
	reducers: {
		setContributedQuestionTab: (state, action) => {
			state.contributedQuestionTab = action.payload;
		},
		setContributedQuestionFilter: (state, action) => {
			state.contributedQuestionFilter = action.payload;
		},
		setQuestionSearch: (state, action) => {
			state.questionCardSearch = action.payload;
		},

		setQuestionCategorySearch: (state, action) => {
			state.questionCardCategorySearch = action.payload;
		},

		setQuestionTab: (state, action) => {
			state.questionCardtab = action.payload;
		},
	},
	selectors: {
		selectResourceState: (state) => state,

		selectAdminQuestionCardSearchCategory: (state) =>
			state.questionCardCategorySearch,
		selectAdminQuestionCardSearch: (state) => state.questionCardSearch,
		selectContributedQuestionTab: (state) => state.contributedQuestionTab,
		selectContributedQuestionFilter: (state) =>
			state.contributedQuestionFilter,
		selectAdminQuestionTab: (state) => state.questionCardtab,
	},
});
/**
 * Lazy loading
 */
rootReducer.inject(adminQuestionSlice);
const injectedSlice = adminQuestionSlice.injectInto(rootReducer);
export const {
	setQuestionSearch,
	setQuestionCategorySearch,
	setQuestionTab,
	setContributedQuestionTab,
	setContributedQuestionFilter,
} = adminQuestionSlice.actions;
export const {
	selectAdminQuestionCardSearch,
	selectAdminQuestionCardSearchCategory,
	selectResourceState,
	selectContributedQuestionTab,
	selectContributedQuestionFilter,
	selectAdminQuestionTab,
} = injectedSlice.selectors;

export default adminQuestionSlice.reducer;

declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof adminQuestionSlice> {}
}
