import { useAppDispatch, useAppSelector } from '@shared/store';
import React from 'react';
import { closeDayDetailDialog, closeEventDetailDialog, selectEventDialog } from '../../calendar-slice';
import { Popover } from '@mui/material';


const EventDetailDialog = () => {
    const dispatch = useAppDispatch();
	const eventDialog = useAppSelector(selectEventDialog);


    /**
	 * Close Dialog
	 */
    function closeDialog() {
		return dispatch(closeEventDetailDialog())
	}

    if(eventDialog.type !== 'event'){
        return null
    }

    if(eventDialog.data === null){
        return null
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
			<div className='flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-480 '>
                {eventDialog.data![0].start}
                {eventDialog.data![0].title}

            </div>
		</Popover>
	);
};

export default EventDetailDialog;
