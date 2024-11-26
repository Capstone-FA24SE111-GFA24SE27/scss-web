import { Heading } from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const TimeSlotHeading = () => {

    const navigate = useNavigate()

    const navigateCreateForm = () => {
        navigate('create')
    }

	return (
		<div className='flex items-center justify-between p-32'>
			<Heading
				title='Counseling Time Slots'
				description='Manage time slots'
			/>
			<Button
				color='primary'
				sx={{ color: 'white' }}
				variant='contained'
				onClick={navigateCreateForm}
				className='flex items-center gap-8 px-16 '
			>
				<Add />
				<Typography className='font-semibold'>Add Time Slot</Typography>
			</Button>
		</div>
	);
};

export default TimeSlotHeading;
