import Button from '@mui/material/Button';
import { Breadcrumbs, ContentLoading, NavLinkAdapter } from '@shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { CakeOutlined, EmailOutlined, LocalPhoneOutlined, NotesOutlined } from '@mui/icons-material';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Rating, TextField, Tooltip } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Slot, useGetCounselorQuery, useGetCounselorDailySlotsQuery, AppointmentRequest, useBookCounselorMutation, GetCounselorsDailySlotsResponse, GetCounselorsDailySlotsArg, DailySlot, AppointmentStatus } from '../counseling-api';
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
  slotCode: z.string().min(1, "Slot code is required"),
  date: z.string().min(1),
  isOnline: z.coerce.boolean(),
  reason: z.string().min(2, "Please enter a valid reason"),
});



type SlotsMessage = {
  counselorId: string,
  dateChange: string,
  newStatus: AppointmentStatus,
  slotId: number,
  studentId: number
}

type SlotOption = Omit<Slot, 'slotId' | 'myAppointment' | 'status'>;

type FormType = AppointmentRequest



function QuickBooking() {
  const routeParams = useParams();
  const socket = useSocket()
  const { id: counselorId } = routeParams as { id: string };
  const navigate = useNavigate()
  const today = dayjs().format('YYYY-MM-DD');
  const [startOfMonth, setStartOfMonth] = useState(today);
  const [endOfMonth, setEndOfMonth] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [counselorDailySlots, setCounselorDailySlots] = useState<SlotOption[]>(
    [
      {
        "slotCode": "Slot-1",
        "startTime": "08:00:00",
        "endTime": "09:00:00",
      },
      {
        "slotCode": "Slot-2",
        "startTime": "09:15:00",
        "endTime": "10:15:00",
      },
      {
        "slotCode": "Slot-3",
        "startTime": "10:30:00",
        "endTime": "11:30:00",
      },
      {
        "slotCode": "Slot-4",
        "startTime": "13:00:00",
        "endTime": "14:00:00",
      },
      {
        "slotCode": "Slot-5",
        "startTime": "14:15:00",
        "endTime": "15:15:00",
      },
      {
        "slotCode": "Slot-6",
        "startTime": "15:30:00",
        "endTime": "16:30:00",
      }
    ],
  )

  const [bookCounselor, { isLoading: isBookingCounselor, isSuccess }] = useBookCounselorMutation()
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





  // const { data: counselorData, isLoading } = useGetCounselorQuery(counselorId);
  // const { data: counserDailySlotsData, isFetching: isFetchingCounselorDailySlots } = useGetCounselorDailySlotsQuery({ counselorId, from: startOfMonth, to: endOfMonth });

  const onSubmit = () => {
    bookCounselor({
      counselorId: counselorId,
      appointmentRequest: formData
    })
      .unwrap()
      .then(() => navigate('../'))
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
    //   setCounselorDailySlots(previousSlots => ({
    //     ...previousSlots,
    //     [slotsMessage.dateChange]: (previousSlots[slotsMessage.dateChange]).map((slot) =>
    //       slot.slotId === slotsMessage.slotId
    //         ? { ...slot, status: slotsMessage.newStatus }
    //         : slot
    //     )
    //   }));
    // })

    setValue("date", currentDate)
    setValue("slotCode", '')
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

  return (
    <>
      <div className="relative flex flex-col flex-auto p-32 bg-background-paper gap-16 min-h-screen">
        <Typography variant='h6' color='textSecondary'>We will find the perfect counselor based on your needs and preferences.</Typography>
        <div className="flex flex-col gap-4">
          <div className='w-fit'>
            <Typography className='font-semibold text-primary text-lg uppercase'>Select date</Typography>
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
            <Typography className='font-semibold text-primary text-lg uppercase'>Select time</Typography>
            {/* <Typography className='text-primary' >{dayjs(formData.date).format('dddd, MMMM DD, YYYY')}</Typography> */}
            <div className='flex flex-wrap gap-16 mt-16'>
              {
                counselorDailySlots
                  .map(slot => (
                    <Tooltip
                      key={slot.slotCode}
                      title={slot.slotCode.split('-').join(" ")}
                    >
                      <Button
                        variant={formData.slotCode === slot.slotCode ? 'contained' : 'outlined'}
                        onClick={() => setValue("slotCode", slot.slotCode)}
                        color='primary'
                      >
                        {dayjs(slot.startTime, 'HH:mm:ss').format('HH:mm')} -  {dayjs(slot.endTime, 'HH:mm:ss').format('HH:mm')}
                      </Button>
                    </Tooltip>
                  ))
              }
            </div>
          </div>

          <div className='mt-32'>
            <Typography className='font-semibold text-primary text-lg uppercase'>Select counseling topic</Typography>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default QuickBooking;
