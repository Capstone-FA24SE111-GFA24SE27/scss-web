import React, { useState, MouseEvent, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stepper, Step, StepLabel, Box, Paper, Dialog } from '@mui/material';
import 'tailwindcss/tailwind.css';
import { Heading, closeDialog } from '@/shared/components';
import { useDispatch } from 'react-redux';
import { useCreateStudentDocumentMutation, useEditStudentDocumentMutation, useGetStudentDocumentQuery } from '../../students-api';

// Zod Schema Validation
const schema = z.object({
  introduction: z.string().nullable().optional(),
  currentHealthStatus: z.string().nullable().optional(),
  psychologicalStatus: z.string().nullable().optional(),
  stressFactors: z.string().nullable().optional(),
  academicDifficulties: z.string().nullable().optional(),
  studyPlan: z.string().nullable().optional(),
  careerGoals: z.string().nullable().optional(),
  partTimeExperience: z.string().nullable().optional(),
  internshipProgram: z.string().nullable().optional(),
  extracurricularActivities: z.string().nullable().optional(),
  personalInterests: z.string().nullable().optional(),
  socialRelationships: z.string().nullable().optional(),
  financialSituation: z.string().nullable().optional(),
  financialSupport: z.string().nullable().optional(),
  desiredCounselingFields: z.string().nullable().optional(),
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

interface StudentDocumentProps {
  editMode?: boolean;
}

const StudentDocument: React.FC<StudentDocumentProps> = ({ editMode = false }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const [createStudentCounselingDocument, { isLoading: isLoadingCreateStudentCounselingDocument }] = useCreateStudentDocumentMutation();
  const [editStudentCounselingDocument, { isLoading: isLoadingEditStudentCounselingDocument }] = useEditStudentDocumentMutation();

  // Fetch student document if in edit mode
  const { data: studentDocumentData } = useGetStudentDocumentQuery();
  const studentDocument = studentDocumentData?.content?.counselingProfile

  useEffect(() => {
    if (editMode && studentDocumentData) {
      reset(studentDocument); // Reset form with fetched data
    }
  }, [editMode, studentDocumentData, reset]);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  const onSubmit = (data: FormData) => {
    if (activeStep === steps.length - 1) {
      if (editMode) {
        editStudentCounselingDocument(data)
          .unwrap()
          .then(() => {
            dispatch(closeDialog());
          });
        return;
      }
      createStudentCounselingDocument(data)
        .unwrap()
        .then(() => {
          dispatch(closeDialog());
        });
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Dialog
      maxWidth="md"
      open
      onClose={(event, reason: string) => {
        if (reason === "backdropClick") {
          return;
        }
        dispatch(closeDialog());
      }}
    >
      <Paper className='p-16 shadow h-md'>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
          <div className='flex flex-col gap-16'>
            <Heading
              title={editMode ? `Edit Counseling Profile` : `Fill Counseling Profile`}
              description='This will help counselors to know you better'
              className='p-16'
            />
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step
                  key={index}
                  onClick={() => handleStep(index)}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box className="mt-16">
              {activeStep === 0 && (
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
              )}

              {activeStep === 1 && (
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
              )}

              {activeStep === 2 && (
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
              )}

              {activeStep === 3 && (
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
              )}

              {activeStep === 4 && (
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
              )}

              {activeStep === 5 && (
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
              )}
            </Box>
          </div>
          {/* Step content */}
          <div className='mt-4 flex justify-between'>
            <Button onClick={() => dispatch(closeDialog())}>
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
    </Dialog>
  );
};

export default StudentDocument;
