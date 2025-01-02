import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
	Button,
	Paper,
	Typography,
	TextField,
	MenuItem,
	RadioGroup,
	FormControlLabel,
	Radio,
	CircularProgress,
	LinearProgress,
	Box,
	Divider,
	Autocomplete,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import {
	uploadFile,
	useGetDepartmentsQuery,
	useGetMajorsByDepartmentQuery,
	useGetSpecializationsByMajorQuery,
} from '@shared/services';
import { useGetCounselorExpertisesQuery } from '@shared/services';
import { usePostQuestionMutation, useEditQuestionMutation, useGetStudentQuestionQuery, useGetBanInfoQuery } from './qna-api';
import _ from 'lodash';
import BanInfo from './BanInfo';
import { BackdropLoading, NavLinkAdapter, RenderHTML } from '@/shared/components';
import { ArrowBack } from '@mui/icons-material';
import { useAppDispatch } from '@shared/store';
import { useAlertDialog } from '@/shared/hooks';
import { useConfirmDialog } from '@/shared/hooks';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '@/shared/configs';
import { ref } from 'firebase/storage';
import { QuillEditor } from '@/shared/components';
import { validateHTML } from '@/shared/utils';
import { useSearchAllPublicQuestionCardsMutation } from '@/shared/pages';
import { useGetStudentDocumentQuery } from '../../students-api';
import { Department, Major } from '@/shared/types';

// Define schema with validation
const formSchema = z.object({
	title: z.string().min(1, 'You must enter title'),
	content: z.string().min(1, 'You must enter content')
		.refine(
			validateHTML,
			{ message: 'Content must not be empty', }
		),
	questionType: z.enum(['ACADEMIC', 'NON_ACADEMIC'], {
		errorMap: () => ({ message: 'Please select a question type' }),
	}),
	// departmentId: z.string().optional(),
	// majorId: z.string().optional(),
	// specializationId: z.string().optional(),
	// expertiseId: z.string().optional(),
	department: z.object({
		id: z.number(),
		name: z.string(),
	}).nullable().optional(),
	major: z.object({
		id: z.number(),
		name: z.string(),
	}).nullable().optional(),
	specialization: z.object({
		id: z.number(),
		name: z.string(),
	}).nullable().optional(),
	expertise: z.object({
		id: z.number(),
		name: z.string(),
	}).nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function QnaForm() {
	const { questionId } = useParams();
	const navigate = useNavigate();
	const editMode = Boolean(questionId);

	const { data: questionData } = useGetStudentQuestionQuery(questionId || `0`,
		{
			skip: !editMode,
		}
	)

	const { data: banInfoData } = useGetBanInfoQuery()
	const banInfo = banInfoData


	const question = questionData?.content
	const defaultValues: FormValues = { questionType: 'ACADEMIC', content: '' };

	const { control, handleSubmit, watch, formState, reset, register, setValue } = useForm<FormValues>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(formSchema),
	});

	const { errors, isValid, dirtyFields } = formState;

	const questionType = watch('questionType')

	const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartmentsQuery();
	const departments = departmentsData || [];

	const { data: majorsData, isLoading: isLoadingMajors } = useGetMajorsByDepartmentQuery(watch("department")?.id.toString(), {
		skip: !watch("department")
	});
	const majors = majorsData || [];

	const { data: counselorExpertisesData, isLoading: isLoadingCounselorExpertises } = useGetCounselorExpertisesQuery()
	const expertises = counselorExpertisesData?.content || []
	// const { data: specializations, isLoading: loadingSpecializations } = useGetSpecializationsByMajorQuery(
	// 	watch("major")?.id.toString(),
	// 	{
	// 		skip: !watch('major'),
	// 	}
	// );

	const [searchPublicQna, { isLoading: isLoadingSearch }] = useSearchAllPublicQuestionCardsMutation()


	// Mutations for posting and editing questions
	const [postQuestion, { isLoading: isPosting }] = usePostQuestionMutation();
	const [editQuestion, { isLoading: isEditing }] = useEditQuestionMutation();
	const dispatch = useAppDispatch()
	// Form submission handler
	const onSubmit = async (data: FormValues) => {
		try {
			if (editMode && questionId) {
				useConfirmDialog({
					dispatch: dispatch,
					title: 'Confirm editing question?',
					confirmButtonFunction: () => {
						editQuestion({
							questionCardId: Number(questionId),
							question: {
								title: data.title,
								content: data.content,
								questionType: data.questionType,
								departmentId: data.department?.id,
								majorId: data.major?.id,
								expertiseId: data.expertise?.id,
								// specializationId: data.specializationId,
							}
						})
							.unwrap()
							.then(() => {
								useAlertDialog({
									dispatch,
									color: 'success',
									title: 'Question was edit successfully!',
								})
								navigate(`../my-qna`);
							})
							.catch(error => useAlertDialog({
								dispatch,
								color: 'error',
								title: 'Error editing question',
							}))
					}
				})

			} else {
				useConfirmDialog({
					dispatch: dispatch,
					title: 'Confirm asking question',
					content: (
						<div>{data.title}</div>
					),
					confirmButtonFunction: () => {
						postQuestion({
							title: data.title,
							content: data.content,
							questionType: data.questionType,
							departmentId: data.department?.id,
							majorId: data.major?.id,
							expertiseId: data.expertise?.id,
						})
							.unwrap()
							.then(() => {
								useAlertDialog({
									dispatch,
									color: 'success',
									title: 'Question was created successfully!',
								})
								navigate(`../my-qna`);
							})
							.catch(error => useAlertDialog({
								dispatch,
								color: 'error',
								confirmButtonTitle: `Ok`,
								title: error?.data.message === `Expertise not found with name: none`
									? `Question does have not have enough context`
									: (error?.data.message || `Error creating question`)
							}))
					}
				})

			}
		} catch (error) {
			console.error("Failed to submit question:", error);
		}
	};
	useEffect(() => {
		if (editMode && questionData) {
			reset({
				questionType: question?.questionType || 'ACADEMIC',
				content: question?.content || '',
				title: question?.title || '',
			});
		}
	}, [editMode, questionData, reset]);



	const { data: studentDocumentData } = useGetStudentDocumentQuery();
	const studentProfile = studentDocumentData?.content.studentProfile
	useEffect(() => {
		reset({
			department: studentProfile?.department || undefined,
			major: studentProfile?.major || undefined,
		})
	}, [studentProfile]);

	if (banInfo?.ban) {
		return <BanInfo banInfo={banInfo} />
	}
	console.log(watch())
	return (
		<div className="container flex flex-col items-center px-32 my-16 w-xl">
			<div className="flex flex-col w-full ">
				<div className="">
					<Button
						component={NavLinkAdapter}
						to="../my-qna"
						startIcon={<ArrowBack />}
					>
						Back to My Q&A
					</Button>
				</div>
				<div className="mt-8 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
					{editMode ? 'Edit your question' : 'Ask a question'}
				</div>
				<Typography color='textSecondary'>Your questions will be reviwed and forwarded to our counselors.</Typography>
				<Paper className='p-16 mt-16 bg-secondary-main/10 text-secondary-main shadow-0 text-lg'>
					<Typography className='font-semibold text-lg'>Tips on asking a good question</Typography>
					<li>Ensure your question hasn't been asked before</li>
					<li>Keep your question concise and straightforward</li>
					<li>Double-check your grammar and spelling</li>
				</Paper>
				<Divider className='mt-16' />
				<div className="mt-16 ">
					<form onSubmit={handleSubmit(onSubmit)} className="px-0">
						{/* <div className="mb-24">
							<Typography variant="h6">Submit your question</Typography>
							<Typography color='textSecondary'>Your questions will be reviwed and forwarded to our counselors.</Typography>
						</div> */}
						<div className="space-y-32 px-16">
							{/* Question Type Radio Group */}
							<Controller
								name="questionType"
								control={control}
								render={({ field }) => (
									<RadioGroup {...field} row>
										<FormControlLabel value="ACADEMIC" control={<Radio />} label="Academic" />
										<FormControlLabel value="NON_ACADEMIC" control={<Radio />} label="Non-academic" />
									</RadioGroup>
								)}
							/>
							{errors.questionType && <Typography color="error">{errors.questionType.message}</Typography>}

							<Controller
								control={control}
								name="title"
								defaultValue={question?.title || ''}
								render={({ field }) => (
									<TextField
										{...field}
										className="mt-32"
										label="Title"
										placeholder="Title"
										id="Title"
										error={!!errors.title}
										helperText={errors?.title?.message}
										fullWidth

									/>
								)}
							/>
							<QuillEditor
								value={watch('content')}
								onChange={(value) => setValue('content', value, { shouldValidate: true })}
								error={errors.content?.message}
							// label='Content'
							/>

							{
								questionType === 'ACADEMIC'
									? <div className=''>
										< div className=''>
											{/* <Typography className='text-lg font-semibold text-primary'>Select department</Typography> */}
											<Controller
												name="department"
												control={control}
												render={({ field }) => (
													<Autocomplete
														className="mt-16"
														{...field}
														options={departments}
														getOptionLabel={(option) => option.name}
														onChange={(_, value) => {
															field.onChange(value);
															setValue('major', null);
															// setValue('specialization', null);
														}}
														value={field.value || null}
														renderInput={(params) => (
															<TextField
																{...params}
																label="Department"
																variant="outlined"
																error={!!errors.department}
																helperText={errors.department?.message}
																slotProps={{
																	input: {
																		...params.InputProps,
																		endAdornment: (
																			<React.Fragment>
																				{isLoadingDepartments ? <CircularProgress color="inherit" size={20} /> : null}
																				{params.InputProps.endAdornment}
																			</React.Fragment>
																		),
																	},
																}}
															/>
														)}
													/>
												)}
											/>

											{/* <Typography className='mt-16 text-lg font-semibold text-primary'>Select major</Typography> */}
											<Controller
												name="major"
												control={control}
												render={({ field }) => (
													<Autocomplete
														className="mt-16"
														{...field}
														options={majors}
														getOptionLabel={(option) => option.name}
														onChange={(_, value) => {
															field.onChange(value);
															setValue('specialization', null);
														}}
														value={field.value || null}
														renderInput={(params) => (
															<TextField
																{...params}
																label="Major"
																variant="outlined"
																error={!!errors.major}
																slotProps={{
																	input: {
																		...params.InputProps,
																		endAdornment: (
																			<React.Fragment>
																				{isLoadingMajors ? <CircularProgress color="inherit" size={20} /> : null}
																				{params.InputProps.endAdornment}
																			</React.Fragment>
																		),
																	},
																}}
															/>
														)}
													/>
												)}
											/>

											{/* <Typography className='mt-16 text-lg font-semibold text-primary'>Select Specialization</Typography>
											<Controller
												name="specialization"
												control={control}
												render={({ field }) => (
													<Autocomplete
														className="mt-16"
														{...field}
														options={specializations}
														getOptionLabel={(option) => option.name}
														onChange={(_, value) => field.onChange(value)}
														value={field.value || null}
														renderInput={(params) => (
															<TextField
																{...params}
																label="Specialization"
																variant="outlined"
																error={!!errors.specialization}
															/>
														)}
													/>
												)}
											/> */}
										</div>
									</div>
									: < div className=''>
										{/* <Typography className='text-lg font-semibold text-primary'>Select counselor's expertise</Typography> */}
										<Controller
											name="expertise"
											control={control}
											render={({ field }) => (
												<Autocomplete
													{...field}
													options={expertises}
													className='mt-16'
													getOptionLabel={(option) => option.name}
													onChange={(_, value) => field.onChange(value)}
													value={field.value || null}
													renderInput={(params) => (
														<TextField
															{...params}
															label="Expertise "
															variant="outlined"
															error={!!errors.expertise}
															slotProps={{
																input: {
																	...params.InputProps,
																	endAdornment: (
																		<React.Fragment>
																			{isLoadingCounselorExpertises ? <CircularProgress color="inherit" size={20} /> : null}
																			{params.InputProps.endAdornment}
																		</React.Fragment>
																	),
																},
															}}
														/>
													)}
												/>
											)}
										/>
									</div>
							}
						</div>

						<div className="flex items-center justify-end mt-32 pt-24 gap-8">
							<Button onClick={() => navigate(-1)} color="primary" type='button'>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="secondary"
								disabled={
									!isValid || isPosting || isEditing
								}
							>
								{editMode ? 'Save' : 'Submit'}
							</Button>
						</div>
					</form>
				</div>
			</div>
			{(isPosting || isEditing) && <BackdropLoading />}
		</div >
	);
}

export default QnaForm;
