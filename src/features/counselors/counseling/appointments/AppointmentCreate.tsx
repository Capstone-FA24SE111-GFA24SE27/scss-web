import { useSocket } from '@/shared/context';
import { AppointmentSlotStatus, DailySlot } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormControlLabel, Paper, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Breadcrumbs, ContentLoading, NavLinkAdapter, UserLabel } from '@shared/components';
import { getApiErrorMessage, selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import dayjs from 'dayjs';
import { useEffect, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useCreateAppointmentMutation, useGetStudentByCodeQuery, useGetStudentDetailQuery } from '@shared/pages';
import { useGetCounselorDailySlotsQuery } from '@/features/students/services/counseling/counseling-api';
import { navigateUp } from '@/shared/utils';
import { ArrowBack } from '@mui/icons-material';
import { debounce } from 'lodash';
import { openStudentView } from '../../counselors-layout-slice';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';

/**
 * The contact view.
 */

const schema = z.object({
  studentCode: z.string().min(1, "Student code is required"),
  slotCode: z.string().min(1, "Slot code is required"),
  date: z.string().min(1),
  isOnline: z.coerce.boolean(),
  reason: z.string().min(2, "Please enter a valid reason"),
});



type SlotsMessage = {
  dateChange: string,
  newStatus: AppointmentSlotStatus,
  slotId: number,
  studentId: number
}

type FormType = Required<z.infer<typeof schema>>;



function AppointmentCreate() {
  const account = useAppSelector(selectAccount)
  const routeParams = useParams();
  const socket = useSocket()
  const counselorId = account?.id
  const today = dayjs().format('YYYY-MM-DD');
  // const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');
  // const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [startOfMonth, setStartOfMonth] = useState(today);
  const [endOfMonth, setEndOfMonth] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [counselorDailySlots, setCounselorDailySlots] = useState<DailySlot>()
  const [meetURL, setMeetURL] = useState('')
  const [address, setAddress] = useState('')
  const [debouncedStudentCode, setDebouncedStudentCode] = useState("");
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [bookCounselor, { isLoading: isBookingCounselor, isSuccess }] = useCreateAppointmentMutation()
  const defaultValues = {
    studentCode: "",
    slotCode: "",
    date: startOfMonth,
    isOnline: `true`,
    reason: "",
  }

  const { control, formState, watch, handleSubmit, setValue } = useForm<FormType>({
    // @ts-ignore
    defaultValues,
    resolver: zodResolver(schema)
  });
  const formData = watch();


  const { data: studentData, isFetching: isGettingStudentByCode, isSuccess: isSuccessGetStudentByCode, isError: isErrorGetStudentByCode } = useGetStudentByCodeQuery(debouncedStudentCode, {
    skip: !formData.studentCode
  })

  console.log(isErrorGetStudentByCode, `Student---------------------`)

  const { isValid, dirtyFields, errors } = formState;

  const handleDebouncedStudentCode = useCallback(
    debounce((value) => {
      setDebouncedStudentCode(value);
    }, 1000),
    []
  );

  const { data: counselorDailySlotsData, isFetching: isFetchingCounselorDailySlots } = useGetCounselorDailySlotsQuery({ counselorId: counselorId?.toString(), from: startOfMonth, to: endOfMonth });

  const counselor = account
  const student = studentData?.content

  const location = useLocation();

  const onSubmit = () => {
    useConfirmDialog({
      dispatch,
      title: 'Confirm booking',
      content: `Are you sure to book ${counselor.profile.fullName} at \n ${formData.slotCode}, ${formData.date}`,
      confirmButtonFunction: () => bookCounselor({
        studentId: student?.id.toString(),
        body: {
          ...formData,
          meetURL,
          address,
        }
      })
        .unwrap()
        .then(() => {
          useAlertDialog({
            dispatch,
            title: 'Booking success',
            confirmFunction: () => navigate(-1)
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

    console.log(`/user/${currentDate}/${counselorId}/slot`)

    socket?.off(`/user/${previousDate}/${counselorId}/slot`);

    socket?.on(`/user/${currentDate}/${counselorId}/slot`, (slotsMessage: SlotsMessage) => {
      console.log("Slots Message", slotsMessage)
      if (!slotsMessage) {
        return
      }
      setCounselorDailySlots(previousSlots => ({
        ...previousSlots,
        [slotsMessage.dateChange]: (previousSlots[slotsMessage.dateChange]).map((slot) =>
          slot.slotId === slotsMessage.slotId
            ? { ...slot, status: slotsMessage.newStatus }
            : slot
        )
      }));
    })

    setValue("date", currentDate)
    // setValue("slotCode", '')
    setValue("slotCode", '')
  }

  const handleMonthChange = (newMonth) => {
    handleDateChange(newMonth)
    setValue("date", dayjs(newMonth).format('YYYY-MM-DD'))
    setStartOfMonth(newMonth.startOf('month').format('YYYY-MM-DD'));
    setEndOfMonth(newMonth.endOf('month').format('YYYY-MM-DD'));
  };


  useEffect(() => {

    if (socket) {
      socket.on(`/user/${today}/${counselorId}/slot`, (data) => {
        console.log("Socket counselor booking", data)
      })
    }

    return () => {
      socket?.off(`/user/${formData.date}/${counselorId}/slot`);
    };
  }, [socket]);


  useEffect(() => {
    if (counselorDailySlotsData) {
      setCounselorDailySlots(counselorDailySlotsData.content);
    }
  }, [counselorDailySlotsData]);

  // if (isLoading) {
  //   return <ContentLoading className='m-32' />
  // }

  if (!counselor) {
    return <div className='relative p-48'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid counselor!
      </Typography>
    </div>
  }


  return (
    <div className="container flex flex-col items-center p-32">
      <div className="flex flex-col w-full max-w-4xl">
        <div className="">
          <Button
            component={NavLinkAdapter}
            to="/counseling/appointments"
            startIcon={<ArrowBack />}
          >
            Back to appointment list
          </Button>
        </div>
        <div className="mt-8 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Create an appointment
        </div>
        <Paper className="container flex flex-col flex-auto gap-32 p-32 mt-32">
          <div className="">
            <Typography className="text-2xl font-bold tracking-tight">Submit your appointment</Typography>
            <Typography color="text.secondary">
              The appointment will be automatically added to your schedule
            </Typography>
          </div>
          <div className="flex flex-col w-full gap-16">
            <div className='flex flex-col items-center gap-16'>
              <Controller
                control={control}
                name="studentCode"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Student Code"
                    placeholder="SE110011"
                    id="studentCode"
                    error={!!errors.studentCode}
                    helperText={errors?.studentCode?.message}
                    fullWidth
                    onChange={(event) => {
                      field.onChange(event);
                      handleDebouncedStudentCode(event.target.value);
                    }}
                  />
                )}
              />
              <div className='w-full'>
                {
                  isGettingStudentByCode
                    ? <Typography>Loading...</Typography>
                    : student && formData.studentCode && !isErrorGetStudentByCode
                      ? <UserLabel
                        label='Found student:  '
                        profile={student.profile}
                        onClick={() => dispatch(
                          openStudentView(student.id.toString())
                        )}
                      />
                      : <Typography color='textSecondary' className='text-sm'>Student not found</Typography>
                }

              </div>
            </div>

            <div>
              <Typography className='text-lg font-semibold text-primary'>Counseling Date</Typography>
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
            </div>

            <div className=''>
              <Typography className='text-lg font-semibold text-primary'>Available slots</Typography>
              <Typography className='text-primary' >{dayjs(formData.date).format('dddd, MMMM DD, YYYY')}</Typography>
              <div className='flex flex-wrap gap-16 mt-16'>
                {
                  isFetchingCounselorDailySlots
                    ? <ContentLoading />
                    : !counselorDailySlots || !counselorDailySlots[formData.date]?.length
                      ? <Typography color='text.secondary'>No available slots</Typography>
                      : counselorDailySlots[formData.date]
                        .map(slot => (
                          <Tooltip
                            key={slot.slotCode}
                            title={slot.slotCode.split('-').join(" ").concat(slot.myAppointment ? " - You booked this slot" : "")}
                          >
                            <Button
                              variant={formData.slotCode === slot.slotCode ? 'contained' : 'outlined'}
                              disabled={['UNAVAILABLE', 'EXPIRED'].includes(slot.status)}
                              onClick={() => setValue("slotCode", slot.slotCode)}
                              className='font-normal'
                              color='primary'
                            >
                              {dayjs(slot.startTime, 'HH:mm:ss').format('HH:mm')} -  {dayjs(slot.endTime, 'HH:mm:ss').format('HH:mm')}
                            </Button>
                          </Tooltip>
                        ))
                }
              </div>
            </div>

            {
              errors?.slotCode && (
                <Typography className='mt-16' color='error'>Please select a counseling slot</Typography>
              )
            }

            <div className=''>
              <Typography className='text-lg font-semibold text-primary'>Meeting Type</Typography>
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
              {
                // @ts-ignore
                formData?.isOnline === "true" ? (
                  <TextField
                    autoFocus
                    margin="dense"
                    name={'meetUrl'}
                    label={'Meet Url'}
                    fullWidth
                    value={meetURL}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setMeetURL(event.target.value);
                    }} />
                ) : (
                  <TextField
                    autoFocus
                    margin="dense"
                    name={'address'}
                    label={'Address'}
                    fullWidth
                    value={address}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setAddress(event.target.value);
                    }} />
                )
              }
            </div>

            <div className=''>
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <TextField
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

            <div className="flex items-center justify-end mt-32">
              <Button className="mx-8" component={NavLinkAdapter} to="." >Cancel</Button>
              <Button
                variant='contained'
                color='secondary'
                disabled={isGettingStudentByCode || isBookingCounselor || !student || (!meetURL && !address)}
                // disabled={!isValid || isLoading || isBookingCounselor}
                onClick={handleSubmit(onSubmit)}>
                Confirm
              </Button>
            </div>
          </div>
        </Paper>
      </div >
    </div >
  );
}

export default AppointmentCreate;
