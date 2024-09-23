import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
import { ReactElement } from 'react';

type InitialStateProps = {
	open: boolean;
	children: ReactElement | string;
};

/**
 * The initial state of the dialog slice.
 */
const initialState: InitialStateProps = {
	open: false,
	children: ''
};

/**
 * The  Dialog slice
 */
export const dialogSlice = createSlice({
	name: 'dialog',
	initialState,
	reducers: {
		openDialog: (state, action: PayloadAction<{ children: InitialStateProps['children'] }>) => {
			state.open = true;
			state.children = action.payload.children;
		},
		closeDialog: () => initialState
	},
	selectors: {
		selectDialogState: (dialog) => dialog.open,
		selectDialogProps: (dialog) => dialog
	}
});

/**
 * Lazy load
 * */
rootReducer.inject(dialogSlice);
const injectedSlice = dialogSlice.injectInto(rootReducer);

declare module '@shared/store' {
	export interface LazyLoadedSlices extends WithSlice<typeof dialogSlice> { }
}

export const { closeDialog, openDialog } = dialogSlice.actions;

export const { selectDialogState, selectDialogProps } = injectedSlice.selectors;

export type dialogSliceType = typeof dialogSlice;

export default dialogSlice.reducer;
