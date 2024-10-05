import Button from '@mui/material/Button';
import { Breadcrumbs, ContentLoading, NavLinkAdapter } from '@shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { CakeOutlined, ChevronRight, Close, EmailOutlined, Female, LocalPhoneOutlined, Male, NotesOutlined, Transgender } from '@mui/icons-material';
import { Autocomplete, Box, CircularProgress, CircularProgressProps, FormControl, FormControlLabel, FormLabel, IconButton, ListItemButton, Radio, RadioGroup, Rating, SvgIcon, TextField, Tooltip } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Slot, useGetCounselorQuery, AppointmentRequest, useBookCounselorMutation, GetCounselorsDailySlotsResponse, GetCounselorsDailySlotsArg, DailySlot, AppointmentStatus, useGetCounselorSlotsQuery, useGetCounselorExpertisesQuery, Counselor, useGetRandomMatchedCousenlorMutation } from '../counseling-api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { useSocket } from '@/shared/context';
import { useEffect } from 'react'
import { apiService, useAppDispatch } from '@shared/store'

/**
 * The contact view.
 */

const schema = z.object({
  slotId: z.number().min(1, "Slot is required"),
  date: z.string().min(1, "Counseling date is required"),
  isOnline: z.coerce.boolean().optional(),
  reason: z.string().min(2, "Please enter a valid reason").optional(),
  expertise: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional()
});


type FormType = z.infer<typeof schema>;



function QuickBooking() {
  const routeParams = useParams();
  const socket = useSocket()
  const { id: counselorId } = routeParams as { id: string };
  const navigate = useNavigate()
  const today = dayjs().format('YYYY-MM-DD');
  const [startOfMonth, setStartOfMonth] = useState(today);
  const [endOfMonth, setEndOfMonth] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const [bookCounselor, { isLoading: isBookingCounselor, isSuccess }] = useBookCounselorMutation()

  const [getCounselorRandomMatch, { isLoading: isGettingRandomMatchedCounselor, isSuccess: isSuccessGettingRandomMatchedCounselor }] =
    useGetRandomMatchedCousenlorMutation()


  const [randomMatchedCounselor, setRandomMatchedCounselor] = useState<Counselor>()


  const defaultValues = {
    slotId: 0,
    date: startOfMonth,
    // isOnline: true,
    // reason: "",
  }

  const { control, formState, watch, handleSubmit, setValue } = useForm<FormType>({
    defaultValues,
    resolver: zodResolver(schema)
  });

  const formData = watch();
  const { isValid, dirtyFields, errors } = formState;

  const { data: counselorSlotsData, isLoading: isFetchingCounselorSlots } = useGetCounselorSlotsQuery(formData.date)
  const counselorSlots = counselorSlotsData?.content


  const { data: counselorExpertisesData, isLoading: isFetchingCounselorExpertises } = useGetCounselorExpertisesQuery()
  const counselorExpertises = counselorExpertisesData?.content || []




  // const { data: counselorData, isLoading } = useGetCounselorQuery(counselorId);
  // const { data: counserDailySlotsData, isFetching: isFetchingCounselorSlots } = useGetCounselorDailyQuery({ counselorId, from: startOfMonth, to: endOfMonth });

  const onSubmit = () => {
    getCounselorRandomMatch({
      date: formData.date,
      slotId: formData.slotId,
      expertiseId: formData.expertise?.id,
      gender: formData.gender,
    })
      .unwrap()
      .then(response => setRandomMatchedCounselor(response?.content))

  }

  const handleDateChange = (selectedDate) => {
    const previousDate = formData.date
    const currentDate = dayjs(selectedDate).format('YYYY-MM-DD')
    // socket?.off(`/user/${previousDate}/${counselorId}/slot`);

    // socket?.on(`/user/${currentDate}/${counselorId}/slot`, (slotsMessage: SlotsMessage) => {
    //   console.log("Slots Message", slotsMessage)
    //   if (!slotsMessage) {
    //     return
    //   }
    //   setCounselorSlots(previousSlots => ({
    //     ...previousSlots,
    //     [slotsMessage.dateChange]: (previousSlots[slotsMessage.dateChange]).map((slot) =>
    //       slot.slotId === slotsMessage.slotId
    //         ? { ...slot, status: slotsMessage.newStatus }
    //         : slot
    //     )
    //   }));
    // })

    setValue("date", currentDate)
    setValue("slotId", 0)
  }

  const handleMonthChange = (newMonth) => {
    handleDateChange(newMonth)
    setValue("date", dayjs(newMonth).format('YYYY-MM-DD'))
    setStartOfMonth(newMonth.startOf('month').format('YYYY-MM-DD'));
    setEndOfMonth(newMonth.endOf('month').format('YYYY-MM-DD'));
  };


  // if (isLoading) {
  //   return <ContentLoading className='m-32' />
  // }

  // const [progress, setProgress] = useState(10);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <>
      <div className="relative flex flex-col flex-auto p-32 bg-background-paper gap-16 min-h-screen">
        <Typography variant='h6' color='textSecondary'>We will find the perfect counselor based on your needs and preferences.</Typography>
        <div className='flex'>

          <div className="flex flex-1 flex-col gap-4">
            <div className='w-fit'>
              <Typography className='font-semibold text-primary text-lg'>Select date</Typography>
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
              <Typography className='font-semibold text-primary text-lg'>Select time</Typography>
              {/* <Typography className='text-primary' >{dayjs(formData.date).format('dddd, MMMM DD, YYYY')}</Typography> */}
              <div className='flex flex-wrap gap-16 mt-8'>
                {
                  isFetchingCounselorSlots
                    ? <ContentLoading />
                    : !counselorSlots.length
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
                              onClick={() => setValue("slotId", slot.slotId)}
                              color='primary'
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

            <Divider className='mt-32' />

            <div className='mt-16'>
              <Typography className='font-semibold text-primary text-lg'>Select counselor's expertise (optional)</Typography>
              <Controller
                name="expertise"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={counselorExpertises}
                    className='mt-16'
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => field.onChange(value)}
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
              />
            </div>

            <div className='mt-32'>
              <Typography className='font-semibold text-primary text-lg'>Select couselor's gender (optional)</Typography>
              <div className="mt-8">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-8 items-center">
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
                      <div className='flex-1 flex justify-end'>
                        {
                          selectedGender &&
                          <Tooltip title="Clear gender selection">
                            <IconButton
                              onClick={() => {
                                setSelectedGender(null); // Clear the selected gender
                                field.onChange(null); // Update the form state
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
                  <p className="text-red-500 mt-2">{errors.gender.message}</p>
                )}
              </div>
            </div>

            <Divider className='mt-16' />

          </div>

          <div className='flex-1'>
            <div className=''>
              <Button
                size='large'
                variant='contained' color='secondary'
                onClick={handleSubmit(onSubmit)}
              >
                Match me with a counselor that fits my criteria.
              </Button>
              {
                randomMatchedCounselor && (
                  <div>

                    <Tooltip title={`View ${randomMatchedCounselor.profile.fullName}'s profile`}>
                      <ListItemButton
                        component={NavLinkAdapter}
                        to={`${randomMatchedCounselor.profile.id}`}
                        className='bg-primary-main/10 w-full rounded'
                      >
                        <div className='w-full flex'>
                          <Avatar
                            alt={randomMatchedCounselor.profile.fullName}
                            src={randomMatchedCounselor.profile.avatarLink}
                          />
                          <div className='ml-16'>
                            <Typography className='font-semibold text-primary-main'>{randomMatchedCounselor.profile.fullName}</Typography>
                            <Typography color='text.secondary'>{randomMatchedCounselor.email || 'counselor@fpt.edu.vn'}</Typography>
                          </div>
                        </div>
                        <ChevronRight />
                      </ListItemButton>
                    </Tooltip>

                    <Divider />


                    <div className='px-32'>
                      <Typography className='font-semibold text-primary text-lg'>Meeting Type</Typography>
                      {/* <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <div className='flex gap-16'>
                                    <FormControlLabel value="female" control={<Radio />} label="Online" />
                                    <FormControlLabel value="male" control={<Radio />} label="Offline" />
                                </div>
                            </RadioGroup>
                        </FormControl> */}
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

                    <Divider className="mt-16 " />

                    <div className='px-32'>
                      {/* <TextField
                            label=" for counseling"
                            multiline
                            rows={4}
                            defaultValue=""
                            className='mt-16 w-full'
                        /> */}
                      <Controller
                        control={control}
                        name="reason"
                        render={({ field }) => (
                          <TextField
                            className="mt-16"
                            {...field}
                            label="Reason"
                            placeholder="Reason"
                            multiline
                            rows={5}
                            id="Reason"
                            error={!!errors.reason}
                            helperText={errors?.reason?.message}
                            fullWidth

                          />
                        )}
                      />
                    </div>

                  </div>

                )
              }


            </div>
            {/* <CircularProgressWithLabel value={progress} />; */}
          </div>
        </div>
      </div>
    </>
  );
}

export default QuickBooking;


function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
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
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}