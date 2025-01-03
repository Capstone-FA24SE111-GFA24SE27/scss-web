import { Heading, SearchField } from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@shared/store';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { selectTimeSlotSearch, setTimeSlotSearch } from '../admin-resource-slice';

const TimeSlotHeading = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const keyword = useAppSelector(selectTimeSlotSearch);

	const navigateCreateForm = () => {
		navigate('create');
	};

	const handleSearch = (searchTerm: string) => {
		dispatch(setTimeSlotSearch(searchTerm));
	};

	return (
		<div className='flex flex-col gap-16 p-32'>
			<div className='flex items-center justify-between'>
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
					<Typography className='font-semibold'>
						Add Time Slot
					</Typography>
				</Button>
			</div>
			<SearchField
				label='Search question'
				placeholder='Enter keyword...'
				onSearch={handleSearch}
				className='flex-1 min-w-256'
				value={keyword}
			/>
		</div>
	);
};

export default TimeSlotHeading;
