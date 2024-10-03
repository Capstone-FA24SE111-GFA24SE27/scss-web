import { useAppDispatch, useAppSelector } from '@shared/store';
import React from 'react';
import {
	closeEventDetailDialog,
	selectEventDialog,
} from '../../calendar-slice';
import {
	Popover,
} from '@mui/material';
import { EventDetailBody } from './EventDetailBody';

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

	const appointment = eventDialog.data[0];

	

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
			<EventDetailBody appointment={appointment} onNavClicked={()=>closeDialog()}/>
		</Popover>
	);
};

export default EventDetailDialog;
