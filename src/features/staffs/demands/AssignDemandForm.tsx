import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import {
	useGetCounselorByIdQuery,
	usePutAssignDemandByDemandIdMutation,
} from './demand-api';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { NavLinkAdapter, UserLabel } from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ArrowBack } from '@mui/icons-material';
import { debounce } from 'lodash';
import CounselorPicker from './counselors/CounselorPicker';
import CounselorListItem from './counselors/CounselorListItem';
import { Counselor } from '@/shared/types';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@shared/store';
import { selectCounselor, setSelectedCounselor } from './counselors/counselor-list-slice';

const schema = z.object({
	counselorId: z.number().min(1, 'Counselor ID is required'),
	contactNote: z.string().min(1, 'Please enter contact note'),
	// summarizeNote: z.string().min(2, "Please enter summarize note"),
});

type FormType = Required<z.infer<typeof schema>>;

const AssignDemandForm = () => {
	const { id: demandId } = useParams();
	const navigate = useNavigate();
  const dispatch = useDispatch()
  const counselor = useAppSelector(selectCounselor)

	const [showCounselorsList, setShowCounselorsList] = useState(false);

	const defaultValues = {
		counselorId: '',
		// summarizeNote: "",
		contactNote: '',
	};

	const { control, formState, watch, handleSubmit, setValue } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	const [assignDemand] = usePutAssignDemandByDemandIdMutation();

	const onSubmit = () => {
		assignDemand({
			counselingDemandId: demandId,
			body: {
				...formData,
			},
		})
			.unwrap()
			.then(() => navigate(-1));
	};

	const toggleShowCounselorsList = () => {
		setShowCounselorsList((prev) => !prev);
	};

  const handleNavigateViewCounselor = (counselor: Counselor) => {
		if (counselor) {
			navigate(`/demand/counselor/${counselor.profile.id}`);
		}
	};

  useEffect(()=>{
    if(counselor){
      setValue('counselorId', counselor.profile.id)
    }
  },[counselor])

	return (
		<div className='flex w-full h-full p-16 '>
			{showCounselorsList ? (
				<div className='relative flex flex-col flex-1 max-w-4xl max-h-full gap-8 pt-52'>
					<Button
						className='absolute left-0 top-6 aspect-square'
						onClick={toggleShowCounselorsList}
					>
						Back
					</Button>
					<CounselorPicker
						onPickCounselor={(counselor: Counselor) => {
							setValue('counselorId', counselor.profile.id);
              dispatch(setSelectedCounselor(counselor))
							toggleShowCounselorsList();
						}}
					/>
				</div>
			) : (
				<div className='flex flex-col w-full max-w-4xl'>
					<div className='mt-32 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl'>
						Assign a Counselor to a Demand
					</div>

					<Paper className='container flex flex-col flex-auto gap-32 p-32 mt-32'>
						<div className=''>
							<Typography className='text-2xl font-bold tracking-tight'>
								Submit your demand request
							</Typography>
							<Typography color='text.secondary'>
								The demand request will be sent to the selected
								counselor
							</Typography>
						</div>
						<div className='flex flex-col w-full gap-16'>
							<div className='flex flex-col items-center gap-16'>
								<div className='flex items-center w-full gap-8'>
									{/* <Controller
										control={control}
										name='counselorId'
										render={({ field }) => (
											
										)}
									/> */}
									<Button
										variant='outlined'
										color='secondary'
                    className='px-32 whitespace-nowrap'
										onClick={toggleShowCounselorsList}
									>
										Pick counselors
									</Button>
								</div>
								<div className='w-full'>
									{counselor &&
									  formData.counselorId ? (
										<CounselorListItem counselor={counselor} onClick={handleNavigateViewCounselor}/>
									) : (
										<Typography
											color='textSecondary'
											className='text-sm'
										>
											Counselor not found
										</Typography>
									)}
								</div>
							</div>

							<div className=''>
								<Controller
									control={control}
									name='contactNote'
									render={({ field }) => (
										<TextField
											{...field}
											label='Contact Note'
											placeholder='Contact Note...'
											multiline
											rows={5}
											id='Reason'
											error={!!errors.contactNote}
											helperText={
												errors?.contactNote?.message
											}
											fullWidth
										/>
									)}
								/>
							</div>

							<div className='flex items-center justify-end mt-32'>
								<Button
									className='mx-8'
									onClick={()=>navigate(-1)}
								>
									Cancel
								</Button>
								<Button
									variant='contained'
									color='secondary'
									disabled={!counselor || !formData.counselorId || !formData.contactNote}
									onClick={handleSubmit(onSubmit)}
								>
									Confirm
								</Button>
							</div>
						</div>
					</Paper>
				</div>
			)}
		</div>
	);
};

export default AssignDemandForm;
