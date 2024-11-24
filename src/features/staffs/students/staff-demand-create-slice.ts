import { Counselor } from '@/shared/types';
import { SatelliteAlt } from '@mui/icons-material';
import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';

interface CreateDemandState {
	matchType: 'ACADEMIC' | 'NON_ACADEMIC';
	counselorGender: 'MALE' | 'FEMALE';
	expertiseId?: string;
	departmentId?: string;
	specializationId?: string;
	majorId?: string;
	counselorId?: string | number;
}

const initialState: CreateDemandState = {
	matchType: 'ACADEMIC',
	counselorGender: 'MALE',
	expertiseId: null,
	departmentId: null,
	specializationId: null,
	majorId: null,
	counselorId: null,
};

/**
 * The filter slice.
 */
export const createDemandFormStaffSlice = createSlice({
	name: 'staffCreateDemandForm',
	initialState,
	reducers: {
		setMatchType: (state, action) => {
			state.matchType = action.payload;
		},
		setCounselorGender: (state, action) => {
			state.counselorGender = action.payload;
		},
		setExpertiseId: (state, action) => {
			state.expertiseId = action.payload;
		},
		setDepartmentId: (state, action) => {
			state.departmentId = action.payload;
		},
		setMajorId: (state, action) => {
			state.majorId = action.payload;
		},
		setSpecializationId: (state, action) => {
			state.specializationId = action.payload;
		},
        setCounselorId: (state,action) => {
            state.counselorId = action.payload
        }
	},
	selectors: {
        selectCreateDemandCounselorFormData: (state) => state,
        selectCounselor: (state) => state.counselorId
    },
});

/**
 * Lazy loading
 */
rootReducer.inject(createDemandFormStaffSlice);
const injectedSlice = createDemandFormStaffSlice.injectInto(rootReducer);

export const {
    setCounselorId,
    setCounselorGender,
    setDepartmentId,
    setExpertiseId,
    setMajorId,
    setMatchType,
    setSpecializationId
} = createDemandFormStaffSlice.actions;

export const {
    selectCounselor,
    selectCreateDemandCounselorFormData
} = injectedSlice.selectors;

export default createDemandFormStaffSlice.reducer;

declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof createDemandFormStaffSlice> {}
}
