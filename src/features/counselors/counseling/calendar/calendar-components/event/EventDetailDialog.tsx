import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	closeEventDetailDialog,
	selectEventDialog,
} from '../../calendar-slice';
import {
	Popover,
} from '@mui/material';
import { EventDetailBody } from './EventDetailBody';
import { AppointmentScheduleType, HolidayScheduleType } from '@/shared/types';
import { EventHolidayBody } from './EventHolidayBody';

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
					<EventDetailBody appointment={eventDialog.data as AppointmentScheduleType} onNavClicked={()=>closeDialog()}/>

				)
			}
		</Popover>
	);
};

export default EventDetailDialog;
