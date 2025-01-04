import { CounselingDemand, Counselor, DemandType } from '@/shared/types';
import { SatelliteAlt } from '@mui/icons-material';
import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';

interface CreateDemandState {
	counselorId?: string | number;
	contactNote?: string;
	priorityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
	additionalInformation?: string;
	issueDescription?: string;
	causeDescription?: string;
	counselor?: Counselor;
	demand?: CounselingDemand;
}

const initialState: CreateDemandState = {
	counselorId: null,
	contactNote: '',
	priorityLevel: 'MEDIUM',
	additionalInformation: '',
	issueDescription: '',
	causeDescription: '',
	counselor: null,
	demand: null,
};

/**
 * The filter slice.
 */
export const updateDemandFormStaffSlice = createSlice({
	name: 'staffUpdateDemandForm',
	initialState,
	reducers: {
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
		setCounselor: (state, action) => {
			state.counselor = action.payload;
		},
		setInitialDemandValue: (
			state,
			action: PayloadAction<CounselingDemand>
		) => {
			state.priorityLevel = action.payload.priorityLevel;
			state.contactNote = action.payload.contactNote;
			state.additionalInformation = action.payload.additionalInformation;
			state.causeDescription = action.payload.causeDescription;
			state.issueDescription = action.payload.issueDescription;
			state.counselorId = action.payload.counselor.id;
			state.counselor = action.payload.counselor;
			state.demand = action.payload;
		},
		clearDemand: (state) => {
			state = initialState;
		},
	},
	selectors: {
		selectUpdateDemandCounselorFormData: (state) => state,
		selectCounselorUpdateDemand: (state) => state.counselor,
		selectDemand: (state) => state.demand,
	},
});

/**
 * Lazy loading
 */
rootReducer.inject(updateDemandFormStaffSlice);
const injectedSlice = updateDemandFormStaffSlice.injectInto(rootReducer);

export const {
	setCounselorId,
	setAdditionalInfo,
	setCauseDescription,
	setContactNote,
	setIssueDescription,
	setPriorityLevel,
	setInitialDemandValue,
	setCounselor,
	clearDemand,
} = updateDemandFormStaffSlice.actions;

export const {
	selectCounselorUpdateDemand,
	selectUpdateDemandCounselorFormData,
	selectDemand,
} = injectedSlice.selectors;

export default updateDemandFormStaffSlice.reducer;

declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof updateDemandFormStaffSlice> {}
}
