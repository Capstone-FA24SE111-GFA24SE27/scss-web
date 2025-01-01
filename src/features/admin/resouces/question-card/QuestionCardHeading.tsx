import { FilterTabs, Heading } from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@shared/store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectAdminQuestionTab, setQuestionTab } from '../admin-resource-slice';

const QuestionCardHeading = () => {
	const navigate = useNavigate();
	const tab = useAppSelector(selectAdminQuestionTab);
	const [tabValue, setTabValue] = useState(tab);
	const dispatch = useAppDispatch()
	
	const questionTabs = [
		{ label: 'All', value: '' },
		{ label: 'Academic', value: 'ACADEMIC' },
		{ label: 'Non Academic', value: 'NON_ACADEMIC' },
	];
	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		dispatch(setQuestionTab(newValue));
	};

	return (
		<div className='flex flex-col gap-16 p-32'>
			<Heading title='Questions Table' description='Manage Questions' />
			<FilterTabs
				tabValue={tabValue}
				onChangeTab={handleChangeTab}
				tabs={questionTabs}
			/>
		</div>
	);
};

export default QuestionCardHeading;
