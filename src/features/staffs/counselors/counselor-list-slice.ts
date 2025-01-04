import { CounselingType, Counselor } from '@/shared/types';
import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the filter slice.
 */

type initialType = {
	open: boolean;
	counselor: Counselor | null;
	searchTerm: string;
	counselorType: CounselingType;
	availableFrom: string;
	availableTo: string;
	departmentId?: number | string;
	majorId?: number | string;
	specializationId?: number | string;
	expertiseId?: number | string;
	ratingFrom?: number;
	ratingTo?: number;
	gender?: 'MALE' | 'FEMALE';
};

const initialState: initialType = {
	open: true,
	counselor: null,
	searchTerm: '',
	counselorType: 'ACADEMIC',
	availableFrom: ``,
	availableTo: ``,
	expertiseId: '',
	departmentId: '',
	majorId: '',
	specializationId: '',
	ratingFrom: undefined,
	ratingTo: undefined,
	gender: undefined,
};
/**
 * The filter slice.
 */
export const counselorListStaffSlice = createSlice({
	name: 'counselorListStaff',
	initialState,
	reducers: {
		setSelectedCounselor: (state, action: PayloadAction<Counselor>) => {
			state.counselor = action.payload;
		},
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
		setCounselorType: (
			state,
			action: PayloadAction<'ACADEMIC' | 'NON_ACADEMIC'>
		) => {
			state.counselorType = action.payload;
		},
		setAvailableFrom: (state, action: PayloadAction<string>) => {
			state.availableFrom = action.payload;
		},
		setAvailableTo: (state, action: PayloadAction<string>) => {
			state.availableTo = action.payload;
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
		setExpertiseId: (state, action: PayloadAction<number>) => {
			state.expertiseId = action.payload;
		},
		setRatingFrom: (state, action: PayloadAction<number>) => {
			state.ratingFrom = action.payload;
		},
		setRatingTo: (state, action: PayloadAction<number>) => {
			state.ratingTo = action.payload;
		},
		setGender: (state, action: PayloadAction<'MALE' | 'FEMALE'>) => {
			state.gender = action.payload;
		},
	},
	selectors: {
		selectFilter: (filter) => filter,
		selectSearchTerm: (state) => state.searchTerm,
		selectCounselorType: (state) => state.counselorType,
		selectCounselor: (state) => state.counselor,
	},
});
/**
 * Lazy loading
 */
rootReducer.inject(counselorListStaffSlice);
const injectedSlice = counselorListStaffSlice.injectInto(rootReducer);
export const {
	filterOpen,
	filterClose,
	filterToggle,
	setSearchTerm,
	setCounselorType,
	setAvailableFrom,
	setAvailableTo,
	setSelectedCounselor,
	setSpecializationId,
	setDepartmentId,
	setMajorId,
	setExpertiseId,
	setRatingFrom,
	setRatingTo,
	setGender,
} = counselorListStaffSlice.actions;
export const {
	selectFilter,
	selectSearchTerm,
	selectCounselorType,
	selectCounselor,
} = injectedSlice.selectors;
export default counselorListStaffSlice.reducer;

declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof counselorListStaffSlice> {}
}
