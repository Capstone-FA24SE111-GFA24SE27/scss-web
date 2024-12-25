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
  Divider,
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
import { BackdropLoading, NavLinkAdapter, QuillEditor, RenderHTML } from '@/shared/components';
import { ArrowBack } from '@mui/icons-material';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog } from '@/shared/hooks';
import { useConfirmDialog } from '@/shared/hooks';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '@/shared/configs';
import { ref } from 'firebase/storage';
import { useCreateContributedQuestionCardMutation, useGetAllCategoriesQuery, useGetCategoryByIdQuery, useGetContributedQuestionCardByIdQuery, useUpdateContributedQuestionCardByIdMutation } from '@/shared/pages';
import { validateHTML } from '@/shared/utils';
import { counselingTypeLabel } from '@/shared/constants';

// Define schema with validation
const formSchema = z.object({
  title: z.string().min(1, 'You must enter title'),
  // questionType: z.enum(['ACADEMIC', 'NON_ACADEMIC'], {
  //   errorMap: () => ({ message: 'Please select a question type' }),
  // }),
  category: z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
  }).nullable().optional(),
  // question: z.string().min(1, 'You must enter question')
  //   .refine(
  //     validateHTML,
  //     { message: 'Question must not be empty', }
  //   ),
  question: z.string().nullable().optional(),
  answer: z.string().min(1, 'You must enter answer')
    .refine(
      validateHTML,
      { message: 'Answer must not be empty', }
    ),

});

type FormValues = z.infer<typeof formSchema>;

function CounselorQnaForm() {
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

  const question = questionData?.content

  const defaultValues: FormValues = { title: '', question: '', answer: '' };

  const { control, handleSubmit, watch, formState, reset, register, setValue } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const { errors, isValid, dirtyFields } = formState;

  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategoriesQuery();
  const categories = categoriesData?.content || []


  const [postQuestion, { isLoading: isPosting }] = useCreateContributedQuestionCardMutation();
  const [editQuestion, { isLoading: isEditing }] = useUpdateContributedQuestionCardByIdMutation();
  const dispatch = useAppDispatch()
  // Form submission handler

  console.log(watch(), isValid)
  const onSubmit = async (data: FormValues) => {
    try {
      if (editMode && questionId) {
        useConfirmDialog({
          dispatch: dispatch,
          title: 'Confirm editing question',
          content: (
            <div className='flex flex-col gap-8'>
              <Typography className='font-semibold'>Category</Typography>
              <Typography>{data.category.name}</Typography>
              <Typography className='font-semibold'>Title: </Typography>
              <Typography>{RenderHTML(data.title)}</Typography>
              <Typography className='font-semibold'>Question: </Typography>
              <Typography>{RenderHTML(data.question)}</Typography>
              <Divider />
              <Typography className='font-semibold'>Answer:</Typography>
              <Typography>{RenderHTML(data.answer)}</Typography>
            </div>
          ),
          confirmButtonFunction: () => {
            editQuestion({
              id: Number(questionId),
              data: {
                question: data.question,
                answer: data.answer,
                categoryId: data.category.id,
                counselorId: account.profile.id,
                title: data.title
              }
            })
              .unwrap()
              .then(() => {
                useAlertDialog({
                  dispatch,
                  color: 'success',
                  title: 'Question was edited successfully!',
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

      } else {
        useConfirmDialog({
          dispatch: dispatch,
          title: 'Confirm creating question',
          content: (
            <div className='flex flex-col gap-8'>
              <Typography className='font-semibold'>Category</Typography>
              <Typography>{data.category.name}</Typography>
              <Typography className='font-semibold'>Title: </Typography>
              <Typography>{RenderHTML(data.title)}</Typography>
              <Typography className='font-semibold'>Question: </Typography>
              <Typography>{RenderHTML(data.question)}</Typography>
              <Divider />
              <Typography className='font-semibold'>Answer:</Typography>
              <Typography>{RenderHTML(data.answer)}</Typography>
            </div>
          ),
          confirmButtonFunction: () => {
            postQuestion({
              question: data.question,
              answer: data.answer,
              categoryId: data.category.id,
              counselorId: account.profile.id,
              title: data.title
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
        question: question.question,
        answer: question.answer,
        category: question.category,
        title: question.title
      });
    }
  }, [editMode, questionData, reset]);

  useEffect(() => {
    console.log('Form Errors:', errors);
    console.log('Is form valid?', isValid);
    console.log('Dirty fields:', dirtyFields);
  }, [errors, isValid, dirtyFields]);

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
            Back
          </Button>
        </div>
        <div className="mt-8 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {editMode ? 'Edit your Q&A' : 'Contribute an Q&A'}
        </div>
        <Typography color='textSecondary'>Your questions will be added to FQA board. </Typography>
        <Divider  className='my-16'/>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)} className="px-0">
            <div className="space-y-16">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    groupBy={(option) => counselingTypeLabel[option.type]}
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

              <Controller
                control={control}
                name="title"
                defaultValue={question?.title || ''}
                render={({ field }) => (
                  <TextField
                    className="mt-32"
                    {...field}
                    label="Title"
                    placeholder="Title"
                    id="title"
                    error={!!errors.title}
                    helperText={errors?.title?.message}
                    fullWidth

                  />
                )}
              />

              <QuillEditor
                label='Content'
                value={watch('question')}
                onChange={(value) => setValue('question', value, { shouldValidate: true })}
                error={errors.question?.message}
                placeholder='Enter the question...'
              />

              <Divider className='pt-16'/>

              <QuillEditor
                label='Answer'
                value={watch('answer')}
                onChange={(value) => setValue('answer', value, { shouldValidate: true })}
                error={errors.answer?.message}
                placeholder='Enter the answer...'
              />

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
        </div>
      </div>
      {(isPosting || isEditing) && <BackdropLoading />}

    </div >
  );
}

export default CounselorQnaForm;
