import { roles } from '@/shared/constants';
import { Message, Question, Role } from '@/shared/types';
import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
import { removeListener } from 'process';

type initialStateType = {
	enteredValues: Record<string, Object>;
};

type PayloadType = {
	tab: Role;
	formValues: any;
};

const initialState: initialStateType = {
	enteredValues: {
		ACADEMIC_COUNSELOR: {
			email: '',
			password: '',
			gender: 'MALE',
			phoneNumber: '',
			dateOfBirth: '',
			fullName: '',
			departmentId: 0,
			majorId: 0,
			specializationId: 0,
		},

		NON_ACADEMIC_COUNSELOR: {
			email: '',
			password: '',
			gender: 'MALE',
			phoneNumber: '',
			dateOfBirth: '',
			fullName: '',
			expertiseId: 0,
		},

		MANAGER: {
			email: '',
			password: '',
			gender: 'MALE',
			phoneNumber: '',
			dateOfBirth: '',
			fullName: '',
		},

		SUPPORT_STAFF: {
			email: '',
			password: '',
			gender: 'MALE',
			phoneNumber: '',
			dateOfBirth: '',
			fullName: '',
		},
	},
};

export const chatSessionSlice = createSlice({
	name: 'createAccountAdminSlice',
	initialState,
	reducers: {
		setEnteredValueByTab: (state, action: PayloadAction<PayloadType>) => {
			state.enteredValues[action.payload.tab] = action.payload.formValues;
		},
		clearEnteredValueByTab: (state, action: PayloadAction<Role>) => {
			state.enteredValues[action.payload] =
				initialState.enteredValues[action.payload];
		},
	},
	selectors: {
		selectEnteredValues: (state) => state.enteredValues,
        selectInitialValues: () => initialState.enteredValues
	},
});

rootReducer.inject(chatSessionSlice);
const injectedSlice = chatSessionSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof chatSessionSlice> {}
}

export const { setEnteredValueByTab, clearEnteredValueByTab } = chatSessionSlice.actions;

export const { selectEnteredValues, selectInitialValues } = injectedSlice.selectors;

export default chatSessionSlice.reducer;
