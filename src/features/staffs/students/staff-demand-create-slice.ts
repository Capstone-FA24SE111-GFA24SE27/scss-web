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
	contactNote?: string;
	priorityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
	additionalInformation?: string;
	issueDescription?: string;
	causeDescription?: string;
}

const initialState: CreateDemandState = {
	matchType: 'ACADEMIC',
	counselorGender: 'MALE',
	expertiseId: null,
	departmentId: null,
	specializationId: null,
	majorId: null,
	counselorId: null,
	contactNote: '',
	priorityLevel: 'MEDIUM',
	additionalInformation: '',
	issueDescription: '',
	causeDescription: '',
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
		setCounselorId: (state, action) => {
			state.counselorId = action.payload;
		},
		setIssueDescription: (state, action) => {
			state.issueDescription = action.payload;
		},
		setCauseDescription: (state, action) => {
			state.causeDescription = action.payload;
		},
		setAdditionalInfo: (state, action) => {
			state.additionalInformation = action.payload;
		},
		setContactNote: (state, action) => {
			state.contactNote = action.payload;
		},
		setPriorityLevel: (state, action) => {
			state.priorityLevel = action.payload;
		},
	},
	selectors: {
		selectCreateDemandCounselorFormData: (state) => state,
		selectCounselor: (state) => state.counselorId,
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
	setSpecializationId,
	setAdditionalInfo,
	setCauseDescription,
	setContactNote,
	setIssueDescription,
	setPriorityLevel
} = createDemandFormStaffSlice.actions;

export const { selectCounselor, selectCreateDemandCounselorFormData } =
	injectedSlice.selectors;

export default createDemandFormStaffSlice.reducer;

declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof createDemandFormStaffSlice> {}
}
