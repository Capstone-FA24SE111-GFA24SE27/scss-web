import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { WithSlice, createSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
import { Appointment, HolidayScheduleType } from '@/shared/types';

export const dateFormdat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export type EventDialogType = {
	props: {
		type: 'holiday' | 'appointment';
		open: boolean;
		anchorPosition?: { top: number; left: number };
	};
	data?: Appointment | HolidayScheduleType | null;
};

const initialState: {
	eventDialog: EventDialogType;
	data: Appointment[] | null;
	holidays: HolidayScheduleType[] | null;
} = {
	eventDialog: {
		props: {
			type: 'appointment',
			open: false,
			anchorPosition: { top: 200, left: 400 },
		},
		data: null,
	},
	data: null,
	holidays: null,
};

/**
 * The CalendarApp labels slice.
 */
export const scheduleSlice = createSlice({
	name: 'sharedSchedule',
	initialState,
	reducers: {
		openEventDetailDialog: {
			prepare: (
				clickInfo: EventClickArg,
				appointment: Appointment | HolidayScheduleType,
				type: 'holiday' | 'appointment'
			) => {
				const { jsEvent, event } = clickInfo;

				const payload: EventDialogType = {
					props: {
						type: type,
						open: true,
						anchorPosition: {
							top: jsEvent!.pageY,
							left: jsEvent!.pageX,
						},
					},
					data: appointment,
				};
				// console.log('event detail', JSON.stringify(payload))

				return { payload, meta: undefined, error: null };
			},
			reducer: (state, action) => {
				state.eventDialog = action.payload;
			},
		},
		closeEventDetailDialog: (state) => {
			state.eventDialog = initialState.eventDialog;
		},
		addScheduleData: (state, actions) => {
			const prev = state.data ? state.data : [];
			state.data = [...actions.payload, ...prev];
		},
		addHolidays: (state, actions) => {
			const prev = state.holidays ? state.holidays : [];
			state.holidays = [...actions.payload, ...prev];
		},
		resetSchedule:(state, actions) => {
			state.data = [];
		},
	},
	selectors: {
		selectEventDialog: (state) => state.eventDialog,
		selectScheduleData: (state) => state.data,
		selectHolidays: (state) => state.holidays,
	},
});

/**
 * Lazy load
 * */
rootReducer.inject(scheduleSlice);
const injectedSlice = scheduleSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof scheduleSlice> {}
}

export const { selectEventDialog, selectScheduleData, selectHolidays } =
	injectedSlice.selectors;

export const {
	openEventDetailDialog,
	closeEventDetailDialog,
	addScheduleData,
	addHolidays,
	resetSchedule,
} = scheduleSlice.actions;

export type labelsSliceType = typeof scheduleSlice;

export default scheduleSlice.reducer;
