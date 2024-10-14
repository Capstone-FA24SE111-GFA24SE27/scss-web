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
import { Slot, useGetCounselorAcademicQuery, useGetCounselorNonAcademicQuery, useGetCounselorDailySlotsQuery, AppointmentRequest, useBookCounselorMutation, GetCounselorsDailySlotsResponse, GetCounselorsDailySlotsArg, DailySlot, AppointmentStatus } from '../counseling-api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { useSocket } from '@/shared/context';
import { useEffect } from 'react'
import { apiService, useAppDispatch, useAppSelector } from '@shared/store'
import { selectCounselorType } from '../counselor-list/counselor-list-slice';

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

type FormType = AppointmentRequest



function CounselorBooking() {
    const routeParams = useParams();
    const socket = useSocket()
    const { id: counselorId } = routeParams as { id: string };
    const today = dayjs().format('YYYY-MM-DD');
    // const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');
    // const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [startOfMonth, setStartOfMonth] = useState(today);
    const [endOfMonth, setEndOfMonth] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
    const [counselorDailySlots, setCounselorDailySlots] = useState<DailySlot>()

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





    const navigate = useNavigate()
    const counselorType = useAppSelector(selectCounselorType)

    const { data: counselorData, isLoading } = counselorType === 'ACADEMIC'
        ? useGetCounselorAcademicQuery(counselorId)
        : useGetCounselorNonAcademicQuery(counselorId)
    const { data: counserDailySlotsData, isFetching: isFetchingCounselorDailySlots } = useGetCounselorDailySlotsQuery({ counselorId, from: startOfMonth, to: endOfMonth });

    const counselor = counselorData




    const onSubmit = () => {
        bookCounselor({
            counselorId: Number(counselorId),
            appointmentRequest: formData
        })
            .unwrap()
            .then(() => navigate('../'))
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
        if (counserDailySlotsData) {
            setCounselorDailySlots(counserDailySlotsData.content);
        }
    }, [counserDailySlotsData]);


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

    return (
        <>
            <div className="relative flex flex-col flex-auto items-center p-24 sm:p-48">
                <div className="w-full max-w-3xl">
                    <Breadcrumbs
                        parents={[
                            {
                                label: counselor.profile.fullName || "",
                                url: `/services/counseling/${counselor.profile.id}`
                            }
                        ]}
                        currentPage={"Booking"}
                    />
                    <div className="flex flex-auto items-end gap-32">
                        <Avatar
                            sx={{
                                borderWidth: 4,
                                borderStyle: 'solid',
                                borderColor: 'background.paper',
                                backgroundColor: 'background.default',
                                color: 'text.secondary'
                            }}
                            className="w-128 h-128 text-64 font-bold"
                            src={counselor.profile.avatarLink}
                            alt={counselor.profile.fullName}
                        >
                            {counselor?.profile.fullName?.charAt(0)}
                        </Avatar>
                        <div >
                            <Typography className="mt-32 text-4xl font-bold truncate">{counselor.profile.fullName}</Typography>
                            {/* <div className='flex items-end gap-8 text-lg text-gray-500'>
                                <Rating
                                    name="simple-controlled"
                                    value={4.6}
                                    readOnly
                                    precision={0.5}
                                />
                                <div>(116)</div>
                            </div> */}

                            <div className="flex flex-wrap items-center mt-16">
                                <Chip
                                    label={counselor.expertise?.name || counselor.specialization?.name}
                                    className="mr-12 mb-12"
                                    size="medium"
                                />
                            </div>
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
                            disabled={isEmpty(dirtyFields) || !isValid || isLoading || isBookingCounselor}
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
