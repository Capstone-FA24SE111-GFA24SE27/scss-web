import React, { useState, MouseEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stepper, Step, StepLabel, Box, Paper } from '@mui/material';
import 'tailwindcss/tailwind.css';
import { Heading, closeDialog } from '@/shared/components';
import { useDispatch } from 'react-redux';
import { useCreateStudentDocumentMutation } from '../students-api';

// Zod Schema Validation
const schema = z.object({
  introduction: z.string().min(1, 'Introduction is required'),
  currentHealthStatus: z.string().min(1, 'Current Health Status is required'),
  psychologicalStatus: z.string().min(1, 'Psychological Status is required'),
  stressFactors: z.string().min(1, 'Stress Factors are required'),
  academicDifficulties: z.string().min(1, 'Academic Difficulties are required'),
  studyPlan: z.string().min(1, 'Study Plan is required'),
  careerGoals: z.string().min(1, 'Career Goals are required'),
  partTimeExperience: z.string().min(1, 'Part-Time Experience is required'),
  internshipProgram: z.string().min(1, 'Internship Program is required'),
  extracurricularActivities: z.string().min(1, 'Extracurricular Activities are required'),
  personalInterests: z.string().min(1, 'Personal Interests are required'),
  socialRelationships: z.string().min(1, 'Social Relationships are required'),
  financialSituation: z.string().min(1, 'Financial Situation is required'),
  financialSupport: z.string().min(1, 'Financial Support is required'),
  desiredCounselingFields: z.string().min(1, 'Desired Counseling Fields are required'),
});

type FormData = Required<z.infer<typeof schema>>;

const steps = [
  'Psychological and Health Status',
  'Academic Information',
  'Career Information',
  'Activities and Lifestyle',
  'Financial Support',
  'Counseling Requests'
];

const FormStepper = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [createStudentCounselingDocument, { isLoading: isLoadingCreateStudentCounselingDocument }] = useCreateStudentDocumentMutation()

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const onSubmit = (data: FormData) => {
    if (activeStep === steps.length - 1) {
      createStudentCounselingDocument(data)
        .unwrap()
        .then(() => {
          dispatch(closeDialog())
        })
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Controller
              name="introduction"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Introduction"
                  variant="outlined"
                  fullWidth
                  error={!!errors.introduction}
                  helperText={errors.introduction?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="currentHealthStatus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current Health Status"
                  variant="outlined"
                  fullWidth
                  error={!!errors.currentHealthStatus}
                  helperText={errors.currentHealthStatus?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="psychologicalStatus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Psychological Status"
                  variant="outlined"
                  fullWidth
                  error={!!errors.psychologicalStatus}
                  helperText={errors.psychologicalStatus?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="stressFactors"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stress Factors"
                  variant="outlined"
                  fullWidth
                  error={!!errors.stressFactors}
                  helperText={errors.stressFactors?.message}
                  className="mt-16"
                />
              )}
            />
          </>
        );
      case 1:
        return (
          <>
            <Controller
              name="academicDifficulties"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Academic Difficulties"
                  variant="outlined"
                  fullWidth
                  error={!!errors.academicDifficulties}
                  helperText={errors.academicDifficulties?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="studyPlan"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Study Plan"
                  variant="outlined"
                  fullWidth
                  error={!!errors.studyPlan}
                  helperText={errors.studyPlan?.message}
                  className="mt-16"
                />
              )}
            />
          </>
        );
      case 2:
        return (
          <>
            <Controller
              name="careerGoals"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Career Goals"
                  variant="outlined"
                  fullWidth
                  error={!!errors.careerGoals}
                  helperText={errors.careerGoals?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="partTimeExperience"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Part-Time Experience"
                  variant="outlined"
                  fullWidth
                  error={!!errors.partTimeExperience}
                  helperText={errors.partTimeExperience?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="internshipProgram"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Internship Program"
                  variant="outlined"
                  fullWidth
                  error={!!errors.internshipProgram}
                  helperText={errors.internshipProgram?.message}
                  className="mt-16"
                />
              )}
            />
          </>
        );
      case 3:
        return (
          <>
            <Controller
              name="extracurricularActivities"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Extracurricular Activities"
                  variant="outlined"
                  fullWidth
                  error={!!errors.extracurricularActivities}
                  helperText={errors.extracurricularActivities?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="personalInterests"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Personal Interests"
                  variant="outlined"
                  fullWidth
                  error={!!errors.personalInterests}
                  helperText={errors.personalInterests?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="socialRelationships"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Social Relationships"
                  variant="outlined"
                  fullWidth
                  error={!!errors.socialRelationships}
                  helperText={errors.socialRelationships?.message}
                  className="mt-16"
                />
              )}
            />
          </>
        );
      case 4:
        return (
          <>
            <Controller
              name="financialSituation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Financial Situation"
                  variant="outlined"
                  fullWidth
                  error={!!errors.financialSituation}
                  helperText={errors.financialSituation?.message}
                  className="mt-16"
                />
              )}
            />
            <Controller
              name="financialSupport"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Financial Support"
                  variant="outlined"
                  fullWidth
                  error={!!errors.financialSupport}
                  helperText={errors.financialSupport?.message}
                  className="mt-16"
                />
              )}
            />
          </>
        );
      case 5:
        return (
          <>
            <Controller
              name="desiredCounselingFields"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Desired Counseling Fields"
                  variant="outlined"
                  fullWidth
                  error={!!errors.desiredCounselingFields}
                  helperText={errors.desiredCounselingFields?.message}
                  className="mt-16"
                />
              )}
            />
          </>
        );
      default:
        return 'Unknown Step';
    }
  };

  const dispatch = useDispatch()

  return (
    <Paper className='p-16 shadow h-md'>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
        {/* Stepper for showing the current step */}
        <div className='flex flex-col gap-16'>
          <Heading
            title='Fill Counseling Profile'
            description='This will help counselors to know you better'
            className='p-16'
          />
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box className="mt-16">
            {/* Step 0 */}
            <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
              <Controller
                name="introduction"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Introduction"
                    variant="outlined"
                    fullWidth
                    error={!!errors.introduction}
                    helperText={errors.introduction?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="currentHealthStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Current Health Status"
                    variant="outlined"
                    fullWidth
                    error={!!errors.currentHealthStatus}
                    helperText={errors.currentHealthStatus?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="psychologicalStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Psychological Status"
                    variant="outlined"
                    fullWidth
                    error={!!errors.psychologicalStatus}
                    helperText={errors.psychologicalStatus?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="stressFactors"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Stress Factors"
                    variant="outlined"
                    fullWidth
                    error={!!errors.stressFactors}
                    helperText={errors.stressFactors?.message}
                    className="mt-16"
                  />
                )}
              />
            </div>

            {/* Step 1 */}
            <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
              <Controller
                name="academicDifficulties"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Academic Difficulties"
                    variant="outlined"
                    fullWidth
                    error={!!errors.academicDifficulties}
                    helperText={errors.academicDifficulties?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="studyPlan"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Study Plan"
                    variant="outlined"
                    fullWidth
                    error={!!errors.studyPlan}
                    helperText={errors.studyPlan?.message}
                    className="mt-16"
                  />
                )}
              />
            </div>

            {/* Step 2 */}
            <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
              <Controller
                name="careerGoals"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Career Goals"
                    variant="outlined"
                    fullWidth
                    error={!!errors.careerGoals}
                    helperText={errors.careerGoals?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="partTimeExperience"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Part-Time Experience"
                    variant="outlined"
                    fullWidth
                    error={!!errors.partTimeExperience}
                    helperText={errors.partTimeExperience?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="internshipProgram"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Internship Program"
                    variant="outlined"
                    fullWidth
                    error={!!errors.internshipProgram}
                    helperText={errors.internshipProgram?.message}
                    className="mt-16"
                  />
                )}
              />
            </div>

            {/* Step 3 */}
            <div style={{ display: activeStep === 3 ? 'block' : 'none' }}>
              <Controller
                name="extracurricularActivities"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Extracurricular Activities"
                    variant="outlined"
                    fullWidth
                    error={!!errors.extracurricularActivities}
                    helperText={errors.extracurricularActivities?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="personalInterests"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Personal Interests"
                    variant="outlined"
                    fullWidth
                    error={!!errors.personalInterests}
                    helperText={errors.personalInterests?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="socialRelationships"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Social Relationships"
                    variant="outlined"
                    fullWidth
                    error={!!errors.socialRelationships}
                    helperText={errors.socialRelationships?.message}
                    className="mt-16"
                  />
                )}
              />
            </div>

            {/* Step 4 */}
            <div style={{ display: activeStep === 4 ? 'block' : 'none' }}>
              <Controller
                name="financialSituation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Financial Situation"
                    variant="outlined"
                    fullWidth
                    error={!!errors.financialSituation}
                    helperText={errors.financialSituation?.message}
                    className="mt-16"
                  />
                )}
              />
              <Controller
                name="financialSupport"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Financial Support"
                    variant="outlined"
                    fullWidth
                    error={!!errors.financialSupport}
                    helperText={errors.financialSupport?.message}
                    className="mt-16"
                  />
                )}
              />
            </div>

            {/* Step 5 */}
            <div style={{ display: activeStep === 5 ? 'block' : 'none' }}>
              <Controller
                name="desiredCounselingFields"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Desired Counseling Fields"
                    variant="outlined"
                    fullWidth
                    error={!!errors.desiredCounselingFields}
                    helperText={errors.desiredCounselingFields?.message}
                    className="mt-16"
                  />
                )}
              />
            </div>
          </Box>
        </div>
        {/* Step content */}
        <div className='mt-4 flex justify-between'>
          <Button onClick={() => dispatch(
            closeDialog()
          )}>
            Skip for now
          </Button>
          <div className="">
            <Button disabled={activeStep === 0 || isLoadingCreateStudentCounselingDocument} onClick={handleBack} color='secondary'>
              Back
            </Button>
            {isLastStep ? (
              <Button variant="contained" type="submit" color='secondary' disabled={isLoadingCreateStudentCounselingDocument}>
                Submit
              </Button>
            ) : (
              <Button variant="outlined" type='button' onClick={handleNext} color='secondary'>
                Next
              </Button>
            )}
          </div>
        </div>
      </form>
    </Paper>

  );
};

export default FormStepper;
