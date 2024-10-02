import React, { useState } from 'react';
import { useForm, Controller, FieldError } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stepper, Step, StepLabel, Typography, Box, Switch, FormControlLabel, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import { useCreateAppointmentReportMutation } from './report-api';
import { useParams, useNavigate } from 'react-router';
import { renderHTML } from '@/shared/utils';
import { Scrollbar, closeDialog, openDialog } from '@/shared/components';
import { useAppDispatch } from '@shared/store';

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
    followUpNeeded: z.boolean().optional(), // New field for follow-up
    followUpNotes: z.string(),
  }),
  intervention: z.object({
    type: z.string().nonempty('Intervention Type is required'),
    description: z.string().nonempty('Description is required'),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const steps = ['Goal', 'Content', 'Conclusion', 'Intervention'];

const ReportCreate = () => {
  const routeParams = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const { handleSubmit, control, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consultationGoal: { specificGoal: '', reason: '' },
      consultationContent: {
        summaryOfDiscussion: '',
        mainIssues: '',
        studentEmotions: '',
        studentReactions: '',
      },
      consultationConclusion: { counselorConclusion: '', followUpNeeded: false, followUpNotes: '' },
      intervention: { type: '', description: '' },
    },
  });

  const formData = watch(); // Watching all form data
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const [createCounselingMutation] = useCreateAppointmentReportMutation();

  const onSubmit = (data: FormValues) => {
    createCounselingMutation({
      appointmentId: routeParams.id,
      report: data,
    });
    navigate('..');
  };

  return (
    <div className="flex flex-col justify-center mt-8 w-lg p-32 gap-16">
      <div className="flex">
        <Typography className="text-20 md:text-24 font-extrabold tracking-tight leading-none">
          Create report
        </Typography>
      </div>
      <div className="flex gap-24 mt-4 pb-8">
        <div className="flex gap-8 items-center ">
          <CalendarMonth />
          <Typography className="">2024-10-01</Typography>
        </div>
        <div className="flex gap-8 items-center">
          <AccessTime />
          <Typography className="">08:00 - 09:00</Typography>
        </div>
      </div>
      <Stepper activeStep={activeStep} alternativeLabel className="mb-16 flex">
        {steps.map((label, index) => (
          <Step key={label} completed={index < activeStep}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Consultation Goal */}
        <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
          <h2 className="text-xl font-semibold mb-4">Consultation Goal</h2>
          <div className="">
            <label className="block font-medium mb-4 pt-16">Specific Goal</label>
            <div className="h-96 mb-48">
              <Controller
                name="consultationGoal.specificGoal"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('consultationGoal.specificGoal')}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.consultationGoal?.specificGoal && (
              <p className="text-red-500 mb-16">{errors.consultationGoal.specificGoal.message}</p>
            )}

            <label className="block font-medium mb-4 pt-16">Reason</label>
            <div className="h-96 mb-48">
              <Controller
                name="consultationGoal.reason"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('consultationGoal.reason')}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.consultationGoal?.reason && (
              <p className="text-red-500">{errors.consultationGoal.reason.message}</p>
            )}
          </div>
        </div>

        {/* Consultation Content */}
        <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
          <h2 className="text-xl font-semibold mb-4">Consultation Content</h2>
          <div className="">
            <label className="block font-medium mb-4 pt-16">Summary of Discussion</label>
            <div className="h-96 mb-48">
              <Controller
                name="consultationContent.summaryOfDiscussion"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('consultationContent.summaryOfDiscussion')}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.consultationContent?.summaryOfDiscussion && (
              <p className="text-red-500 mb-16">{errors.consultationContent.summaryOfDiscussion.message}</p>
            )}

            <label className="block font-medium mb-4 pt-16">Main Issues</label>
            <div className="h-96 mb-48">
              <Controller
                name="consultationContent.mainIssues"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('consultationContent.mainIssues')}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.consultationContent?.mainIssues && (
              <p className="text-red-500 mb-16">{errors.consultationContent.mainIssues.message}</p>
            )}

            <label className="block font-medium mb-4 pt-16">Student Emotions</label>
            <div className="h-96 mb-48">
              <Controller
                name="consultationContent.studentEmotions"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('consultationContent.studentEmotions')}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.consultationContent?.studentEmotions && (
              <p className="text-red-500 mb-16">{errors.consultationContent.studentEmotions.message}</p>
            )}

            <label className="block font-medium mb-4 pt-16">Student Reactions</label>
            <div className="h-96 mb-48">
              <Controller
                name="consultationContent.studentReactions"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('consultationContent.studentReactions')}
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

        {/* Consultation Conclusion */}
        <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
          <h2 className="text-xl font-semibold mb-4">Consultation Conclusion</h2>
          <div className="">
            <label className="block font-medium mb-4 pt-16">Counselor Conclusion</label>
            <div className="h-96 mb-48">
              <Controller
                name="consultationConclusion.counselorConclusion"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('consultationConclusion.counselorConclusion')}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.consultationConclusion?.counselorConclusion && (
              <p className="text-red-500 mb-16">{errors.consultationConclusion.counselorConclusion.message}</p>
            )}

            <FormControlLabel
              control={
                <Controller
                  name="consultationConclusion.followUpNeeded"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              }
              label="Follow-up needed"
            />
            {errors.consultationConclusion?.followUpNeeded && (
              <p className="text-red-500 mb-16">{(errors.consultationConclusion.followUpNeeded as FieldError).message}</p>
            )}

            <label className="block font-medium mb-4 pt-16">Follow-Up Notes</label>
            <div className="h-96 mb-48">
              <Controller
                name="consultationConclusion.followUpNotes"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('consultationConclusion.followUpNotes')}
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

        {/* Intervention */}
        <div style={{ display: activeStep === 3 ? 'block' : 'none' }}>
          <h2 className="text-xl font-semibold mb-4">Intervention</h2>
          <div className="">
            <label className="block font-medium mb-4 pt-16">Intervention Type</label>
            <div className="h-96 mb-48">
              <Controller
                name="intervention.type"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('intervention.type')}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.intervention?.type && (
              <p className="text-red-500 mb-16">{(errors.intervention.type as FieldError).message}</p>
            )}

            <label className="block font-medium mb-4 pt-16">Description</label>
            <div className="h-96 mb-48">
              <Controller
                name="intervention.description"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    className="mb-4 h-full"
                    value={watch('intervention.description')}
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

        <Box display="flex" justifyContent="space-between" mt={8}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            color="primary"
            className="w-96"
          >
            Back
          </Button>
          <div className="flex gap-8">
            <Button variant="outlined"
              onClick={() => {
                dispatch(openDialog({
                  children: <ReportPreview report={formData} />
                }));
              }}
            >
              Preview
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained" color="secondary" className="w-96">
                Submit
              </Button>
            ) : (

              <Button onClick={handleNext} variant="contained" color="primary" className="w-96">
                Next
              </Button>
            )}
          </div>
        </Box>
      </form>
    </div>
  );
};

export default ReportCreate;




const ReportPreview = ({ report }: { report: FormValues }) => {
  return (
    <div className='w-[56rem] overflow-auto'>
      <DialogTitle id="alert-dialog-title">Report Preview</DialogTitle>
      <DialogContent id="alert-dialog-description" className='overflow-hidden'>
        <section className="mb-16">
          <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
            Consultation Goal
          </Typography>
          <div className="mt-4 space-y-8 mx-8">
            {report.consultationGoal?.specificGoal && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Specific Goal:
                </Typography>
                {renderHTML(report.consultationGoal.specificGoal)}
              </div>
            )}
            {report.consultationGoal?.reason && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Reason:
                </Typography>
                {renderHTML(report.consultationGoal.reason)}
              </div>
            )}
          </div>
        </section>

        {/* Consultation Content */}
        <section className="mb-16">
          <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
            Consultation Content
          </Typography>
          <div className="mt-4 space-y-8 mx-8">
            {report.consultationContent?.summaryOfDiscussion && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Summary of Discussion:
                </Typography>
                {renderHTML(report.consultationContent.summaryOfDiscussion)}
              </div>
            )}
            {report.consultationContent?.mainIssues && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Main Issues:
                </Typography>
                {renderHTML(report.consultationContent.mainIssues)}
              </div>
            )}
            {report.consultationContent?.studentEmotions && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Student Emotions:
                </Typography>
                {renderHTML(report.consultationContent.studentEmotions)}
              </div>
            )}
            {report.consultationContent?.studentReactions && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Student Reactions:
                </Typography>
                {renderHTML(report.consultationContent.studentReactions)}
              </div>
            )}
          </div>
        </section>

        {/* Consultation Conclusion */}
        <section className="mb-16">
          <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
            Consultation Conclusion
          </Typography>
          <div className="mt-4 space-y-8 mx-8">
            {report.consultationConclusion?.counselorConclusion && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Counselor Conclusion:
                </Typography>
                {renderHTML(report.consultationConclusion.counselorConclusion)}
              </div>
            )}
            <div className='flex gap-8'>
              <Typography className="font-semibold text-lg text-primary-light">
                Follow-up Needed:
              </Typography>
              <Typography className='text-lg'>{report.consultationConclusion?.followUpNeeded ? 'Yes' : 'No'}</Typography>
            </div>
            {report.consultationConclusion?.followUpNotes && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Follow-up Notes:
                </Typography>
                {renderHTML(report.consultationConclusion.followUpNotes)}
              </div>
            )}
          </div>
        </section>

        {/* Intervention */}
        <section>
          <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
            Intervention
          </Typography>
          <div className="mt-4 space-y-4 mx-8">
            {report.intervention?.type && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Type:
                </Typography>
                {renderHTML(report.intervention.type)}
              </div>
            )}
            {report.intervention?.description && (
              <div>
                <Typography className="font-semibold text-lg text-primary-light">
                  Description:
                </Typography>
                {renderHTML(report.intervention.description)}
              </div>
            )}
          </div>
        </section>
      </DialogContent>
    </div>
  );
}