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
import { BackdropLoading, Breadcrumbs, ContentLoading } from '@shared/components';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useGetCounselorDailySlotsQuery } from '@/features/students/services/counseling/counseling-api';
import { navigateUp } from '@/shared/utils';
import { useCreateAppointmentByDemandMutation, useGetCounselingDemandByIdQuery } from './student-demands-api';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { getApiErrorMessage } from '@shared/store';

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



function StudentDemandsAppointmentCreate() {
  const account = useAppSelector(selectAccount)
  const routeParams = useParams();
  const socket = useSocket()
  const { id: demandId } = routeParams as { id: string };
  const counselorId = account?.id
  const today = dayjs().format('YYYY-MM-DD');
  // const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');
  // const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [startOfMonth, setStartOfMonth] = useState(today);
  const [endOfMonth, setEndOfMonth] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [counselorDailySlots, setCounselorDailySlots] = useState<DailySlot>()
  const [meetURL, setMeetURL] = useState('')
  const [address, setAddress] = useState('')

  const navigate = useNavigate()
  const [bookCounselor, { isLoading: isBookingCounselor, isSuccess }] = useCreateAppointmentByDemandMutation()
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


  const { data: demandData, isLoading } = useGetCounselingDemandByIdQuery(demandId)
  const { data: counselorDailySlotsData, isFetching: isFetchingCounselorDailySlots } = useGetCounselorDailySlotsQuery({ counselorId: counselorId?.toString(), from: startOfMonth, to: endOfMonth });
  const counselor = account
  const student = demandData?.student

  const location = useLocation();
  const dispatch = useAppDispatch()
  const onSubmit = () => {
    useConfirmDialog({
      dispatch,
      title: 'Confirm booking',
      content: `Are you sure to create an appointment at \n ${formData.slotCode}, ${formData.date}`,
      confirmButtonFunction: () => bookCounselor({
        demandId: demandId,
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
            title: 'Create appointment successfully'
          })
          navigate('../')
        })
        .catch(error => {
          useAlertDialog({
            dispatch,
            title: `Create appointment failed ${getApiErrorMessage(error)}`,
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

  // if (!student) {
  //   return <div className='relative p-48'>
  //     <Typography
  //       color="text.secondary"
  //       variant="h5"
  //     >
  //       Invalid student!
  //     </Typography>
  //   </div>
  // }


  return (
    <>
      {isBookingCounselor && <BackdropLoading />}
      <div className="relative flex flex-col items-center flex-auto p-24 w-md sm:p-48">
        <div className="w-full max-w-3xl">
          {/* <Breadcrumbs
            parents={[
              {
                label: student.profile.fullName || "",
                url: studentUrl || ``
              }
            ]}
            currentPage={"Booking"}
          /> */}
          <div className="flex items-end flex-auto gap-32">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary'
              }}
              className="font-bold size-96 text-64"
              src={student.profile.avatarLink}
              alt={student.profile.fullName}
            >
              {student?.profile.fullName?.charAt(0)}
            </Avatar>
            <div >
              <Typography className="mt-32 text-4xl font-bold truncate">{student.profile.fullName}</Typography>
              <Typography className="text-lg truncate">{student.studentCode}</Typography>

              <div className="flex flex-wrap items-center mt-16">

              </div>
            </div>
          </div>



          <Divider className="mt-16 mb-24" />

          <div>
            <Typography className='px-24 text-lg font-semibold text-primary'>Counseling Date</Typography>

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

          <Divider className="mt-16 mb-24" />

          <div className='px-32'>
            <Typography className='text-lg font-semibold text-primary'>Meeting Type</Typography>

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
                  label={'Meeting Url'}
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
                            className='w-full mt-16'
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

          <div className='flex justify-center px-32 mt-24'>
            <Button
              variant='contained'
              color='secondary'
              className='w-full'
              // disabled={isLoading || isBookingCounselor}
              disabled={isLoading || isBookingCounselor || !formData?.slotCode}
              onClick={handleSubmit(onSubmit)}>
              Confirm booking
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDemandsAppointmentCreate;
