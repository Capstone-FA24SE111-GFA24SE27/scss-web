import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import {
	useGetDepartmentsQuery,
	useGetMajorsByDepartmentQuery,
	useGetSpecializationsByMajorQuery,
} from '@shared/services';
import { useGetCounselorExpertisesQuery } from '@shared/services';
import { usePostQuestionMutation, useEditQuestionMutation, useGetStudentQuestionQuery, useGetBanInfoQuery } from './qna-api';
import _ from 'lodash';
import BanInfo from './BanInfo';
import { NavLinkAdapter } from '@/shared/components';
import { ArrowBack } from '@mui/icons-material';
import { useAppDispatch } from '@shared/store';
import { useAlertDialog } from '@/shared/hooks';
import { useConfirmDialog } from '@/shared/hooks';

// Define schema with validation
const formSchema = z.object({
	content: z.string().min(1, 'You must enter content'),
	questionType: z.enum(['ACADEMIC', 'NON_ACADEMIC'], {
		errorMap: () => ({ message: 'Please select a question type' }),
	}),
	departmentId: z.string().optional(),
	majorId: z.string().optional(),
	specializationId: z.string().optional(),
	expertiseId: z.string().optional(),
});

type FormValues = {
	questionType: 'ACADEMIC' | 'NON_ACADEMIC';
	content: string;
	departmentId?: string;
	majorId?: string;
	specializationId?: string;
	expertiseId?: string;
};

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

	const { control, handleSubmit, watch, formState, reset } = useForm<FormValues>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(formSchema),
	});

	const { errors, isValid, dirtyFields } = formState;

	// Watch the selected type and dynamically render fields
	const selectedType = watch('questionType');

	// Conditional fields data
	const { data: departments, isLoading: loadingDepartments } = useGetDepartmentsQuery();
	const { data: majors, isLoading: loadingMajors } = useGetMajorsByDepartmentQuery(watch('departmentId'), {
		skip: !watch('departmentId'),
	});
	const { data: specializations, isLoading: loadingSpecializations } = useGetSpecializationsByMajorQuery(
		watch('majorId'),
		{
			skip: !watch('majorId'),
		}
	);
	const { data: counselorExpertisesData, isLoading: loadingExpertises } = useGetCounselorExpertisesQuery();
	const counselorExpertises = counselorExpertisesData?.content;

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
								content: data.content,
								questionType: data.questionType,
								departmentId: data.departmentId,
								majorId: data.majorId,
								specializationId: data.specializationId,
							}
						})
							.unwrap()
							.then(() => {
								useAlertDialog({
									dispatch,
									color: 'success',
									title: 'Question was edit successfully!',
								})
								navigate('.');
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
					title: 'Confirm creating question',
					content: (
						<div>
							<Typography>Question type: {data.questionType}</Typography>
							<Typography>Content:</Typography>
							<Typography>{data.content}</Typography>
						</div>
					),
					confirmButtonFunction: () => {
						postQuestion({
							content: data.content,
							questionType: data.questionType,
							departmentId: data.departmentId,
							majorId: data.majorId,
							specializationId: data.specializationId,
						})
							.unwrap()
							.then(() => {
								useAlertDialog({
									dispatch,
									color: 'success',
									title: 'Question was created successfully!',
								})
								navigate('.');
							})
							.catch(error => useAlertDialog({
								dispatch,
								color: 'error',
								title: 'Error creating question',
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
			});
		}
	}, [editMode, questionData, reset]);

	if (banInfo?.ban) {
		return <BanInfo banInfo={banInfo} />
	}
	return (
		<div className="container flex flex-col items-center p-32">
			<div className="flex flex-col w-full max-w-4xl">
				<Typography variant="h4"></Typography>
				<div className="">
					<Button
						component={NavLinkAdapter}
						to="."
						startIcon={<ArrowBack />}
					>
						Back to QnA
					</Button>
				</div>
				<div className="mt-8 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
					{editMode ? 'Edit your question' : 'Ask a question'}
				</div>
				<Paper className="p-24 mt-32 shadow rounded-2xl">
					<form onSubmit={handleSubmit(onSubmit)} className="px-0">
						<div className="mb-24">
							<Typography variant="h6">Submit your question</Typography>
							<Typography color='textSecondary'>Your questions will be reviwed and forwarded to our counselors.</Typography>
						</div>
						<div className="space-y-32">
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
							{!editMode && <>
								{selectedType === 'ACADEMIC' ? (
									<div className='flex gap-16'>
										{/* Department Dropdown */}
										<Controller
											name="departmentId"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													select
													label="Department"
													fullWidth
													variant="outlined"
													disabled={loadingDepartments}
													error={!!errors.departmentId}
													helperText={errors.departmentId?.message}
												>
													{loadingDepartments ? (
														<MenuItem disabled>
															<CircularProgress size={24} />
														</MenuItem>
													) : (
														departments?.map((department) => (
															<MenuItem key={department.id} value={department.id.toString()}>
																{department.name}
															</MenuItem>
														))
													)}
												</TextField>
											)}
										/>

										{/* Major Dropdown */}
										<Controller
											name="majorId"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													select
													label="Major"
													fullWidth
													variant="outlined"
													disabled={!watch('departmentId') || loadingMajors}
													error={!!errors.majorId}
													helperText={errors.majorId?.message}
												>
													{loadingMajors ? (
														<MenuItem disabled>
															<CircularProgress size={24} />
														</MenuItem>
													) : (
														majors?.map((major) => (
															<MenuItem key={major.id} value={major.id.toString()}>
																{major.name}
															</MenuItem>
														))
													)}
												</TextField>
											)}
										/>

										{/* Specialization Dropdown */}
										<Controller
											name="specializationId"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													select
													label="Specialization"
													fullWidth
													variant="outlined"
													disabled={!watch('majorId') || loadingSpecializations}
													error={!!errors.specializationId}
													helperText={errors.specializationId?.message}
												>
													{loadingSpecializations ? (
														<MenuItem disabled>
															<CircularProgress size={24} />
														</MenuItem>
													) : (
														specializations?.map((specialization) => (
															<MenuItem key={specialization.id} value={specialization.id.toString()}>
																{specialization.name}
															</MenuItem>
														))
													)}
												</TextField>
											)}
										/>
									</div>
								) : (
									<Controller
										name="expertiseId"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Expertise"
												fullWidth
												variant="outlined"
												disabled={loadingExpertises}
												error={!!errors.expertiseId}
												helperText={errors.expertiseId?.message}
											>

												{loadingExpertises ? (
													<MenuItem disabled>
														<CircularProgress size={24} />
													</MenuItem>
												) : (
													counselorExpertises?.map((expertise) => (
														<MenuItem key={expertise.id} value={expertise.id.toString()}>
															{expertise.name}
														</MenuItem>
													))
												)}
											</TextField>
										)}
									/>
								)}
							</>
							}

							{/* Content Field */}
							<Controller
								name="content"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Content"
										fullWidth
										variant="outlined"
										multiline
										minRows={8}
										error={!!errors.content}
										helperText={errors.content?.message}
									/>
								)}
							/>
						</div>

						<div className="flex items-center justify-end mt-32">
							<Button onClick={() => navigate('.')} color="primary">
								Cancel
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="secondary"
								disabled={!isValid || isPosting || isEditing || _.isEmpty(dirtyFields)}
							>
								{editMode ? 'Save' : 'Submit'}
							</Button>
						</div>
					</form>
				</Paper>
			</div>
		</div>
	);
}

export default QnaForm;
