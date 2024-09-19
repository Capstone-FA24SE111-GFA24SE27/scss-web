import { useAppDispatch, useAppSelector } from '@shared/store';
import React from 'react';
import { closeDayDetailDialog, selectEventDialog } from '../../calendar-slice';
import { Popover } from '@mui/material';

const DateDetailDialog = () => {
	const dispatch = useAppDispatch();
	const eventDialog = useAppSelector(selectEventDialog);

	/**
	 * Close Dialog
	 */
	function closeDialog() {
		return dispatch(closeDayDetailDialog());
	}

	if (eventDialog.type !== 'day') {
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
			<div className='flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-max '>

                {eventDialog.props.open ? eventDialog.data && eventDialog.data.length > 0 ? 
                <div>
                    {eventDialog.data[0].title}
                </div>
                : 
                'There is no scheduled event or appointment in the selected time frame'
                : 'Closing...'
                }
			</div>
		</Popover>
	);
};

export default DateDetailDialog;
