import { roles } from '@/shared/constants';
import { Message, Question, Role } from '@/shared/types';
import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
import { removeListener } from 'process';

type initialStateType = {
	// enteredValues: Record<string, Object>;
};

// type PayloadType = {
// 	tab: Role;
// 	formValues: any;
// };

const initialState = {
	tab: 0,
	searchTerm: undefined,
};

export const viewAccountAdminSlice = createSlice({
	name: 'viewAccountAdminSlice',
	initialState,
	reducers: {
		setAdminViewAccountTab: (state, action) => {
			state.tab = action.payload;
		},
		setAdminViewAccountSearchTerm: (state, action) => {
			state.searchTerm = action.payload;
		},
	},
	selectors: {
		selectViewAccountTab: (state) => state.tab,
		selectViewAccountSearchTerm: (state) => state.searchTerm,
	},
});

rootReducer.inject(viewAccountAdminSlice);
const injectedSlice = viewAccountAdminSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof viewAccountAdminSlice> {}
}

export const { setAdminViewAccountTab, setAdminViewAccountSearchTerm } =
	viewAccountAdminSlice.actions;

export const { selectViewAccountTab, selectViewAccountSearchTerm } =
	injectedSlice.selectors;

export default viewAccountAdminSlice.reducer;
