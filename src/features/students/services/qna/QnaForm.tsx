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
import { NavLinkAdapter } from '@/shared/components';
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
	departmentId: z.string().optional(),
	majorId: z.string().optional(),
	specializationId: z.string().optional(),
	expertiseId: z.string().optional(),
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
	const quillRef = useRef(null);


	const question = questionData?.content
	const defaultValues: FormValues = { questionType: 'ACADEMIC', content: '' };

	const { control, handleSubmit, watch, formState, reset, register, setValue } = useForm<FormValues>({
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

	const [uploadProgress, setUploadProgress] = useState(0);

	const handleQuillChange = (value: string) => {
		setValue('content', value, {
			shouldValidate: true
		});
	};

	// Image upload handler
	const handleImageUpload = useCallback(() => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			if (input && input.files && input.files[0]) {
				const file = input.files[0];
				const path = `images/${Date.now()}_${file.name}`;
				console.log(`Image`, path)

				try {
					const downloadURL = await uploadFile(file, path, (progress) => {
						setUploadProgress(progress);
					});


					// Now insert the image into the Quill editor
					const quill = quillRef.current?.getEditor(); // Get the Quill editor instance

					if (quill) {
						const range = quill.getSelection(); // Get the current selection (position) in the editor
						console.log(`Range: `, range)

						if (range) {
							quill.insertEmbed(range.index, 'image', downloadURL); // Insert the image URL at the cursor position
							const image = quill.root.querySelector('img[src="' + downloadURL + '"]');
							if (image) {
								image.style.maxWidth = '48rem';
								image.style.height = 'auto';
							}
						}
					}
				} catch (error) {
					console.error("Image upload failed:", error);
				}
			}
		};
	}, []);

	const modules = {
		toolbar: {
			container: [
				[{ header: '1' }, { header: '2' }],
				// ['bold', 'italic', 'underline'],
				[{ list: 'ordered' }, { list: 'bullet' }],
				['link'],
				['image'], // Image button in the toolbar
			],
			handlers: {
				image: handleImageUpload, // Custom handler for image upload
			},
		},
	};

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
							title: data.title,
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
								navigate(`../my-qna`);
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
		<div className="container flex flex-col items-center p-32 w-xl">
			<div className="flex flex-col w-full ">
				<Typography variant="h4"></Typography>
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
				<Paper className='p-16 mt-16 bg-secondary-main/10 text-secondary-main shadow-0 text-lg'>
					<Typography className='font-semibold text-lg'>Tips on getting good answers quickly</Typography>
					<li>Ensure your question hasn't been asked before</li>
					<li>Keep your question concise and straightforward</li>
					<li>Double-check your grammar and spelling</li>
				</Paper>
				<Paper className="p-16 mt-16 shadow rounded-2xl">
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

							<Controller
								control={control}
								name="title"
								render={({ field }) => (
									<TextField
										className="mt-32"
										{...field}
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
								label="Question"
							/>

						</div>

						<div className="flex items-center justify-end mt-32 pt-24">
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
				</Paper>
			</div>
		</div >
	);
}

export default QnaForm;
