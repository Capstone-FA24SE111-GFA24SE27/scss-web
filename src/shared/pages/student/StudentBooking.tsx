import { useSocket } from '@/shared/context';
import { AppointmentSlotStatus, DailySlot } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Breadcrumbs, ContentLoading } from '@shared/components';
import { getApiErrorMessage, selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useCreateAppointmentMutation, useGetStudentDetailQuery } from './student-api';
import { useGetCounselorDailySlotsQuery } from '@/features/students/services/counseling/counseling-api';
import { navigateUp } from '@/shared/utils';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';

/**
 * The contact view.
 */

const schema = z.object({
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



function CounselorBooking() {
  const account = useAppSelector(selectAccount)
  const routeParams = useParams();
  const socket = useSocket()
  const { id: studentId } = routeParams as { id: string };
  const counselorId = account?.id
  const today = dayjs().format('YYYY-MM-DD');
  // const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');
  // const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [startOfMonth, setStartOfMonth] = useState(today);
  const [endOfMonth, setEndOfMonth] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [counselorDailySlots, setCounselorDailySlots] = useState<DailySlot>()
  const [meetURL, setMeetURL] = useState('')
  const [address, setAddress] = useState('')

  const [bookCounselor, { isLoading: isBookingCounselor, isSuccess }] = useCreateAppointmentMutation()
  const defaultValues = {
    slotCode: "",
    date: startOfMonth,
    isOnline: true,
    reason: "",
  }

  const { control, formState, watch, handleSubmit, setValue } = useForm<FormType>({
    defaultValues,
    resolver: zodResolver(schema)
  });

  const formData = watch();
  const { isValid, dirtyFields, errors } = formState;

  console.log(formData)
  const isOnline = watch("isOnline")


  const { data: studentData, isLoading } = useGetStudentDetailQuery(studentId)
  const { data: counselorDailySlotsData, isFetching: isFetchingCounselorDailySlots } = useGetCounselorDailySlotsQuery({ counselorId: counselorId?.toString(), from: startOfMonth, to: endOfMonth });

  const counselor = account
  const student = studentData?.content

  const location = useLocation();
  const studentUrl = navigateUp(location, 1);
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

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

  if (isLoading) {
    return <ContentLoading className='m-32' />
  }

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

  if (!student) {
    return <div className='relative p-48'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid student!
      </Typography>
    </div>
  }


  return (
    <>
      <div className="relative flex flex-col flex-auto items-center w-md p-24 sm:p-48 min-w-lg">
        <div className="w-full max-w-3xl">
          <Breadcrumbs
            parents={[
              {
                label: student.profile.fullName || "",
                url: studentUrl || ``
              }
            ]}
            currentPage={"Booking"}
          />
          <div className="flex flex-auto items-center gap-32">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary'
              }}
              className="w-128 h-128 text-64 font-bold"
              src={student.profile.avatarLink}
              alt={student.profile.fullName}
            >
              {student?.profile.fullName?.charAt(0)}
            </Avatar>
            <div >
              <Typography className="mt-32 text-4xl font-bold truncate">{student.profile.fullName}</Typography>
              <Typography className="text-lg truncate">{student.studentCode}</Typography>

            </div>
          </div>

          <Divider className="mt-16 mb-24" />

          <div>
            <Typography className='font-semibold text-primary px-24 text-lg'>Counseling Date</Typography>

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

          <Divider className="mb-24" />

          <div className='px-32'>
            <Typography className='font-semibold text-primary text-lg'>Available slots</Typography>
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
              {
                errors?.slotCode && (
                  <Typography className='mt-16' color='error'>Please select a counseling slot</Typography>
                )
              }

          </div>

          <Divider className="mt-16 mb-24" />

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
            {
              // @ts-ignore
              (formData?.isOnline === true || formData?.isOnline === "true") ? (
                <TextField
                  autoFocus
                  margin="dense"
                  name={'meetUrl'}
                  label={'Meet Url'}
                  fullWidth
                  value={meetURL}
                  className='mt-16'
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

                  className='mt-16'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(event.target.value);
                  }} />
              )
            }
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
                  className="mt-32"
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

          <div className='flex justify-center mt-24 px-32'>
            <Button
              variant='contained'
              color='secondary'
              className='w-full'
              disabled={isLoading || isBookingCounselor}
              // disabled={ !isValid || isLoading || isBookingCounselor}
              onClick={handleSubmit(onSubmit)}>
              Confirm booking
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CounselorBooking;
