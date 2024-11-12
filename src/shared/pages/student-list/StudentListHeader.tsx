import {
	CheckboxField,
	FilterTabs,
	SearchField,
	SelectField,
} from '@/shared/components';
import { Psychology } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useEffect, useState } from 'react';
import StudentListFilterButton from './StudentListFilterButton';
import {
	selectFilter,
	setIsIncludeBehavior,
	setPromptForBehavior,
	setSemesterIdForBehavior,
	setTab,
} from './student-list-slice';
import { useGetSemestersQuery } from '@/shared/services';

const StudentListHeader = ({ isShowingTab = false }) => {
	const filter = useAppSelector(selectFilter);
	const [tabValue, setTabValue] = useState(0);
	const dispatch = useAppDispatch();

	const handleIsIncludeBehavior = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (filter.tab !== 'RECOMMENDED') {
			dispatch(setIsIncludeBehavior(!filter.isIncludeBehavior));
			dispatch(setPromptForBehavior(''));
		}
	};

	const handlePromptForBehavior = (searchTerm) => {
		dispatch(setPromptForBehavior(searchTerm));
	};
	// const semesterOptions = [
	// 	{ label: '1', value: '1' },
	// 	{ label: '2', value: '2' },
	// 	{ label: '3', value: '3' },
	// 	{ label: '4', value: '4' },
	// 	{ label: '5', value: '5' },
	// 	{ label: '6', value: '6' },
	// 	{ label: '7', value: '7' },
	// 	{ label: '8', value: '8' },
	// 	{ label: '9', value: '9' },
	// ];

	const { data: semesterData, isLoading: isLoadingSemesterData } = useGetSemestersQuery();

	const semesterOptions = semesterData?.map((semester) => ({
		label: semester.name, value: semester.id
	}))

	const statusTabs = [
		{ label: 'All', value: '' },
		{ label: 'Recommended', value: 'RECOMMENDED' },
	];

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		dispatch(setTab(statusTabs[newValue]?.value as '' | 'RECOMMENDED'));
	};

	const handleSelectSemester = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.value) {
			dispatch(setSemesterIdForBehavior(Number(event.target.value)));
		} else {
			dispatch(setSemesterIdForBehavior(''));
		}
		// dispatch(setPromptForBehavior(''));
	};

	return (
		<div className='flex items-center flex-1 bg-background'>
			<div className='flex flex-col w-full gap-16 p-24'>
				<div className='flex gap-32'>
					<SearchField
						onSearch={handlePromptForBehavior}
						label='Behavior tags'
						className='Student behavior'
						startIcon={<Psychology />}
						placeholder='Student behavior'
						disabled={
							filter.tab !== 'RECOMMENDED' &&
							!filter.isIncludeBehavior
						}
					/>
					<SelectField
						label='Semester'
						options={semesterOptions}
						value={filter.semesterIdForBehavior?.toString()}
						onChange={handleSelectSemester}
						showClearOptions
						className='w-256'
						disabled={
							filter.tab !== 'RECOMMENDED' &&
							!filter.isIncludeBehavior
						}
					/>
					{filter.tab !== 'RECOMMENDED' && (
						<CheckboxField
							label='Including Behavior'
							checked={filter.isIncludeBehavior}
							onChange={handleIsIncludeBehavior}
						/>
					)}
					<div className='pl-16'>
						{!filter.open && <StudentListFilterButton />}
					</div>
				</div>
				{isShowingTab && (
					<FilterTabs
						tabs={statusTabs}
						tabValue={tabValue}
						onChangeTab={handleChangeTab}
					/>
				)}
			</div>
		</div>
	);
};

export default StudentListHeader;
