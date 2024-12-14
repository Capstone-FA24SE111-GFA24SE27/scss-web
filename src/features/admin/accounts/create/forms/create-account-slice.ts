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
			avatarLink: '',
			email: '',
			password: '',
			gender: 'MALE',
			phoneNumber: '',
			dateOfBirth: null,
			fullName: '',
			departmentId: 0,
			majorId: 0,
			specializationId: 0,
			specializedSkills: '',
			otherSkills: '',
			workHistory: '',
			achievements: '',
			qualifications: [
				// {
				// 	degree: '',
				// 	fieldOfStudy: '',
				// 	institution: '',
				// 	yearOfGraduation: '',
				// 	imageUrl: '',
				// },
			],
			certifications: [
				// {
				// 	name: '',
				// 	organization: '',
				// 	imageUrl: '',
				// },
			],
		},

		NON_ACADEMIC_COUNSELOR: {
			avatarLink: '',
			email: '',
			password: '',
			gender: 'MALE',
			phoneNumber: '',
			dateOfBirth: '',
			fullName: '',
			expertiseId: 0,
			specializedSkills: '',
			otherSkills: '',
			workHistory: '',
			achievements: '',
			qualifications: [
				
			],
			certifications: [
				
			],
		},

		MANAGER: {
			avatarLink: '',
			email: '',
			password: '',
			gender: 'MALE',
			phoneNumber: '',
			dateOfBirth: '',
			fullName: '',
		},

		SUPPORT_STAFF: {
			avatarLink: '',
			email: '',
			password: '',
			gender: 'MALE',
			phoneNumber: '',
			dateOfBirth: '',
			fullName: '',
		},
	},
};

export const createAccountAdminSlice = createSlice({
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
		selectInitialValues: () => initialState.enteredValues,
	},
});

rootReducer.inject(createAccountAdminSlice);
const injectedSlice = createAccountAdminSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof createAccountAdminSlice> {}
}

export const { setEnteredValueByTab, clearEnteredValueByTab } =
	createAccountAdminSlice.actions;

export const { selectEnteredValues, selectInitialValues } =
	injectedSlice.selectors;

export default createAccountAdminSlice.reducer;
