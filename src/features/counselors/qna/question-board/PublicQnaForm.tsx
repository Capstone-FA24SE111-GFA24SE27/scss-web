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
import _ from 'lodash';
import { NavLinkAdapter, RenderHTML } from '@/shared/components';
import { ArrowBack } from '@mui/icons-material';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog } from '@/shared/hooks';
import { useConfirmDialog } from '@/shared/hooks';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '@/shared/configs';
import { ref } from 'firebase/storage';
import { useCreateContributedQuestionCardMutation, useGetAllCategoriesQuery, useGetCategoryByIdQuery, useGetContributedQuestionCardByIdQuery, useUpdateContributedQuestionCardByIdMutation } from '@/shared/pages';

// Define schema with validation
const formSchema = z.object({
  question: z.string().min(1, 'You must enter question'),
  answer: z.string().min(1, 'You must enter answer'),
  questionType: z.enum(['ACADEMIC', 'NON_ACADEMIC'], {
    errorMap: () => ({ message: 'Please select a question type' }),
  }),
  category: z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
  }).nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function QnaForm() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const editMode = Boolean(questionId);
  const account = useAppSelector(selectAccount)
  const { data: questionData } = useGetContributedQuestionCardByIdQuery(
    Number(questionId) || -1,
    {
      skip: !editMode,
    }
  )

  const quillRef = useRef(null);

  const question = questionData?.content
  const defaultValues: FormValues = { questionType: 'ACADEMIC', question: '', answer: '' };

  const { control, handleSubmit, watch, formState, reset, register, setValue } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const { errors, isValid, dirtyFields } = formState;

  // Watch the selected type and dynamically render fields
  const selectedType = watch('questionType');

  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategoriesQuery();
  const categories = categoriesData?.content || []

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleQuestionChange = (value: string) => {
    setValue('question', value, {
      shouldValidate: true
    });
  };

  const handleAnswerChange = (value: string) => {
    setValue('answer', value, {
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
  const [postQuestion, { isLoading: isPosting }] = useCreateContributedQuestionCardMutation();
  const [editQuestion, { isLoading: isEditing }] = useUpdateContributedQuestionCardByIdMutation();
  const dispatch = useAppDispatch()
  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      if (editMode && questionId) {
        useConfirmDialog({
          dispatch: dispatch,
          title: 'Confirm editing question?',
          confirmButtonFunction: () => {
            // editQuestion({
            //   id: Number(questionId),
            //   data: {
            //     content: data.content,
            //     questionType: data.questionType,
            //     departmentId: data.departmentId,
            //     majorId: data.majorId,
            //     specializationId: data.specializationId,
            //   }
            // })
            //   .unwrap()
            //   .then(() => {
            //     useAlertDialog({
            //       dispatch,
            //       color: 'success',
            //       title: 'Question was edit successfully!',
            //     })
            //     navigate(-1);
            //   })
            //   .catch(error => useAlertDialog({
            //     dispatch,
            //     color: 'error',
            //     title: 'Error editing question',
            //   }))
          }
        })

      } else {
        useConfirmDialog({
          dispatch: dispatch,
          title: 'Confirm creating question',
          content: (
            <div>
              <Typography>Question type: {data.questionType}</Typography>
              <Typography>Question:</Typography>
              <Typography>{RenderHTML(data.question)}</Typography>
              <Typography>Answer:</Typography>
              <Typography>{RenderHTML(data.answer)}</Typography>
            </div>
          ),
          confirmButtonFunction: () => {
            postQuestion({
              question: data.question,
              answer: data.answer,
              categoryId: data.category.id,
              counselorId: account.profile.id,
            })
              .unwrap()
              .then(() => {
                useAlertDialog({
                  dispatch,
                  color: 'success',
                  title: 'Question was created successfully!',
                })
                navigate(-1);
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
        // questionType: question?.questionType || 'ACADEMIC',
        // content: question?.content || '',
      });
    }
  }, [editMode, questionData, reset]);

  return (
    <div className="container flex flex-col items-center p-32 w-xl">
      <div className="flex flex-col w-full ">
        <Typography variant="h4"></Typography>
        <div className="">
          <Button
            component={NavLinkAdapter}
            to="../"
            startIcon={<ArrowBack />}
          >
            Back to My Q&A
          </Button>
        </div>
        <div className="mt-8 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {editMode ? 'Edit your Q&A' : 'Contribute an Q&A'}
        </div>
        <Paper className="p-16 mt-16 shadow rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="px-0">
            <div className="mb-24">
              <Typography variant="h6">Submit your question</Typography>
              <Typography color='textSecondary'>Your questions will be added to question board. </Typography>
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
                name="category"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    className="mt-16"
                    {...field}
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => {
                      field.onChange(value); // Update category object in the form
                    }}
                    value={field.value || null}  // Set the value to the selected category object
                    isOptionEqualToValue={(option, value) => option.id === value?.id}  // Ensure correct comparison for selected value
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        variant="outlined"
                        error={!!errors.category}
                        helperText={errors.category?.message}
                      />
                    )}
                  />
                )}
              />

              <Typography className='font-semibold'>Question</Typography>

              <ReactQuill
                ref={quillRef}
                className='h-sm'
                theme="snow"
                placeholder="Write your question question here..."
                modules={modules}
                onChange={handleQuestionChange}
                value={watch(`question`)}
              />

              {
                (uploadProgress > 0 && uploadProgress < 100) && (
                  <Box className={`w-full pt-36`}>
                    <Typography >Uploading image...</Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} color='secondary' />
                  </Box>
                )
              }

              {errors.question && (
                <Typography color="error" className='pt-16'>{errors.question.message}</Typography>
              )}

              <Typography className='font-semibold pt-32'>Answer</Typography>

              <ReactQuill
                ref={quillRef}
                className='h-sm -pt-32'
                theme="snow"
                placeholder="Write your question question here..."
                modules={modules}
                onChange={handleAnswerChange}
                value={watch(`answer`)}
              />

              {
                (uploadProgress > 0 && uploadProgress < 100) && (
                  <Box className={`w-full pt-36`}>
                    <Typography >Uploading image...</Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} color='secondary' />
                  </Box>
                )
              }

              {errors.answer && (
                <Typography color="error" className='pt-16'>{errors.answer.message}</Typography>
              )}

            </div>

            <div className="flex items-center justify-end mt-32 pt-24">
              <Button onClick={() => navigate('.')} color="primary">
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
