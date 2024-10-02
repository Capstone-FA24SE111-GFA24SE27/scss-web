import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { WithSlice, createSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
import { DeepPartial } from 'react-hook-form';
import { formatISO } from 'date-fns/formatISO';
import { AppointmentScheduleType, GetAppointmentApiArg } from './calendar-api';

export const dateFormdat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export type EventDialogType = {
	type: 'event' | 'day';
	props: {
		open: boolean;
		anchorPosition?: { top: number; left: number };
	};
	data?: AppointmentScheduleType[] | null;
};

const initialState: {
	eventDialog: EventDialogType;
	data: AppointmentScheduleType[] | null;
} = {
	eventDialog: {
		type: 'day',
		props: {
			open: false,
			anchorPosition: { top: 200, left: 400 },
		},
		data: null,
	},
	data: null,
};

/**
 * The CalendarApp labels slice.
 */
export const calendarAppSlice = createSlice({
	name: 'calendarApp',
	initialState,
	reducers: {
		openEventDetailDialog: {
			prepare: (
				clickInfo: EventClickArg,
				appointment: AppointmentScheduleType
			) => {
				const { jsEvent, event } = clickInfo;
				const { id, title, allDay, start, end, extendedProps } = event;

				const payload: EventDialogType = {
					type: 'event',
					props: {
						open: true,
						anchorPosition: {
							top: jsEvent!.pageY,
							left: jsEvent!.pageX,
						},
					},
					data: [appointment],
				};
				// console.log('event detail', JSON.stringify(payload))

				return { payload, meta: undefined, error: null };
			},
			reducer: (state, action) => {
				state.eventDialog = action.payload as EventDialogType;
			},
		},
		openDayDetailDialog: {
			prepare: (
				selectInfo: Partial<DateSelectArg>,
				events: AppointmentScheduleType[]
			) => {
				const { jsEvent } = selectInfo;

				const payload: EventDialogType = {
					type: 'day',
					props: {
						open: true,
						anchorPosition: {
							top: jsEvent!.pageY,
							left: jsEvent!.pageX,
						},
					},
					data: events,
				};
				console.log('day detail', JSON.stringify(payload));
				return { payload, meta: undefined, error: null };
			},
			reducer: (state, action) => {
				state.eventDialog = action.payload as EventDialogType;
			},
		},
		closeDayDetailDialog: (state) => {
			state.eventDialog = initialState.eventDialog;
		},
		closeEventDetailDialog: (state) => {
			state.eventDialog = {
				...initialState.eventDialog,
				type: 'event',
			};
		},
		addScheduleData: (state, actions) => {
			const prev = state.data ? state.data : []
			state.data = [...actions.payload, ...prev]
		},
	},
	selectors: {
		selectEventDialog: (state) => state.eventDialog,
		selectScheduleData: (state) => state.data
	},
});

/**
 * Lazy load
 * */
rootReducer.inject(calendarAppSlice);
const injectedSlice = calendarAppSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof calendarAppSlice> {}
}

export const { selectEventDialog, selectScheduleData } = injectedSlice.selectors;

export const {
	openEventDetailDialog,
	closeEventDetailDialog,
	openDayDetailDialog,
	closeDayDetailDialog,
	addScheduleData,
} = calendarAppSlice.actions;

export type labelsSliceType = typeof calendarAppSlice;

export default calendarAppSlice.reducer;
