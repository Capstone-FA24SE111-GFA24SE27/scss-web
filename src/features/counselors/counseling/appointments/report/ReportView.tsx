import React, { useState } from 'react';
import { useForm, Controller, FieldError } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stepper, Step, StepLabel, Typography, Box } from '@mui/material';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import { useCreateCounselingReportMutation } from './report-api';
import { useParams } from 'react-router';

// Zod schema for validation
const formSchema = z.object({
  consultationGoal: z.object({
    specificGoal: z.string().nonempty('Specific Goal is required'),
    reason: z.string().nonempty('Reason is required'),
  }),
  consultationContent: z.object({
    summaryOfDiscussion: z.string().nonempty('Summary of Discussion is required'),
    mainIssues: z.string().nonempty('Main Issues are required'),
    studentEmotions: z.string().nonempty('Student Emotions are required'),
    studentReactions: z.string().nonempty('Student Reactions are required'),
  }),
  consultationConclusion: z.object({
    counselorConclusion: z.string().nonempty('Counselor Conclusion is required'),
    followUpNotes: z.string().nonempty('Follow-Up Notes are required'),
  }),
  intervention: z.object({
    type: z.string().nonempty('Intervention Type is required'),
    description: z.string().nonempty('Description is required'),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const steps = ['Goal', 'Content', 'Conclusion', 'Intervention'];

const ConsultationForm: React.FC = () => {
  const routeParams = useParams();
  const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consultationGoal: { specificGoal: '', reason: '' },
      consultationContent: {
        summaryOfDiscussion: '',
        mainIssues: '',
        studentEmotions: '',
        studentReactions: '',
      },
      consultationConclusion: { counselorConclusion: '', followUpNotes: '' },
      intervention: { type: '', description: '' },
    },
  });

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const [createCounselingMutation] = useCreateCounselingReportMutation()

  const onSubmit = (data: FormValues) => {
    createCounselingMutation({
      appointmentId: routeParams.id,
      report: data
    })
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Consultation Goal</h2>
            <div className="">
              <label className="block font-medium text-gray-700 mb-4 pt-16">Specific Goal</label>
              <div className="h-96 mb-48">
                <Controller
                  name="consultationGoal.specificGoal"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.consultationGoal?.specificGoal && (
                <p className="text-red-500 mb-16">{errors.consultationGoal.specificGoal.message}</p>
              )}

              <label className="block font-medium text-gray-700 mb-4 pt-16">Reason</label>
              <div className="h-96 mb-48">
                <Controller
                  name="consultationGoal.reason"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.consultationGoal?.reason && (
                <p className="text-red-500 ">{errors.consultationGoal.reason.message}</p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Consultation Content</h2>
            <div className="">
              <label className="block font-medium text-gray-700 mb-4 pt-16">Summary of Discussion</label>
              <div className="h-96 mb-48">
                <Controller
                  name="consultationContent.summaryOfDiscussion"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.consultationContent?.summaryOfDiscussion && (
                <p className="text-red-500 mb-16">{errors.consultationContent.summaryOfDiscussion.message}</p>
              )}

              <label className="block font-medium text-gray-700 mb-4 pt-16">Main Issues</label>
              <div className="h-96 mb-48">
                <Controller
                  name="consultationContent.mainIssues"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.consultationContent?.mainIssues && (
                <p className="text-red-500 mb-16">{errors.consultationContent.mainIssues.message}</p>
              )}

              <label className="block font-medium text-gray-700 mb-4 pt-16">Student Emotions</label>
              <div className="h-96 mb-48">
                <Controller
                  name="consultationContent.studentEmotions"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.consultationContent?.studentEmotions && (
                <p className="text-red-500 mb-16">{errors.consultationContent.studentEmotions.message}</p>
              )}

              <label className="block font-medium text-gray-700 mb-4 pt-16">Student Reactions</label>
              <div className="h-96 mb-48">
                <Controller
                  name="consultationContent.studentReactions"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.consultationContent?.studentReactions && (
                <p className="text-red-500 mb-16">{errors.consultationContent.studentReactions.message}</p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Consultation Conclusion</h2>
            <div className="">
              <label className="block font-medium text-gray-700 mb-4 pt-16">Counselor Conclusion</label>
              <div className="h-96 mb-48">
                <Controller
                  name="consultationConclusion.counselorConclusion"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.consultationConclusion?.counselorConclusion && (
                <p className="text-red-500 mb-16">{errors.consultationConclusion.counselorConclusion.message}</p>
              )}

              <label className="block font-medium text-gray-700 mb-4 pt-16">Follow-Up Notes</label>
              <div className="h-96 mb-48">
                <Controller
                  name="consultationConclusion.followUpNotes"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.consultationConclusion?.followUpNotes && (
                <p className="text-red-500 mb-16">{errors.consultationConclusion.followUpNotes.message}</p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Intervention</h2>
            <div className="">
              <label className="block font-medium text-gray-700 mb-4 pt-16">Intervention Type</label>
              <div className="h-96 mb-48">
                <Controller
                  name="intervention.type"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.intervention?.type && (
                <p className="text-red-500 mb-16">{(errors.intervention.type as FieldError).message}</p>
              )}

              <label className="block font-medium text-gray-700 mb-4 pt-16">Description</label>
              <div className="h-96 mb-48">
                <Controller
                  name="intervention.description"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className="mb-4 h-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.intervention?.description && (
                <p className="text-red-500 mb-16">{errors.intervention.description.message}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center mt-32 w-lg p-32 gap-16">
      <div className='flex'>
        <Typography className="text-20 md:text-24 font-extrabold tracking-tight leading-none">
          Create report for Student
        </Typography>
      </div>
      <div className='flex gap-24 mt-4 pb-8'>
        <div className='flex gap-8 items-center '>
          <CalendarMonth />
          <Typography className='' >2024-10-01</Typography>
        </div>
        <div className='flex gap-8 items-center'>
          <AccessTime />
          <Typography className=''>08:00 - 09:00</Typography>
        </div>
      </div>
      <Stepper activeStep={activeStep} alternativeLabel className="mb-16">
        {steps.map((label, index) => (
          <Step key={label} completed={index < activeStep}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStepContent(activeStep)}

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            color="secondary"
            className='w-96'
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <div className='flex gap-8'>
              <Button variant='outlined'>Preview</Button>
              <Button type="submit" variant="contained" color="secondary" className='w-96'>
                Submit
              </Button>
            </div>
          ) : (
            <div>
              <Button onClick={handleNext} variant="contained" color="secondary" className='w-96'>
                Next
              </Button>
            </div>
          )}
        </Box>
      </form>
    </div>
  );
};

export default ConsultationForm;
