import { Heading } from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const QuestionCardHeading = () => {

    const navigate = useNavigate()

    const navigateCreateForm = () => {
        navigate('create')
    }

	return (
		<div className='flex items-center justify-between p-32'>
			<Heading
				title='Question Category'
				description='Manage Question Category'
			/>
			<Button
				color='primary'
				sx={{ color: 'white' }}
				variant='contained'
				onClick={navigateCreateForm}
				className='flex items-center gap-8 px-16 '
			>
				<Add />
				<Typography className='font-semibold'>Add Question Card Category</Typography>
			</Button>
		</div>
	);
};

export default QuestionCardHeading;
