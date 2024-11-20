import { closeDialog } from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useUpdateFollowNoteMutation } from './staff-followed-student-api';
import ToastTemplate from '@/shared/components/notifications/ToastTemplate';
import { closeSnackbar, enqueueSnackbar } from 'notistack';

type Props = {
    followNote?: string;
    studentId?: number | string
}


const formSchema = z.object({
	followNote: z.string().min(2, 'Please enter follow note'),
});

type FormValues = z.infer<typeof formSchema>;


const UpdateFollowNoteForm = (props: Props) => {
    const { followNote , studentId: id} = props;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const {
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			followNote: followNote ? followNote : '',
		},
	});

    const [updateFollowNote] = useUpdateFollowNoteMutation()

	const handleSubmitForm = async (data: FormValues) => {
		const result = await updateFollowNote({id, followNote: data.followNote})

        console.log('update res', result)

		if (result.error.originalStatus === 200) {
			dispatch(closeDialog());
			enqueueSnackbar(result.error.data, {
				variant: 'success',
				key: result.error.data,
				autoHideDuration: 50000,
				content: (
					<ToastTemplate
						variant='success'
						message={result.error.data}
						onClose={() => {
							closeSnackbar(result.error.data);
						}}
					/>
				),
			});
		}
	};

	return (
		<div className='min-w-320'>
			<DialogTitle id='alert-dialog-title'>Update follow note</DialogTitle>
			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<DialogContent>
					<Controller
						name='followNote'
						control={control}
						render={({ field }) => (
							<TextField
								autoComplete='off'
								autoFocus
								required
								margin='dense'
								id='Follow note'
								name='Follow note'
								label='Follow note'
								type='text'
								fullWidth
								variant='standard'
								onChange={field.onChange}
								value={watch('followNote')}
							/>
						)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => dispatch(closeDialog())}
						color='primary'
					>
						Cancel
					</Button>
					<Button
						color='secondary'
						variant='contained'
						type='submit'
						disabled={watch('followNote').length <= 2}
					>
						Update
					</Button>
				</DialogActions>
			</form>
		</div>
	);
}

export default UpdateFollowNoteForm