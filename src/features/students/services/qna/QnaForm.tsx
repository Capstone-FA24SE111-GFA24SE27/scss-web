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
import { usePostQuestionMutation, useEditQuestionMutation } from './qna-api';
import _ from 'lodash';

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

	// Form submission handler
	const onSubmit = async (data: FormValues) => {
		try {
			if (editMode && questionId) {
				// Edit existing question
				await editQuestion({
					questionCardId: Number(questionId),
					question: {
						content: data.content,
						questionType: data.questionType,
						departmentId: data.departmentId,
						majorId: data.majorId,
						specializationId: data.specializationId,
					}
				}).unwrap();
				navigate('.');
			} else {
				// Post a new question
				await postQuestion({
					content: data.content,
					questionType: data.questionType,
					departmentId: data.departmentId,
					majorId: data.majorId,
					specializationId: data.specializationId,
				}).unwrap();
				navigate('.');
			}
		} catch (error) {
			console.error("Failed to submit question:", error);
		}
	};

	useEffect(() => {
		if (editMode && questionId) {
			// Assume fetching question data is done here and set question data
			reset({
				questionType: 'ACADEMIC' as 'ACADEMIC' | 'NON_ACADEMIC', // Example, replace with actual data
				content: '',
			});
		}
	}, [editMode, questionId, reset]);

	return (
		<div className="flex flex-col items-center p-32 container">
			<div className="flex flex-col w-full max-w-4xl">
				<Typography variant="h4">{editMode ? 'Edit your question' : 'Ask a question'}</Typography>
				<Paper className="mt-32 p-24 rounded-2xl shadow">
					<form onSubmit={handleSubmit(onSubmit)} className="px-0">
						<div className="mb-24">
							<Typography variant="h6">Submit your question</Typography>
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

							{/* Conditional Fields */}
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
										minRows={4}
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
								{editMode ? 'Save Changes' : 'Submit'}
							</Button>
						</div>
					</form>
				</Paper>
			</div>
		</div>
	);
}

export default QnaForm;
