import { useState, MouseEvent } from 'react';
import { useForm, Controller, FieldError } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stepper, Step, StepLabel, Typography, Box, Switch, FormControlLabel, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import { useCreateAppointmentReportMutation } from './report-api';
import { useParams, useNavigate } from 'react-router';
import { ContentLoading, RenderHTML, UserLabel } from '@/shared/components';
import { Scrollbar, closeDialog, openDialog, QuillEditor } from '@/shared/components';
import { useAppDispatch } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import ReportPreview from './ReportPreview';
import { useGetAppointmentByIdQuery } from '@/shared/pages';
import dayjs from 'dayjs';

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

export type ReportFormValues = z.infer<typeof formSchema>;

const steps = ['Goal', 'Content', 'Conclusion', 'Intervention'];

const customModules = {
  toolbar: {
    container: [
      [{ header: '1' }, { header: '2' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  },
};


const ReportCreate = () => {
  const { id: appointmentId } = useParams();
  const { data: appointmentData, isLoading } = useGetAppointmentByIdQuery(appointmentId)
  const appointment = appointmentData?.content;

  const routeParams = useParams();
  const navigate = useNavigate();
  const { handleSubmit, control, formState: { errors }, watch, setValue } = useForm<ReportFormValues>({
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

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  };
  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  };

  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  const dispatch = useAppDispatch()
  const [createCounselingMutation] = useCreateAppointmentReportMutation();

  const onSubmit = (data: ReportFormValues) => {
    useConfirmDialog({
      dispatch,
      title: 'Confirm creating appointment report?',
      confirmButtonFunction: () => {
        createCounselingMutation({
          appointmentId: routeParams.id,
          report: data,
        })
          .unwrap()
          .then(() => {

            useAlertDialog({
              dispatch,
              title: 'Report created successfully!',
              color: 'success',
            })
          })
        // .catch(() => {
        //   useAlertDialog({
        //     dispatch,
        //     title: 'Failed to create report',
        //     color: 'error',
        //   })
        // })
        navigate('..');
      }
    })

  };

  if (isLoading) {
    return <ContentLoading />
  }

  if (!appointment || appointment?.status !== 'ATTEND') {
    return <Typography className='p-16' color='textSecondary'>Invalid appointment</Typography>
  }


  return (
    <div className="flex flex-col justify-center mt-8 w-lg p-32 gap-16">
      <div className="flex">
        <Typography className="text-20 md:text-24 font-extrabold tracking-tight leading-none">
          Report Form
        </Typography>
      </div>
      <div className="flex gap-24 mt-4 pb-8">
        <div className='flex items-center gap-8 '>
          <CalendarMonth />
          <Typography className='' >{dayjs(appointment.startDateTime).format('YYYY-MM-DD')}</Typography>
        </div>
        <div className='flex items-center gap-8'>
          <AccessTime />
          <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
        </div>
        <UserLabel label='Created for' profile={appointment?.studentInfo?.profile} />
      </div>
      <Stepper activeStep={activeStep} alternativeLabel className="mb-16 flex">
        {steps.map((label, index) => (
          <Step
            key={label}
            // completed={index < activeStep}
            onClick={() => handleStep(index)}
          >
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
            <div className="mb-16">
              <QuillEditor
                value={watch('consultationGoal.specificGoal')}
                onChange={(value) => setValue('consultationGoal.specificGoal', value, { shouldValidate: true })}
                error={errors.consultationGoal?.specificGoal?.message}
                customModules={customModules}
              />
            </div>

            <label className="block font-medium mb-4 pt-16">Reason</label>
            <div className="mb-16">
              <QuillEditor
                value={watch('consultationGoal.reason')}
                onChange={(value) => setValue('consultationGoal.reason', value, { shouldValidate: true })}
                error={errors.consultationGoal?.reason?.message}
                customModules={customModules}
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
            <div className="mb-16">
              <QuillEditor
                value={watch('consultationContent.summaryOfDiscussion')}
                onChange={(value) => setValue('consultationContent.summaryOfDiscussion', value, { shouldValidate: true })}
                error={errors.consultationContent?.summaryOfDiscussion?.message}
                customModules={customModules}
              />
            </div>

            <label className="block font-medium mb-4 pt-16">Main Issues</label>
            <div className="mb-16">
              <QuillEditor
                value={watch('consultationContent.mainIssues')}
                onChange={(value) => setValue('consultationContent.mainIssues', value, { shouldValidate: true })}
                error={errors.consultationContent?.mainIssues?.message}
                customModules={customModules}
              />
            </div>

            <label className="block font-medium mb-4 pt-16">Student Emotions</label>
            <div className="mb-16">
              <QuillEditor
                value={watch('consultationContent.studentEmotions')}
                onChange={(value) => setValue('consultationContent.studentEmotions', value, { shouldValidate: true })}
                error={errors.consultationContent?.studentEmotions?.message}
                customModules={customModules}
              />
            </div>

            <label className="block font-medium mb-4 pt-16">Student Reactions</label>
            <div className="mb-16">
              <QuillEditor
                value={watch('consultationContent.studentReactions')}
                onChange={(value) => setValue('consultationContent.studentReactions', value, { shouldValidate: true })}
                error={errors.consultationContent?.studentReactions?.message}
                customModules={customModules}
              />
            </div>
          </div>
        </div>

        {/* Consultation Conclusion */}
        <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
          <h2 className="text-xl font-semibold mb-4">Consultation Conclusion</h2>
          <div className="">
            <label className="block font-medium mb-4 pt-16">Counselor Conclusion</label>
            <div className="mb-16">
              <QuillEditor
                value={watch('consultationConclusion.counselorConclusion')}
                onChange={(value) => setValue('consultationConclusion.counselorConclusion', value, { shouldValidate: true })}
                error={errors.consultationConclusion?.counselorConclusion?.message}
                customModules={customModules}
              />
            </div>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.consultationConclusion.followUpNeeded}
                  onChange={() => { }}
                  name="followUpNeeded"
                />
              }
              label="Follow up needed"
            />
            {formData.consultationConclusion.followUpNeeded && (
              <>
                <label className="block font-medium mb-4 pt-16">Follow-up Notes</label>
                <div className="mb-16">
                  <QuillEditor
                    value={watch('consultationConclusion.followUpNotes')}
                    onChange={(value) => setValue('consultationConclusion.followUpNotes', value, { shouldValidate: true })}
                    error={errors.consultationConclusion?.followUpNotes?.message}
                    customModules={customModules}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Intervention */}
        <div style={{ display: activeStep === 3 ? 'block' : 'none' }}>
          <h2 className="text-xl font-semibold mb-4">Intervention</h2>
          <div className="">
            <label className="block font-medium mb-4 pt-16">Intervention Type</label>
            <div className="mb-16">
              <QuillEditor
                value={watch('intervention.type')}
                onChange={(value) => setValue('intervention.type', value, { shouldValidate: true })}
                error={errors.intervention?.type ? (errors.intervention.type as FieldError).message : undefined}
                customModules={customModules}
              />
            </div>

            <label className="block font-medium mb-4 pt-16">Description</label>
            <div className="mb-16">
              <QuillEditor
                value={watch('intervention.description')}
                onChange={(value) => setValue('intervention.description', value, { shouldValidate: true })}
                error={errors.intervention?.description?.message}
                customModules={customModules}
              />
            </div>
          </div>
        </div>

        <Box display="flex" justifyContent="space-between" mt={8}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            color="secondary"
            className="w-96"
          >
            Back
          </Button>
          <div className="flex gap-8">
            <Button variant="outlined" color="secondary"
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
              <Button onClick={handleNext} variant="contained" color="secondary" className="w-96" type="button">
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



