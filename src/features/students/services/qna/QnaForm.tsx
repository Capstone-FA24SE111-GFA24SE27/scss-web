import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowBack, ArrowLeft } from '@mui/icons-material';
import { NavLinkAdapter } from '@/shared/components';
import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';
import { usePostQuestionMutation } from './qna-api';


const formSchema = z.object({
	content: z.string().min(1, 'You must enter content'),
	questionType: z.enum(['ACADEMIC', 'NON-ACADEMIC'], {
		errorMap: () => ({ message: 'Please select a question type' }),
	}),
});

type FormValues = z.infer<typeof formSchema>;
const defaultValues = { questionType: undefined, content: '' };


/**
 * The help center support.
 */
function QnaForm() {
	const { control, handleSubmit, watch, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(formSchema)
	});
	const { isValid, dirtyFields, errors } = formState;

	const [postQuestion, { isLoading, isSuccess }] = usePostQuestionMutation()

	const form = watch();
	const navigate = useNavigate()

	function onSubmit(data: FormValues) {
		postQuestion({
			content: data.content, 
			questionType: data.questionType,
		})
			.unwrap()
			.then(() => {
				navigate('..')
			})
	}

	if (_.isEmpty(form)) {
		return null;
	}

	return (
		<div className="flex flex-col items-center p-32 container">
			<div className="flex flex-col w-full max-w-4xl">
				<div className="">
					<Button
						component={NavLinkAdapter}
						to="."
						startIcon={<ArrowBack />}
					>
						Back to QnA
					</Button>
				</div>
				<div className="mt-8 text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight">
					Ask a question
				</div>

				<Paper className="mt-32 sm:mt-48 p-24 pb-28 sm:p-40 sm:pb-28 rounded-2xl shadow">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="px-0 sm:px-24"
					>
						<div className="mb-24">
							<Typography className="text-2xl font-bold tracking-tight">Submit your question</Typography>
							<Typography color="text.secondary">
								Your request will be processed and our counselor will get back to you in 24 hours.
							</Typography>
						</div>
						<div className="space-y-32">
							<div>
								<Typography className='font-semibold text-primary text-lg'>Select question type</Typography>
								{/* <FormControl>
									<RadioGroup
										aria-labelledby="counselorType"
										name="controlled-radio-buttons-group"

										className='w-full flex'
									>
										<FormControlLabel value="academic" control={<Radio />} label="Academic" />
										<FormControlLabel value="non-academic" control={<Radio />} label="Non-academic" />
									</RadioGroup>
									
								</FormControl> */}
								<Controller
									name="questionType"
									control={control}
									render={({ field }) => (
										<RadioGroup {...field}>
											<FormControlLabel value="ACADEMIC" control={<Radio />} label="Academic" />
											<FormControlLabel value="NON-ACADEMIC" control={<Radio />} label="Non-academic" />
										</RadioGroup>
									)}
								/>
								{errors.questionType && (
									<FormHelperText error>{errors.questionType?.message as string}</FormHelperText>
								)}
							</div>

							<Controller
								name="content"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Content"
										className="mt-16 w-full"
										margin="normal"
										multiline
										minRows={6}
										variant="outlined"
										error={!!errors.content}
										helperText={errors?.content?.message}
									/>
								)}
							/>
						</div>
						<div className="flex items-center justify-end mt-32">
							<Button className="mx-8">Cancel</Button>
							<Button
								className="mx-8"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
								type="submit"
							>
								Save
							</Button>
						</div>
					</form>
				</Paper>
			</div>
		</div>
	);
}

export default QnaForm;
