import { useAppDispatch, useAppSelector } from '@shared/store';
import React, { useState } from 'react';
import { selectCreateDemandCounselorFormData } from './staff-demand-create-slice';
import { CounselingType, Counselor } from '@/shared/types';
import {
	Button,
	CircularProgress,
	Divider,
	MenuItem,
	styled,
	TextField,
	Typography,
} from '@mui/material';
import { useGetCounselorExpertisesQuery } from '@/shared/services';
import { AcademicFilter } from '@/shared/components';
import { useGetQuickMatchCounselorForStaffMutation } from '../demands';

type Props = {
	onPickCounselor: (counselor: Counselor) => void;
};

const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.error.main,
	fontWeight: theme.typography.fontWeightBold,
	'&:hover': {
		backgroundColor: theme.palette.error.light, // Darker background on hover
	},
}));

const QuickMatchCounselorForm = (props: Props) => {
	const { onPickCounselor } = props;

	const createDemandFormData = useAppSelector(
		selectCreateDemandCounselorFormData
	);
	const dispatch = useAppDispatch();

	const [demandType, setDemandType] = useState<CounselingType>('ACADEMIC');
	const [selectedGender, setSelectedGender] = useState<
		'MALE' | 'FEMALE' | null
	>(null);
	const [selectedExpertise, setSelectedExpertise] = useState(null);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedMajor, setSelectedMajor] = useState(null);
	const [selectedSpecialization, setSelectedSpecialization] = useState(null);

	const { data: expertises, isLoading: isLoadingExpertise } =
		useGetCounselorExpertisesQuery();

	const [
		getQuickMatchCounselor,
		{
			isLoading: isLoadingRandomMatchedCounselor,
			isSuccess: isSuccessGettingRandomMatchedCounselor,
			isError: isErrorGettingRandomMatchedCounselor,
		},
	] = useGetQuickMatchCounselorForStaffMutation();

	const handleQuickMatch = () => {
		const matchType = demandType?.length > 0 ? demandType : undefined;
		const counselorGender =
			selectedGender?.length > 0 ? selectedGender : undefined;
		const departmentId =
			selectedDepartment?.length > 0 ? selectedDepartment : undefined;
		const majorId = selectedMajor?.length > 0 ? selectedMajor : undefined;
		const specializationId =
			selectedSpecialization?.length > 0
				? selectedSpecialization
				: undefined;
		const expertiseId =
			selectedExpertise?.length > 0 ? selectedExpertise : undefined;

		console.log(
			'asd',
			matchType,
			counselorGender,
			departmentId,
			expertiseId,
			majorId,
			specializationId
		);
		getQuickMatchCounselor({
			matchType,
			counselorGender,
			departmentId,
			expertiseId,
			majorId,
			specializationId,
		})
			.unwrap()
			.then((response) => {
				onPickCounselor(response?.content);
				console.log('res', response);
			});
	};

	const handleSelectDemandType = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setDemandType(
			(event.target as HTMLInputElement).value as CounselingType
		);
	};

	const handleSelectExpertise = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSelectedExpertise((event.target as HTMLInputElement).value);
	};

	const handleSelectGender = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedGender(
			(event.target as HTMLInputElement).value as 'MALE' | 'FEMALE'
		);
	};

	return (
		<div className='flex flex-col gap-16 p-8 w-320'>
			<div className='flex flex-col gap-8'>
				<Typography className='font-semibold'>
					Select demand type:
				</Typography>
				<TextField
					select
					label='Demand Type'
					variant='outlined'
					fullWidth
					value={demandType}
					onChange={handleSelectDemandType}
				>
					<MenuItem value={'ACADEMIC'}>Academic</MenuItem>
					<MenuItem value={'NON_ACADEMIC'}>Non Academic</MenuItem>
				</TextField>
			</div>
			<Divider />
			<div className='flex flex-col gap-8'>
				<Typography className='font-semibold'>
					Select counselor's additional information (optional):
				</Typography>
				<TextField
					select
					label='Gender'
					variant='outlined'
					fullWidth
					value={selectedGender ? selectedGender : ''}
					onChange={handleSelectGender}
				>
					<MenuItem key={'Male'} value={'MALE'}>
						{'Male'}
					</MenuItem>
					<MenuItem key={'Female'} value={'FEMALE'}>
						{'Female'}
					</MenuItem>
					<ClearMenuItem key='clear-expertise' value=''>
						Clear
					</ClearMenuItem>
				</TextField>
				{demandType === 'ACADEMIC' ? (
					<AcademicFilter
						showClearOptions
						onDepartmentChange={setSelectedDepartment}
						onMajorChange={setSelectedMajor}
						onSpecializationChange={setSelectedSpecialization}
					/>
				) : (
					<TextField
						select
						label='Expertise'
						variant='outlined'
						fullWidth
						value={selectedExpertise ? selectedExpertise : ''}
						onChange={handleSelectExpertise}
					>
						{isLoadingExpertise ? (
							<MenuItem disabled>
								<CircularProgress size={24} />
							</MenuItem>
						) : (
							expertises?.content.map((expertise) => (
								<MenuItem
									key={expertise.id}
									value={expertise.id}
								>
									{expertise.name}
								</MenuItem>
							))
						)}
						<ClearMenuItem key='clear-expertise' value=''>
							Clear
						</ClearMenuItem>
					</TextField>
				)}
			</div>
			<Button
				variant='contained'
				color='secondary'
				sx={{ color: 'white' }}
				component={Button}
				onClick={handleQuickMatch}
			>
				Find Counselor
			</Button>
		</div>
	);
};

export default QuickMatchCounselorForm;
