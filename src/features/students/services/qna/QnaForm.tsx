import Button from '@mui/material/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowBack, ArrowLeft, HelpOutlineOutlined, Warning } from '@mui/icons-material';
import { NavLinkAdapter } from '@/shared/components';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, FormControl, FormControlLabel, FormHelperText, MenuItem, Radio, RadioGroup } from '@mui/material';
import { useState, useEffect } from 'react';
import { useEditQuestionMutation, useGetBanInfoQuery, useGetStudentQuestionQuery, usePostQuestionMutation } from './qna-api';
import { formatDateTime } from '@/shared/utils';
import dayjs from 'dayjs';
import { statusColor } from '@/shared/constants';
import { useGetAcademicTopicsQuery, useGetNonAcademicTopicsQuery } from '@/shared/services';


const formSchema = z.object({
	content: z.string().min(1, 'You must enter content'),
	questionType: z.enum(['ACADEMIC', 'NON_ACADEMIC'], {
		errorMap: () => ({ message: 'Please select a question type' }),
	}),
	topicId: z.string().min(1, 'You must select a topic'),

});

type FormValues = {
	questionType: "ACADEMIC" | "NON_ACADEMIC"; // Specify the correct types
	content: string;
	topicId: string;
};


/**
 * The help center support.
 */
function QnaForm() {
	const { questionId } = useParams()
	const editMode = Boolean(questionId)

	const defaultValues = { questionType: 'ACADEMIC', content: '', topicId: '' };

	const { data: questionData } = useGetStudentQuestionQuery(questionId || `0`,
		{
			skip: !editMode,
		}
	)
	const question = questionData?.content

	const { control, handleSubmit, watch, formState, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(formSchema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const [postQuestion, { isLoading, isSuccess }] = usePostQuestionMutation()
	const [editQuestion, { isLoading: isEditting, isSuccess: isEdittingSuccess }] = useEditQuestionMutation()
	const { data: banInfoData } = useGetBanInfoQuery()
	const banInfo = banInfoData


	const form = watch();
	const navigate = useNavigate()


	const { data: academicTopicsData } = useGetAcademicTopicsQuery();
	const { data: nonacademicTopicsData } = useGetNonAcademicTopicsQuery();
	const academicTopics = academicTopicsData?.content;
	const nonAcademicTopics = nonacademicTopicsData?.content;

	const academicTopicOptions = academicTopics?.map((topic) => ({
		label: topic.name,
		value: topic.id,
	}));

	const nonAcademicTopicOptions = nonAcademicTopics?.map((topic) => ({
		label: topic.name,
		value: topic.id,
	}));

	const selectedType = watch('questionType');
	const topicOptions = selectedType === 'ACADEMIC' ? academicTopicOptions : nonAcademicTopicOptions || [];


	function onSubmit(data: FormValues) {
		if (editMode) {
			editQuestion({
				questionCardId: Number(questionId),
				question: {
					content: data.content,
					questionType: data.questionType,
					topicId: data.topicId,
				}
			})
				.unwrap()
				.then(() => {
					navigate('.')
				})
			return;
		}
		postQuestion({
			content: data.content,
			questionType: data.questionType,
			topicId: data.topicId,
		})
			.unwrap()
			.then(() => {
				navigate('.')
			})
	}

	useEffect(() => {
		if (editMode && question) {
			reset({
				questionType: question?.questionType || 'ACADEMIC',
				content: question?.content || '',
				topicId: question?.topic.id.toString(),
			});
		}
	}, [editMode, question, reset]);

	if (_.isEmpty(form)) {
		return null;
	}

	if (banInfo?.ban) {
		return (
			<div className="flex flex-col items-center p-32 container">
				<div className="flex flex-col w-full max-w-4xl gap-16">
					<div className="">
						<Button
							component={NavLinkAdapter}
							to="."
							startIcon={<ArrowBack />}
						>
							Back to QnA
						</Button>
					</div>
					<Paper className="p-16 shadow flex gap-16 bg-red-400 text-white items-center">
						<Warning />
						<Typography className='text-xl font-semibold'>Your account has been banned from posting questions</Typography>
					</Paper>
					<div className='flex gap-16'>
						<Typography className='text-lg font-semibold text-text-secondary'>Time:</Typography>
						<div className='flex gap-16'>
							<Typography className='text-lg font-semibold'>{dayjs(banInfo.banStartDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
							<Typography className='text-lg font-semibold'>-</Typography>
							<Typography className='text-lg font-semibold'>{dayjs(banInfo.banEndDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
						</div>
					</div>

					<Typography className='text-lg font-semibold text-text-secondary'>Reasons:</Typography>
					<div>
						{
							banInfo?.questionFlags.map(qna => (
								<Accordion
									className='shadow rounded-lg'
									expanded={true}
								>
									<AccordionSummary >
										<div className='flex flex-col gap-8 w-full'>
											<div className='flex gap-8'>
												<Chip label={qna.questionCard.questionType === 'ACADEMIC' ? 'Academic' : 'Non-Academic'} color={'info'} size='small' />
												<Chip label={qna.questionCard.topic?.name} variant='outlined' size='small' />
												{qna.questionCard.closed && <Chip label={'Closed'} color={'warning'} size='small' />}
											</div>
											<div className="flex flex-1 items-center gap-8">
												<HelpOutlineOutlined color='disabled' />
												<Typography className="pr-8 font-semibold w-full">{qna.questionCard.content}</Typography>
											</div>
											<div className='flex'>
												<Typography className="pr-8 text-text-secondary">Flagged date:</Typography>
												<Typography className="pr-8 font-semibold">{dayjs(qna.flagDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
											</div>
											<div className='flex'>
												<Typography className="pr-8 text-text-secondary">Flagged Reason:</Typography>
												<Typography className="pr-8 font-semibold">{qna.reason}</Typography>
											</div>

										</div>

									</AccordionSummary>

									<AccordionDetails className='flex'>

									</AccordionDetails>
									<Box
										className='bg-primary-light/5 w-full py-8 flex justify-between px-16 '
									>

									</Box>
								</Accordion>
							))
						}
					</div>
				</div>
			</div>
		);
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
					{editMode ? 'Edit your question' : 'Ask a question'}
				</div>

				<Paper className="mt-32 sm:mt-48 p-24 pb-28 sm:p-40 sm:pb-28 rounded-2xl shadow">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="px-0 sm:px-24"
					>
						<div className="mb-24">
							<Typography className="text-2xl font-bold tracking-tight">Submit your question</Typography>
							<Typography color="text.secondary">
								Your request will be processed and our support staff will verify for you.
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
											<FormControlLabel value="NON_ACADEMIC" control={<Radio />} label="Non-academic" />
										</RadioGroup>
									)}
								/>
								{errors.questionType && (
									<FormHelperText error>{errors.questionType?.message as string}</FormHelperText>
								)}
							</div>


							<Controller
								name="topicId"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										select
										label="Counseling Topic"
										className="mt-16 w-full"
										margin="normal"
										variant="outlined"
										error={!!errors.topicId}
										helperText={errors?.topicId?.message}
									>
										{(topicOptions || []).map((option) => (
											<MenuItem key={option.value} value={option.value.toString()}>
												{option.label}
											</MenuItem>
										))}
									</TextField>
								)}
							/>

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
							<Button className="mx-8" component={NavLinkAdapter} to="." >Cancel</Button>
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
