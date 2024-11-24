import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	closeEventDetailDialog,
	selectEventDialog,
} from './schedule-slice';
import {
	Popover,
} from '@mui/material';
import { Appointment, AppointmentScheduleType, HolidayScheduleType } from '@/shared/types';
import { EventHolidayBody } from '@/features/counselors/counseling/calendar/calendar-components/event/EventHolidayBody';
import { AppointmentItem } from '..';

const EventDetailDialog = () => {
	const dispatch = useAppDispatch();
	const eventDialog = useAppSelector(selectEventDialog);

	/**
	 * Close Dialog
	 */
	function closeDialog() {
		return dispatch(closeEventDetailDialog());
	}

	if (eventDialog.data === null) {
		return null;
	}

	console.log(eventDialog.data)

	return (
		<Popover
			{...eventDialog.props}
			open={eventDialog.props.open}
			anchorReference='anchorPosition'
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'center',
				horizontal: 'left',
			}}
			onClose={closeDialog}
			component='div'
		>
			{
				eventDialog.props.type === 'holiday' ? (
					<EventHolidayBody holiday={eventDialog.data as HolidayScheduleType} />
				) : (
					<AppointmentItem appointment={eventDialog.data as Appointment}  />

				)
			}
		</Popover>
	);
};

export default EventDetailDialog;
