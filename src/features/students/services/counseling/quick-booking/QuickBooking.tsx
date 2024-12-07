import { useSocket } from '@/shared/context';
import { CounselingType, Counselor } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Close, ContactSupport, Female, Handshake, Male, People, PersonPin, School, SentimentVeryDissatisfied } from '@mui/icons-material';
import { Autocomplete, Box, CircularProgress, CircularProgressProps, FormControl, FormControlLabel, IconButton, InputLabel, ListItemButton, Paper, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ContentLoading, NavLinkAdapter } from '@shared/components';
import dayjs from 'dayjs';
import { isEmpty, isError } from 'lodash';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useBookCounselorMutation, useGetCounselorSlotsQuery, useGetCounselorSpecializationsQuery, useGetRandomMatchedCousenlorAcademicMutation, useGetRandomMatchedCousenlorNonAcademicMutation } from '../counseling-api';
import { counselingTypeDescription } from '@/shared/constants';
import { useGetCounselorExpertisesQuery, useGetDepartmentsQuery, useGetMajorsByDepartmentQuery, useGetSpecializationsByMajorQuery } from '@/shared/services';
import { useConfirmDialog } from '@/shared/hooks';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog } from '@/shared/hooks';
import { getApiErrorMessage } from '@shared/store';
import { useGetStudentDocumentQuery } from '@/features/students/students-api';

/**
 * The contact view.
 */

const schema = z.object({
  slotId: z.number().min(1, "Slot is required"),
  slotCode: z.string().min(1, "Slot code is required"),
  date: z.string().min(1, "Counseling date is required"),
  isOnline: z.coerce.boolean().optional(),
  reason: z.string().min(2, "Please enter a valid reason").optional(),
  department: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable().optional(),
  major: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable().optional(),
  specialization: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable().optional(),
  expertise: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable().optional(),
  gender: z.enum(['MALE', 'FEMALE', '']).optional()
});


type FormType = z.infer<typeof schema>;



function QuickBooking() {
  const routeParams = useParams();
  const socket = useSocket()
  const navigate = useNavigate()
  const today = dayjs().format('YYYY-MM-DD');
  const [startOfMonth, setStartOfMonth] = useState(today);
  const [endOfMonth, setEndOfMonth] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const [bookCounselor, { isLoading: isBookingCounselor, isSuccess }] = useBookCounselorMutation()
  const [isGettingRandomMatchedCounselor, setGettingRandomMatchedGender] = useState(false)


  const [randomMatchedCounselor, setRandomMatchedCounselor] = useState<Counselor | null>(null)

  const [counselingType, setCounselingType] = useState<CounselingType>('ACADEMIC');

  const handleCounselingTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCounselingType((event.target as HTMLInputElement).value as CounselingType);
    setValue('specialization', null)
    setValue('expertise', null)
  };

  console.log(counselingType)

  const defaultValues = {
    slotId: 0,
    date: startOfMonth,
    isOnline: true,
  }


  const { control, formState, watch, handleSubmit, setValue, reset } = useForm<FormType>({
    defaultValues,
    resolver: zodResolver(schema)
  });

  const formData = watch();
  const { isValid, dirtyFields, errors } = formState;

  const { data: counselorSlotsData, isLoading: isFetchingCounselorSlots } = useGetCounselorSlotsQuery(formData.date)
  const counselorSlots = counselorSlotsData?.content

  const { data: departmentsData, isFetching: isFetchingDepartments } = useGetDepartmentsQuery();
  const departments = departmentsData || [];

  const { data: majorsData, isFetching: isFetchingMajors } = useGetMajorsByDepartmentQuery(watch("department")?.id.toString(), {
    skip: !watch("department")
  });
  const majors = majorsData || [];

  const { data: specializationsData, isFetching: isFetchingSpecializations } = useGetSpecializationsByMajorQuery(watch("major")?.id.toString(), {
    skip: !watch("major")
  });
  const specializations = specializationsData || [];

  const { data: counselorExpertisesData, isFetching: isFetchingCounselorExpertises } = useGetCounselorExpertisesQuery()
  const expertises = counselorExpertisesData?.content || []
  const dispatch = useAppDispatch()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scroll
    });
  };


  // const { data: counselorData, isLoading } = useGetCounselorQuery(counselorId);
  // const { data: counserDailySlotsData, isFetching: isFetchingCounselorSlots } = useGetCounselorDailyQuery({ counselorId, from: startOfMonth, to: endOfMonth });

  const onSubmitMatching = () => {
    console.log(formData)
    const element = document.getElementById('found_counselor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    navigate('#found_counselor');
    setGettingRandomMatchedGender(true)
    setProgress(20)
    getRandomMatchedCounselor({
      date: formData.date,
      slotId: formData.slotId,
      // expertiseId: formData.expertise?.id,
      // specializationId: formData.specialization?.id,
      departmentId: formData.department.id,
      majorId: formData.major.id,
      gender: formData.gender,
      reason: formData.reason
    })
      .unwrap()
      .then(response => {
        setRandomMatchedCounselor(response?.content)
      })
  }

  const onSubmitBooking = () => {
    useConfirmDialog({
      dispatch,
      title: 'Confirm booking',
      content: `Are you sure to book ${randomMatchedCounselor.profile.fullName} at \n ${formData.slotCode}, ${formData.date}`,
      confirmButtonFunction: () => bookCounselor({
        counselorId: randomMatchedCounselor?.profile.id,
        appointmentRequest: {
          slotCode: formData.slotCode,
          date: formData.date,
          isOnline: formData.isOnline,
          reason: formData.reason,
        }
      })
        .unwrap()
        .then(() => {
          reset();
          setRandomMatchedCounselor(null)
          useAlertDialog({
            dispatch,
            title: 'Booking success',
            // confirmFunction: () => navigate('../')
          })
        })
        .catch(error => {
          useAlertDialog({
            dispatch,
            title: `Booking failed ${getApiErrorMessage(error)}`,
            color: 'error',
          })
        })
    })

  }



  const handleDateChange = (selectedDate) => {
    const previousDate = formData.date
    const currentDate = dayjs(selectedDate).format('YYYY-MM-DD')
    setValue("date", currentDate)
    setValue("slotId", 0)
    setValue("slotCode", '')
  }

  const handleMonthChange = (newMonth) => {
    handleDateChange(newMonth)
    setValue("date", dayjs(newMonth).format('YYYY-MM-DD'))
    setStartOfMonth(newMonth.startOf('month').format('YYYY-MM-DD'));
    setEndOfMonth(newMonth.endOf('month').format('YYYY-MM-DD'));
  };
  console.log(formData)

  const [getRandomMatchedCounselor,
    {
      isLoading: isLoadingRandomMatchedCounselor,
      isSuccess: isSuccessGettingRandomMatchedCounselor,
      isError: isErrorGettingRandomMatchedCounselor,
    }
  ] = counselingType == 'ACADEMIC'
      ? useGetRandomMatchedCousenlorAcademicMutation()
      : useGetRandomMatchedCousenlorNonAcademicMutation()

  // if (isLoading) {
  //   return <ContentLoading className='m-32' />
  // }
  console.log(formData)

  const [progress, setProgress] = useState(20);

  useEffect(() => {
    if (isGettingRandomMatchedCounselor) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setGettingRandomMatchedGender(false)
            clearInterval(timer); // Stop the timer when progress reaches 100
            return 100; // Ensure the progress does not exceed 100
          }
          return prevProgress + 20; // Gradually increase progress by 10
        });
      }, 250); // Update progress every 500ms

      return () => {
        clearInterval(timer); // Cleanup the timer if the component unmounts
      };
    }
  }, [isGettingRandomMatchedCounselor]); // Start the effect when the condition is met

  const { data: studentDocumentData } = useGetStudentDocumentQuery();
  const studentProfile = studentDocumentData?.content.studentProfile

  useEffect(() => {
    reset({
      department: studentProfile?.department,
      major: studentProfile?.major,
    })
  }, [studentDocumentData]);

  return (
    <>
      <div className="container relative flex flex-col flex-auto min-h-screen p-16 mx-auto">
        <Typography variant='h6' color='textSecondary'>We will find the perfect counselor based on your needs and preferences.</Typography>
        <Box className='flex w-full gap-16 mt-8'>
          <div className='w-full'>
            <div className="flex flex-col flex-1 gap-16">
              <Paper className='p-24 shadow'>
                <Typography className='text-lg font-semibold text-primary'>Select counseling type</Typography>
                <FormControl className='w-full'>
                  <RadioGroup
                    aria-labelledby="counselingType"
                    name="controlled-radio-buttons-group"
                    value={counselingType}
                    onChange={handleCounselingTypeChange}
                    className='flex flex-1 pt-16'
                  >
                    <FormControlLabel
                      className='w-full rounded-md hover:bg-primary-main/5'
                      value="ACADEMIC"
                      control={<Radio />}
                      label={
                        <Box display="flex" flexDirection="column" alignItems="flex-start" className="flex-1 w-full p-8">
                          <Box display="flex" alignItems="center">
                            <School fontSize="large" /> {/* Large Icon */}
                            <Typography variant="h6" sx={{ marginLeft: 1 }}>Academic</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {counselingTypeDescription.ACADEMIC}
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      className='w-full rounded-md hover:bg-primary-main/5'
                      value="NON_ACADEMIC"
                      control={<Radio />}
                      label={
                        <Box display="flex" flexDirection="column" alignItems="flex-start" className="flex-1 w-full p-8">
                          <Box display="flex" alignItems="center">
                            <Handshake fontSize="large" /> {/* Large Icon */}
                            <Typography variant="h6" sx={{ marginLeft: 1 }}>Non-academic</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {counselingTypeDescription.NONE_ACADEMIC}
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>
              <Paper className='p-24 shadow'>
                <Typography className='text-lg font-semibold text-primary'>Enter reason</Typography>
                <Controller
                  control={control}
                  name="reason"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-16"
                      label="Reason"
                      placeholder="Enter your reason"
                      multiline
                      rows={8}
                      id="Reason"
                      error={!!errors.reason}
                      helperText={errors?.reason?.message}
                      fullWidth
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </Paper>
              <Paper className='p-24 shadow'>
                <div className='w-fit'>
                  <Typography className='text-lg font-semibold text-primary'>Select date</Typography>
                  <DateCalendar
                    views={['day']}
                    className='w-full'
                    disablePast

                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: '#e67e22'
                      },
                    }}
                    value={dayjs(formData.date)}
                    onChange={handleDateChange}
                    onMonthChange={handleMonthChange}
                  />
                  {
                    errors.date && <Typography color='error' className='mt-4'>{errors?.date?.message}</Typography>
                  }
                </div>


                <div className=''>
                  <Typography className='text-lg font-semibold text-primary'>Select time</Typography>
                  {/* <Typography className='text-primary' >{dayjs(formData.date).format('dddd, MMMM DD, YYYY')}</Typography> */}
                  <div className='flex flex-wrap gap-16 mt-8'>
                    {
                      isFetchingCounselorSlots
                        ? <ContentLoading />
                        : !counselorSlots?.length
                          ? <Typography color='text.secondary'>No available slots</Typography>
                          : counselorSlots
                            .map(slot => (
                              <Tooltip
                                key={slot.slotCode}
                                title={slot.slotCode.split('-').join(" ").concat(slot.myAppointment ? " - You booked this slot" : "")}
                              >
                                <Button
                                  variant={formData.slotId === slot.slotId ? 'contained' : 'outlined'}
                                  disabled={['UNAVAILABLE', 'EXPIRED'].includes(slot.status)}
                                  onClick={() => {
                                    setValue("slotId", slot.slotId)
                                    setValue("slotCode", slot.slotCode)
                                  }}
                                  color='primary'
                                  className='font-normal'
                                >
                                  {dayjs(slot.startTime, 'HH:mm:ss').format('HH:mm')} -  {dayjs(slot.endTime, 'HH:mm:ss').format('HH:mm')}
                                </Button>
                              </Tooltip>
                            ))
                    }
                  </div>
                  {
                    errors.slotId && <Typography color='error' className='mt-8'>{errors?.slotId?.message}</Typography>
                  }
                </div>
              </Paper>

              {
                counselingType === 'ACADEMIC'
                  ? <Paper className='p-24 shadow'>
                    < div className=''>
                      <Typography className='text-lg font-semibold text-primary'>Select Department</Typography>
                      <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            className="mt-16"
                            {...field}
                            options={departments}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, value) => {
                              field.onChange(value); // Update department selection in the form
                              setValue('major', null); // Reset major and specialization
                              setValue('specialization', null);
                            }}
                            value={field.value || null}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Department"
                                variant="outlined"
                                error={!!errors.department}
                                helperText={errors.department?.message}
                              />
                            )}
                          />
                        )}
                      />

                      {/* Major Selection */}
                      <Typography className='mt-16 text-lg font-semibold text-primary'>Select Major</Typography>
                      <Controller
                        name="major"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            className="mt-16"
                            {...field}
                            options={majors}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, value) => {
                              field.onChange(value); // Update major selection in the form
                              setValue('specialization', null); // Reset specialization
                            }}
                            value={field.value || null}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Major"
                                variant="outlined"
                                error={!!errors.major}
                              />
                            )}
                          />
                        )}
                      />

                      {/* Specialization Selection */}
                      {/* <Typography className='mt-16 text-lg font-semibold text-primary'>Select Specialization (optional)</Typography>
                      <Controller
                        name="specialization"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            className="mt-16"
                            {...field}
                            options={specializations}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, value) => field.onChange(value)}
                            value={field.value || null}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Specialization"
                                variant="outlined"
                                error={!!errors.specialization}
                              />
                            )}
                          />
                        )}
                      /> */}
                    </div>
                  </Paper>
                  : < div className=''>
                    {/* <Typography className='text-lg font-semibold text-primary'>Select counselor's expertise (optional)</Typography>
                    <Controller
                      name="expertise"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={expertises}
                          className='mt-16'
                          getOptionLabel={(option) => option.name}
                          onChange={(_, value) => field.onChange(value)}
                          value={field.value || null}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Expertise "
                              variant="outlined"
                              error={!!errors.expertise}
                            />
                          )}
                        />
                      )}
                    /> */}
                  </div>
              }

              <Paper className='p-32 pb-16 shadow'>
                <Typography className='text-lg font-semibold text-primary'>Select couselor's gender (optional)</Typography>
                <div className="mt-8">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-8">
                        {/* Male Icon */}
                        <Tooltip title="Male">
                          <IconButton
                            onClick={() => {
                              setSelectedGender('MALE');
                              field.onChange('MALE');
                            }}
                            sx={{
                              border: selectedGender === 'MALE' ? '2px solid #1976d2' : 'none',
                              borderRadius: '50%', // Keep the border round
                            }}
                          >
                            <Male className="text-blue-500" fontSize="large" />
                          </IconButton>
                        </Tooltip>

                        {/* Female Icon */}
                        <Tooltip title="Female">
                          <IconButton
                            onClick={() => {
                              setSelectedGender('FEMALE');
                              field.onChange('FEMALE');
                            }}
                            sx={{
                              border: selectedGender === 'FEMALE' ? '2px solid #d32f2f' : 'none',
                              borderRadius: '50%',
                            }}
                          >
                            <Female className="text-pink-500" fontSize="large" />
                          </IconButton>
                        </Tooltip>

                        {/* Clear Button */}
                        <div className='flex justify-end flex-1'>
                          {
                            selectedGender &&
                            <Tooltip title="Clear gender selection">
                              <IconButton
                                onClick={() => {
                                  setSelectedGender(''); // Clear the selected gender
                                  field.onChange(''); // Update the form state
                                }}
                                sx={{
                                  borderRadius: '50%',
                                }}
                              >
                                <Close /> {/* X Icon for Clear */}
                              </IconButton>
                            </Tooltip>
                          }

                        </div>

                      </div>
                    )}
                  />
                  {errors.gender && (
                    <p className="mt-2 text-red-500">{errors.gender.message}</p>
                  )}
                </div>
              </Paper>

              <div className='flex self-end justify-end gap-16 w-md'>
                <Button variant='outlined'
                  size='large'
                  className='w-1/5 text-lg'
                  onClick={() => reset()}
                >
                  Reset
                </Button>
                <Button
                  size='large'
                  variant='contained'
                  fullWidth
                  color='secondary'
                  className='w-4/5 py-12 text-lg'
                  onClick={handleSubmit(onSubmitMatching)}
                  disabled={isLoadingRandomMatchedCounselor}
                  component="a" href={`#found_counselor`}
                >
                  Find my counselor
                </Button>
              </div>

            </div>

          </div >
          <Paper className='shadow w-lg' id={'found_counselor'}>
            <div className='p-32'>
              <div className=''>
                {
                  isErrorGettingRandomMatchedCounselor ?
                    <Box className="flex flex-col items-center w-full">
                      <SentimentVeryDissatisfied className='size-224 text-text-disabled' />
                      <Typography className='text-2xl text-text-disabled'>No counselor matched!</Typography>
                      <div className='text-2xl text-text-disabled'>You can view more counselors at Counselor list
                      </div>
                    </Box>
                    : randomMatchedCounselor
                      ?
                      progress < 100 || isLoadingRandomMatchedCounselor
                        ? <div className='flex flex-col items-center gap-16'>
                          <Typography color='secondary' className='text-lg font-semibold text-center'>Matching the most suitable counselor for you.</Typography>
                          <CircularProgressWithLabel value={progress} />
                        </div>
                        : <div>
                          <Typography color='secondary' className='text-lg font-semibold text-center'>Best counselor that fits your criteria.</Typography>
                          <Tooltip title={`View ${randomMatchedCounselor.profile.fullName}'s profile`} className='mt-16'>
                            <ListItemButton
                              component={NavLinkAdapter}
                              to={`counselor/${randomMatchedCounselor.profile.id}`}
                              className='w-full rounded '
                            >
                              <div className='flex flex-col items-center w-full'>
                                <Avatar
                                  className='border-2 size-96 '
                                  alt={randomMatchedCounselor.profile.fullName}
                                  src={randomMatchedCounselor.profile.avatarLink}
                                />
                                <div className='mt-8 text-center'>
                                  <Typography className='font-semibold text-primary-main text-18'>{randomMatchedCounselor.profile.fullName}</Typography>
                                  <Typography className='text-16' color='text.secondary'>{randomMatchedCounselor.expertise?.name || randomMatchedCounselor.specialization?.name}</Typography>
                                </div>
                              </div>
                              <ChevronRight />
                            </ListItemButton>
                          </Tooltip>


                          <div className='px-16'>
                            <Divider className='mt-16' />
                            <Typography className='mt-16 text-lg font-semibold text-primary'>Meeting Type</Typography>

                            <Controller
                              name="isOnline"
                              control={control}
                              render={({ field }) => (
                                <FormControl
                                >
                                  <RadioGroup
                                    {...field}
                                    className="Settings-group"
                                    row
                                  >
                                    <FormControlLabel
                                      value={true}
                                      control={<Radio />}
                                      label="Online"
                                    />
                                    <FormControlLabel
                                      value={false}
                                      control={<Radio />}
                                      label="Offline"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              )}
                            />
                          </div>

                          <div className='flex justify-center px-32 mt-24'>
                            <Button
                              variant='contained'
                              color='secondary'
                              className='w-full'
                              disabled={!isValid || isBookingCounselor || !formData.reason}
                              onClick={handleSubmit(onSubmitBooking)}>
                              Confirm booking
                            </Button>
                          </div>

                        </div>
                      : <div className='flex flex-col items-center w-full'>
                        <Typography color='textDisabled'>Select your preferences and matched couselor will be showed.</Typography>
                        <PersonPin className='size-224 text-text-disabled' />
                      </div>
                }

              </div>
            </div>
          </Paper>
        </Box>
      </div >
    </>
  );
}

export default QuickBooking;


function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  const displayedText = {
    '0': 'Finding your couselor...',
    '20': 'Matching gender...',
    '40': 'Matching date time...',
    '60': 'Matching expertise...',
    '80': 'Finding your couselor...',
    '100': 'Finding your couselor...',
  }
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100} // Always 100 to act as the background circle
        size={200} // Same size as the actual progress indicator
        sx={{
          color: 'background.default', // You can change the color or use theme colors
          position: 'absolute', // Make it sit behind the progress indicator
          left: 0,
          top: 0,
        }}
        thickness={4} // Thickness of the background circle
      />
      <CircularProgress
        variant="determinate"
        {...props}
        size={200}
        color='secondary'
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className='flex flex-col justify-center'>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary' }}
          >{`${displayedText[props.value]}`}</Typography>
          <Typography
            variant="caption"
            component="div"
            className='p-8 text-lg text-center'
            sx={{ color: 'text.secondary' }}
          >{`${Math.round(props.value)}%`}</Typography>
        </div>
      </Box>
    </Box>
  );
}