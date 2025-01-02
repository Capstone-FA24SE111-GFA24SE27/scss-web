import {
	FilterTabs,
	Heading,
	PageSimple,
	SearchField,
	SelectField,
} from '@/shared/components';
import {
	Autocomplete,
	Box,
	IconButton,
	Tab,
	Tabs,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ProblemTagTable from './ProblemTagTable';
import CategoryTable from './CategoryTable';
import CreateProblemTagButton from './CreateProblemTagButton';
import CreateCategoryButton from './CreateCategoryButton';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	selectAdminQuestionCardCategoryFilter,
	selectAdminQuestionCardSearch,
	selectAdminQuestionCardSearchCategory,
	setQuestionCategorySearch,
	setQuestionSearch,
	setSelectedQuestionCategory,
} from '../admin-resource-slice';
import { size } from 'lodash';
import { useGetProblemTagsCategoriesQuery } from './problem-tag-api';
import { ProblemTagCategory } from '@/shared/types/admin';

type Props = {};

const ProblemTag = (props: Props) => {
	const pageLayout = useRef(null);
	const [tabValue, setTabValue] = useState(0);
	const routeParams = useParams();
	const isMobile = false;
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const problemTagTabs = [
		{ label: 'Tag', value: 'TAG' },
		{ label: 'Category', value: 'CATEGORY' },
	];
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const catSearch = useAppSelector(selectAdminQuestionCardSearchCategory);
	const catSelected = useAppSelector(selectAdminQuestionCardCategoryFilter);
	const questionSearch = useAppSelector(selectAdminQuestionCardSearch);

	const { data: categoryData, isLoading } = useGetProblemTagsCategoriesQuery({
		page: 1,
		size: 99,
	});

	useEffect(() => {
		if (routeParams.id || location.pathname.split('/').pop() === 'create') {
			setRightSidebarOpen(true);
		} else {
			setRightSidebarOpen(false);
		}
	}, [routeParams]);

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleSearch = (searchTerm: string) => {
		dispatch(setQuestionSearch(searchTerm));
	};

	const handleSearchCat = (searchTerm: string) => {
		dispatch(setQuestionCategorySearch(searchTerm));
	};

	const handleCategorySelect = (cat: ProblemTagCategory) => {
		dispatch(setSelectedQuestionCategory(cat));
	};

	return (
		<PageSimple
			ref={pageLayout}
			header={
				<>
					<div className='flex flex-col gap-16 p-32'>
						<Heading
							title='Problem Tags Management'
							description='Manage problem tags'
						/>
						<div className='flex justify-between '>
							<FilterTabs
								tabValue={tabValue}
								onChangeTab={handleChangeTab}
								tabs={problemTagTabs}
							/>
							<div>
								{tabValue === 0 ? (
									<CreateProblemTagButton />
								) : (
									<CreateCategoryButton />
								)}
							</div>
						</div>
						{tabValue === 0 && (
							<div className='flex items-center gap-8 flex-wrap'>
								<SearchField
									label='Search question'
									placeholder='Enter keyword...'
									onSearch={handleSearch}
									className='flex-1 min-w-256'
									value={questionSearch}
								/>
								<Autocomplete
									className='flex-1 min-w-256'
									options={categoryData}
									autoHighlight
									onChange={(
										event: any,
										newValue: ProblemTagCategory
									) => {
										handleCategorySelect(newValue);
									}}
									value={catSelected}
									inputValue={catSearch}
									onInputChange={(event, newInputValue) => {
										handleSearchCat(newInputValue);
									}}
									getOptionLabel={(option) => option.name}
									renderOption={(props, option) => {
										const { key, ...optionProps } = props;
										return (
											<Typography
												key={key}
												component={'li'}
												className=''
												{...optionProps}
											>
												{option.name}
											</Typography>
										);
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label='Choose a category'
											slotProps={{
												htmlInput: {
													...params.inputProps,
													autoComplete:
														'new-password', // disable autocomplete and autofill
												},
											}}
										/>
									)}
								/>
							</div>
						)}
						{tabValue === 1 && (
							<SearchField
								label='Search category'
								placeholder='Enter keyword...'
								onSearch={handleSearchCat}
								className='w-full'
								value={catSearch}
							/>
						)}
					</div>
				</>
			}
			content={tabValue === 0 ? <ProblemTagTable /> : <CategoryTable />}
			rightSidebarContent={
				<div className='flex flex-col flex-auto max-w-full w-fit'>
					<IconButton
						className='absolute top-0 right-0 z-10 mx-32 my-16'
						onClick={() => navigate('.')}
						size='large'
					>
						<Close />
					</IconButton>
					<Outlet />
				</div>
			}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => {
				setRightSidebarOpen(false);
				navigate('.');
			}}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
};

export default ProblemTag;
