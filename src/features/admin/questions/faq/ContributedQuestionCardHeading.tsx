import {
	FilterTabs,
	Heading,
	SearchField,
	SelectField,
} from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@shared/store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetContributedQuestionCardCategoryQuery } from './question-card-api';
import {
	selectAdminQuestionCardSearchCategory,
	selectContributedQuestionFilter,
	selectContributedQuestionTab,
	setContributedQuestionFilter,
	setContributedQuestionTab,
	setQuestionCategorySearch,
} from '../admin-question-slice';

const QuestionCardHeading = () => {
	const navigate = useNavigate();
	const tab = useAppSelector(selectContributedQuestionTab);
	const filter = useAppSelector(selectContributedQuestionFilter);
	const searchCategory = useAppSelector(selectAdminQuestionCardSearchCategory)

	const { category, search, status } = filter;

	const [selectedCategory, setSelectedCategory] = useState<string>(category);
	const [tabValue, setTabValue] = useState(tab);
	const dispatch = useAppDispatch();

	const { data: categoriesData, isLoading: loadingCategories } =
		useGetContributedQuestionCardCategoryQuery();
	const categories = categoriesData?.content || [];

	const categoryOptions = categories?.map((category) => ({
		label: category.name,
		value: category.id,
	}));

	const questionTabs = [
		{ label: 'Question', value: 'QUESTION' },
		{ label: 'Category', value: 'CATEGORY' },
	];
	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		dispatch(setContributedQuestionTab(newValue));
	};
	const handleSelectCategory = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSelectedCategory(event.target.value);
		dispatch(
			setContributedQuestionFilter({
				...filter,
				category: event.target.value,
			})
		);
	};

	const handleSelectStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(
			setContributedQuestionFilter({
				...filter,
				status: event.target.value,
			})
		);
	};

	const handleSearch = (searchTerm: string) => {
		dispatch(
			setContributedQuestionFilter({ ...filter, search: searchTerm })
		);
	};

	const handleSearchCategory = (searchTerm: string) => {
		dispatch(setQuestionCategorySearch(searchTerm));
	};

	const navigateCreateForm = () => {
		navigate('create');
	};

	return (
		<div className='flex flex-col gap-16 p-32'>
			<Heading
				title='Frequently Asked Question Table '
				description='Manage Frequently Asked Questions'
			/>
			<div className='flex items-center justify-between'>
				<FilterTabs
					tabValue={tabValue}
					onChangeTab={handleChangeTab}
					tabs={questionTabs}
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
						Add Frequently Asked Question Category
					</Typography>
				</Button>
			</div>
			{tabValue === 0 && (
				<div className='flex items-center gap-16'>
					<SearchField
						label='Search question'
						placeholder='Enter keyword...'
						onSearch={handleSearch}
						className='w-full'
						value={search}
					/>
					<SelectField
						label='Category'
						options={categoryOptions}
						value={selectedCategory}
						onChange={handleSelectCategory}
						className='pr-8 outline-none w-400'
						showClearOptions
					/>
					<SelectField
						label='Visibility Status'
						options={[
							{
								label: 'Hidden',
								value: 'HIDE',
							},
							{
								label: 'Visible',
								value: 'VISIBLE',
							},
						]}
						value={status || ''}
						onChange={handleSelectStatus}
						className='pr-8 outline-none w-400'
						showClearOptions
					/>
				</div>
			)}
			{tabValue === 1 && (
				<SearchField
					label='Search category'
					placeholder='Enter keyword...'
					onSearch={handleSearchCategory}
					className='w-full'
					value={searchCategory}
				/>
			)}
		</div>
	);
};

export default QuestionCardHeading;
