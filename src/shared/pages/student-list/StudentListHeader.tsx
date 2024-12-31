import {
	CheckboxField,
	FilterTabs,
	SearchField,
	SelectField,
} from '@/shared/components';
import { Psychology, Sell, Style } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useEffect, useState } from 'react';
import StudentListFilterButton from './StudentListFilterButton';
import {
	selectFilter,
	setBehaviorList,
	setIsUsingPrompt,
	setPromptForBehavior,
	setSemesterIdForBehavior,
	setTab,
} from './student-list-slice';
import { useGetSemestersQuery } from '@/shared/services';
import clsx from 'clsx';
import { useGetProblemTagsQuery } from '@/features/admin/resouces/problem-tag/problem-tag-api';
import { Autocomplete, Chip, InputAdornment, TextField } from '@mui/material';
import { ProblemTag } from '@/shared/types/admin';


const StudentListHeader = ({ isShowingTab = false}) => {
	const filter = useAppSelector(selectFilter);
	const [tabValue, setTabValue] = useState(0);

	const dispatch = useAppDispatch();
	const { data: problemTagsData } = useGetProblemTagsQuery({
		size: 9999
	})
	const problemTags = problemTagsData?.content.data || []
	console.log(problemTags)
	// const handleIsIncludeBehavior = (
	// 	event: React.ChangeEvent<HTMLInputElement>
	// ) => {
	// 	if (filter.tab !== 'RECOMMENDED') {
	// 		dispatch(setIsUsingPrompt(!filter.isUsingPrompt));
	// 		dispatch(setPromptForBehavior(''));
	// 	}
	// };

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

	const handleSwitchChange = (checked: boolean) => {
		dispatch(setIsUsingPrompt(checked));
		dispatch(setBehaviorList(``))
	};

	const handleTagsSelect = (value: string[]) => {
		dispatch(setBehaviorList(value.join(`,`)))
	}
	return (
		<div className='flex items-center flex-1'>
			<div className='flex flex-col w-full gap-16 pb-8 pt-16'>
				<div className='flex items-start gap-32'>
					{
						filter.isUsingPrompt
							? <SearchField
								onSearch={handlePromptForBehavior}
								label='Behavior tags'
								className='w-full'
								startIcon={<Psychology />}
								placeholder='Student behavior'
								disabled={
									filter.tab !== 'RECOMMENDED' &&
									!filter.isUsingPrompt
								}
							/> :
							<TagsSelect
								data={problemTags}
								selectedValues={filter.behaviorList ? filter.behaviorList.split(',') : []}
								onChange={handleTagsSelect}
							/>
					}
					<SelectField
						label='Semester'
						options={semesterOptions}
						value={filter.semesterIdForBehavior?.toString()}
						onChange={handleSelectSemester}
						showClearOptions
						className='w-256'
					/>
					{/* <CheckboxField
						label='Use Prompt'
						checked={filter.isUsingPrompt}
						onChange={handleIsIncludeBehavior}
					/> */}

					<ToggleSwitch
						checked={filter.isUsingPrompt}
						onChange={handleSwitchChange}
					/>

					{
						!filter.open && <div className='pl-16'>
							<StudentListFilterButton />
						</div>
					}

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

interface ToggleSwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
	return (
		<div className="flex flex-col gap-4 mt-4">
			<div
				className={clsx(
					'relative w-72 h-28 flex items-center rounded-full cursor-pointer bg-primary-main',
					checked ? 'bg-primary-main' : 'bg-primary-light',
				)}
				onClick={() => onChange(!checked)}
			>
				<div
					className={clsx(
						'absolute rounded-full bg-white shadow transform transition-transform',
						checked ? 'translate-x-48' : 'translate-x-4',
					)}
				>
					{checked ? (
						<Psychology className=" text-primary-main" fontSize='small' />
					) : (
						<Sell className="pt-3  text-primary-main" fontSize='small' />
					)}
				</div>
			</div>
			<span
				className={clsx(
					'transition-all	w-96', // Added text size for consistency
					checked ? 'text-primary-light' : 'text-primary-light'
				)}
			>
				{checked ? 'Using Prompt' : 'Using Tags'}
			</span>
		</div>
	);
};


interface Props {
	data: ProblemTag[];
	selectedValues: string[];
	onChange: (selected: string[]) => void;
}

const TagsSelect: React.FC<Props> = ({ data, selectedValues, onChange }) => {
	const flatOptions = data.map((item) => item.name);
	console.log(flatOptions)
	return (
		<Autocomplete
			className="w-full"
			multiple
			options={flatOptions}
			value={selectedValues}
			onChange={(event, value) => onChange(value)}
			groupBy={(option) => {
				const item = data.find((d) => d.name === option);
				return item?.category.name || 'Other';
			}}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Chip
						key={index}
						label={option}
						{...getTagProps({ index })}
					/>
				))
			}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Select Tags"
					variant="outlined"
					placeholder="Search or select tags"
					InputProps={{
						...params.InputProps, // Preserve the existing InputProps from Autocomplete
						startAdornment: (
							<>
								<InputAdornment position="start">
									<Sell />
								</InputAdornment>
								{params.InputProps.startAdornment} {/* Keep existing adornments */}
							</>
						),
					}}
				/>
			)}


		/>
	);
};
