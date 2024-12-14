import { closeDialog } from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material';
import { useAppDispatch } from '@shared/store';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePostFlagQuestionStatusMutation } from '../qna-api';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import ToastTemplate from '@/shared/components/notifications/ToastTemplate';
import { useNavigate } from 'react-router-dom';

type Props = {
	id: number;
};

const formSchema = z.object({
	reason: z.string().min(1, 'Reason for flag is required!'),
});

type FormValues = z.infer<typeof formSchema>;

const QnaFlagForm = (props: Props) => {
	const { id } = props;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [flagQuestion] = usePostFlagQuestionStatusMutation();

	const {
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			reason: '',
		},
	});

	const handleSubmitForm = (data: FormValues) => {
		flagQuestion({ id: id, body: data.reason }).unwrap().then((result) => {
			console.log(result)
			if (result.data.status === 200) {
				dispatch(closeDialog());
				enqueueSnackbar(result.data.message, {
					variant: 'success',
					key: result.data.message,
					autoHideDuration: 5000,
					content: (
						<ToastTemplate
							variant='success'
							message={result.data.message}
							onClose={() => {
								closeSnackbar(result.data.message);
							}}
						/>
					),
				});
			}
		}).catch((err) => console.log(err));

		

	};

	return (
		<div className='min-w-320'>
			<DialogTitle id='alert-dialog-title'>Reason for flag?</DialogTitle>
			<form onSubmit={handleSubmit(handleSubmitForm)}>
				<DialogContent>
					<Controller
						name='reason'
						control={control}
						render={({ field }) => (
							<TextField
								autoComplete='off'
								autoFocus
								required
								margin='dense'
								id='reason'
								name='reason'
								label='Flag reason'
								type='text'
								fullWidth
								variant='standard'
								onChange={field.onChange}
								value={watch('reason')}
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
						disabled={watch('reason').length <= 0}
					>
						Submit
					</Button>
				</DialogActions>
			</form>
		</div>
	);
};

export default QnaFlagForm;
