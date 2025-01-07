import {
	Box,
	Divider,
	Typography,
	ToggleButton,
	ToggleButtonGroup,
	Slider,
	IconButton,
	TextField,
	Button,
} from '@mui/material';
import { useState } from 'react';
import CounselorListFilterButton from './StudentListFilterButton';
import { AcademicFilter, SearchField, SelectField } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	selectFilter,
	setDepartmentId,
	setMajorId,
	setMaxGPA,
	setMinGPA,
	setSearchTerm,
	setSemesterIdForGPA,
	setSpecializationId,
	setTypeOfAttendanceFilter,
	setFromForAttendanceCount,
	setToForAttendanceCount,
	setFromForAttendancePercentage,
	setToForAttendancePercentage,
	setSemesterIdForAttendance,
	setMinSubjectForAttendance,
	resetFilter,
} from './student-list-slice';
import { FilterAltOff, FilterNone, Numbers } from '@mui/icons-material';
import { useGetSemestersQuery } from '@/shared/services';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PercentIcon from '@mui/icons-material/Percent';

const CounselorListSidebarContent = ({
	shouldShowToggleButton = true,
}: {
	shouldShowToggleButton?: boolean;
}) => {
	const filter = useAppSelector(selectFilter);
	const dispatch = useAppDispatch();
	const [attendanceType, setAttendanceType] = useState<
		'COUNT' | 'PERCENTAGE'
	>('COUNT');

	const handleDepartmentChange = (departmentId: string) => {
		dispatch(setDepartmentId(Number(departmentId) || undefined));
		if (!departmentId) {
			dispatch(setMajorId(undefined));
			dispatch(setSpecializationId(undefined));
		}
	};

	const handleMajorChange = (majorId: string) => {
		dispatch(setMajorId(Number(majorId)));
		if (!majorId) {
			dispatch(setSpecializationId(undefined));
		}
	};

	const handleSpecializationChange = (specializationId: string) => {
		dispatch(setSpecializationId(Number(specializationId)));
	};

	const handleSearch = (searchTerm: string) => {
		dispatch(setSearchTerm(searchTerm));
	};

	const handleSelectSemester = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.value === '') {
			dispatch(setSemesterIdForGPA(undefined));
		} else {
			dispatch(setSemesterIdForGPA(Number(event.target.value)));
		}
	};

	const handleAttendanceTypeChange = (
		_: any,
		newType: 'COUNT' | 'PERCENTAGE'
	) => {
		if (newType) {
			setAttendanceType(newType);
			dispatch(setTypeOfAttendanceFilter(newType));
		}
	};

	const handleAttendancePercentageChange = (
		field: 'fromForAttendancePercentage' | 'toForAttendancePercentage',
		value: number | number[]
	) => {
		if (field === 'fromForAttendancePercentage') {
			dispatch(setFromForAttendancePercentage(value as number));
		} else {
			dispatch(setToForAttendancePercentage(value as number));
		}
	};

	const handleSemesterAttendanceChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		dispatch(setSemesterIdForAttendance(Number(event.target.value)));
	};

	const handleMinSubjectForAttendanceChange = (value: string) => {
		if (Number(value) < 0 || Number(value) > 30) {
			return;
		}
		dispatch(setMinSubjectForAttendance(Number(value)));
	};

	const { data: semesterData, isLoading: isLoadingSemesterData } =
		useGetSemestersQuery();
	const semesterOptions = semesterData?.map((semester) => ({
		label: semester.name,
		value: semester.id,
	}));

	return (
		<div className='flex flex-col gap-8'>
			{shouldShowToggleButton && (
				<div className='flex items-center justify-between gap-8'>
					<CounselorListFilterButton />
					<Button
						startIcon={<FilterAltOff />}
						onClick={() => {
							dispatch(resetFilter());
						}}
					>
						Clear Filter
					</Button>
				</div>
			)}
			<div className='flex flex-col w-full gap-16'>
				<Typography className='font-semibold'>
					Search by name
				</Typography>
				<SearchField
					onSearch={handleSearch}
					label='Name'
					placeholder='John Doe'
					size='small'
				/>
				<Divider />
				<Typography className='font-semibold'>
					Filter by academic details
				</Typography>
				<AcademicFilter
					size='small'
					onDepartmentChange={handleDepartmentChange}
					onMajorChange={handleMajorChange}
					onSpecializationChange={handleSpecializationChange}
					showClearOptions={true}
				/>
				<Divider />
				<Typography className='font-semibold'>
					Filter by average grade
				</Typography>
				<Box className='flex gap-16'>
					<TextField
						label='Min'
						placeholder='0'
						type='number'
						size='small'
						disabled={!filter.semesterIdForGPA}
						value={filter.minGPA}
						onChange={(e) => {
							const fromValue = Number(e.target.value) || 0;
							const toValue = filter.maxGPA;
							if (
								(!isNaN(toValue) && fromValue > toValue) ||
								Number(e.target.value) < 0 ||
								Number(e.target.value) > 10
							) {
								return;
							}
							dispatch(setMinGPA(fromValue));
						}}
						InputProps={{
							startAdornment: <Numbers />,
						}}
					/>
					{/* To (Count) Field */}
					<TextField
						label='Max'
						placeholder='9.9'
						type='number'
						size='small'
						disabled={!filter.semesterIdForGPA}
						value={filter.maxGPA}
						onChange={(e) => {
							const toValue = Number(e.target.value) || 0;
							const fromValue = filter.minGPA;
							if (
								(!isNaN(fromValue) && toValue < fromValue) ||
								Number(e.target.value) < 0 ||
								Number(e.target.value) > 10
							) {
								return;
							}
							dispatch(setMaxGPA(toValue));
						}}
						InputProps={{
							startAdornment: <Numbers />,
						}}
					/>
					<SelectField
						label='Semester'
						options={semesterOptions}
						value={filter.semesterIdForGPA?.toString()}
						onChange={handleSelectSemester}
						showClearOptions
						className='w-400'
						size='small'
					/>
				</Box>
				<Divider />
				<Typography className='font-semibold'>
					Filter by attendance
				</Typography>
				<Box className='flex items-center gap-16'>
					<ToggleButtonGroup
						value={attendanceType}
						exclusive
						onChange={handleAttendanceTypeChange}
						aria-label='Attendance Type'
						size='small'
					>
						<ToggleButton
							value='COUNT'
							aria-label='Count'
							className='w-144'
						>
							<FilterAltIcon /> Count
						</ToggleButton>
						<ToggleButton
							value='PERCENTAGE'
							aria-label='Percentage'
							className='w-144'
						>
							<PercentIcon /> Percentage
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>
				<div className='flex w-full gap-16'>
					<Box className='flex items-center flex-1 w-full gap-16'>
						<TextField
							fullWidth
							type='number'
							label='Min Subjects for Attendance'
							placeholder='0 - 30'
							size='small'
							value={filter.minSubjectForAttendance}
							onChange={(e) =>
								handleMinSubjectForAttendanceChange(
									e.target.value
								)
							}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
					</Box>
					<Box className='flex items-center flex-1 w-full gap-16'>
						<SelectField
							label='Semester'
							options={semesterOptions}
							value={filter.semesterIdForAttendance?.toString()}
							onChange={handleSemesterAttendanceChange}
							showClearOptions
							className='min-w-full'
							size='small'
						/>
					</Box>
				</div>

				{attendanceType === 'COUNT' && (
					<Box className='flex gap-16'>
						{/* From (Count) Field */}
						<TextField
							label='From (Count)'
							placeholder='0'
							type='number'
							size='small'
							value={filter.fromForAttendanceCount}
							onChange={(e) => {
								const fromValue = Number(e.target.value) || 0;
								const toValue =
									filter.toForAttendanceCount || 1;
								// Ensure `fromForAttendanceCount` is less than or equal to `toForAttendanceCount`
								if (fromValue >= toValue) {
									dispatch(
										setToForAttendanceCount(fromValue + 1)
									);
								}
								if (
									Number(e.target.value) < 0 ||
									Number(e.target.value) > 10
								) {
									return;
								}
								dispatch(setFromForAttendanceCount(fromValue));
							}}
							InputProps={{
								startAdornment: <Numbers />,
							}}
							disabled={!filter.semesterIdForAttendance}
						/>
						{/* To (Count) Field */}
						<TextField
							label='To (Count)'
							placeholder='100'
							type='number'
							size='small'
							value={filter.toForAttendanceCount || 0}
							onChange={(e) => {
								const toValue = Number(e.target.value) || 1;
								const fromValue =
									filter.fromForAttendanceCount || 0;
								// Ensure `toForAttendanceCount` is greater than or equal to `fromForAttendanceCount`
								if (toValue <= fromValue) {
									dispatch(
										setFromForAttendanceCount(toValue - 1)
									);
								}
								if (
									Number(e.target.value) < 0 ||
									Number(e.target.value) > 10
								) {
									return;
								}
								dispatch(setToForAttendanceCount(toValue));
							}}
							InputProps={{
								startAdornment: <Numbers />,
							}}
							disabled={!filter.semesterIdForAttendance}
						/>
					</Box>
				)}
				{attendanceType === 'PERCENTAGE' && (
					<Box className='flex flex-col gap-16'>
						{/* Slider for "From Percentage" */}
						<Box className='flex items-center gap-8'>
							<Typography variant='subtitle2' className='w-96'>
								From (%)
							</Typography>
							<Slider
								valueLabelDisplay='on'
								min={0}
								max={100}
								value={filter.fromForAttendancePercentage || 0}
								onChangeCommitted={(_, value) => {
									const newValue = Math.min(
										value as number,
										filter.toForAttendancePercentage ||
											100 - 1
									);
									handleAttendancePercentageChange(
										'fromForAttendancePercentage',
										newValue
									);
								}}
								aria-labelledby='From Percentage'
								disabled={!filter.semesterIdForAttendance}
							/>
						</Box>

						<Box className='flex items-center gap-8'>
							<Typography variant='subtitle2' className='w-96'>
								To (%)
							</Typography>
							<Slider
								valueLabelDisplay='on'
								min={0}
								max={100}
								value={filter.toForAttendancePercentage || 100}
								onChangeCommitted={(_, value) => {
									const newValue = Math.max(
										value as number,
										filter.fromForAttendancePercentage ||
											0 + 1
									);
									handleAttendancePercentageChange(
										'toForAttendancePercentage',
										newValue
									);
								}}
								aria-labelledby='To Percentage'
								disabled={!filter.semesterIdForAttendance}
							/>
						</Box>
					</Box>
				)}
			</div>
			<div></div>
		</div>
	);
};

export default CounselorListSidebarContent;
