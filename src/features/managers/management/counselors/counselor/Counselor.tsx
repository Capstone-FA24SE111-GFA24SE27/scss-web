import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppLoading, BackdropLoading, Breadcrumbs, Gender, Heading, PageSimple, Popover, WeeklySlots, setBackdropLoading } from '@shared/components';
import { Autocomplete, Avatar, Box, Button, Chip, IconButton, MenuItem, Paper, Rating, Select, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import { Cake, CalendarMonth, CalendarViewWeek, Feedback, Female, Mail, Male, Phone, Star, Start } from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { useDeleteCounselorCounselingSlotsMutation, useGetCounselingSlotsQuery, useGetCounselorCounselingSlotsQuery, useGetCounselorManagementQuery, useUpdateCounselorAvailableDateRangeMutation, useUpdateCounselorCounselingSlotsMutation, useUpdateCounselorStatusMutation } from '../counselors-api';
import { z } from 'zod';
import dayjs from 'dayjs';
import AppointmentsTable from './AppointmentsTab';
import RequestsTable from './RequestsTab';
import FeedbackTab from './FeedbackTab';
import ScheduleTab from './ScheduleTab';
import OverviewTab from './OverviewTab';
import { CounselingSlot } from '@/shared/types';
import { daysOfWeek } from '@/shared/constants';
import { useConfirmDialog } from '@/shared/hooks';
import { useAlertDialog } from '@/shared/hooks';
import { isApiSuccess, useAppDispatch } from '@shared/store';
import QnaTab from './QnaTab';
import ProfileTab from './ProfileTab';
import DemandTab from './DemandTab';


const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper
  },
}));


function Counseling() {
  const pageLayout = useRef(null);
  const routeParams = useParams()
  const { id } = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [selectedDay, setSelectedDay] = useState('MONDAY');

  const { data, isLoading } = useGetCounselorManagementQuery(Number(id));
  const counselorData = data?.content

  console.log(counselorData)

  const { data: counselingSlotsData, isLoading: isLoadingCounselingSlotsData } = useGetCounselingSlotsQuery()
  const { data: counselorCounselingSlotsData, isLoading: isLoadingCounselorCounselingSlotsData } = useGetCounselorCounselingSlotsQuery(Number(id))
  const counselorCounselingSlots = counselorCounselingSlotsData?.content
  const counselingSlots = counselingSlotsData?.content || []


  const filteredSlots = counselorCounselingSlots?.filter(slot => slot.dayOfWeek === selectedDay) || []

  const isMobile = false

  const [updateCounselorStatus, { isLoading: isLoadingCounselorStatus, isSuccess: isSuccessCounselorStatus }] = useUpdateCounselorStatusMutation()
  const [updateCounselorCounselingSlots, { isLoading: isLoadingUpdateCounselorCounselingSlots }] = useUpdateCounselorCounselingSlotsMutation()
  const [deleteCounselorCounselingSlots, { isLoading: isLoadingDeleteCounselorCounselingSlots }] = useDeleteCounselorCounselingSlotsMutation()
  const [updateCounselorAvailableDateRange, { isLoading: isLoadingUpdateCounselorAvailableDateRange }] = useUpdateCounselorAvailableDateRangeMutation()

  const location = useLocation();

  function handleChangeTab(event: React.SyntheticEvent, value: number) {
    setTabValue(value);
  }
  const dispatch = useAppDispatch()

  const handleStatusChange = (e) => {
    useConfirmDialog({
      dispatch: dispatch,
      title: 'Are you you want to update status for this counselor?',
      confirmButtonFunction: async () => {
        const result = await updateCounselorStatus({
          status: e.target.value,
          counselorId: Number(id),
        })
        if (isApiSuccess(result)) {
          useAlertDialog({
            dispatch,
            title: 'Counselor status updated success',
          });
        } else {
          useAlertDialog({
            dispatch,
            title: 'Counselor status updated fail',
            color: 'error'
          });
        }
      },
    });
  }

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleSlotsChange = (e, newValue: CounselingSlot[]) => {
    // const selectedSlots = counselorData?.counselingSlot
    const selectedSlots = filteredSlots
    console.log(selectedSlots)
    const addedSlot = newValue.find(slot => !selectedSlots.includes(slot));
    const removedSlot = selectedSlots.find(slot => !newValue.includes(slot));
    console.log(addedSlot, removedSlot);
    if (addedSlot) {
      updateCounselorCounselingSlots({
        counselorId: Number(id),
        slotId: addedSlot?.id,
        dayOfWeek: selectedDay,
      })
    }

    if (removedSlot) {
      deleteCounselorCounselingSlots({
        counselorId: Number(id),
        slotId: removedSlot?.id
      })
    }
  }


  const handleStartDateChange = (newValue) => {
    updateCounselorAvailableDateRange({
      counselorId: Number(id),
      startDate: dayjs(newValue).format('YYYY-MM-DD'),
      endDate: counselorData?.availableDateRange.endDate,
    })
  };

  const handleEndDateChange = (newValue) => {
    updateCounselorAvailableDateRange({
      counselorId: Number(id),
      startDate: counselorData?.availableDateRange.startDate,
      endDate: dayjs(newValue).format('YYYY-MM-DD'),
    })
  };


  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.appointmentId));
  }, [routeParams]);


  const isLoadingWithBackdrop = isLoadingUpdateCounselorAvailableDateRange
    || isLoadingDeleteCounselorCounselingSlots
    || isLoadingUpdateCounselorCounselingSlots
    || isLoadingCounselorStatus

  useEffect(() => {
    dispatch(setBackdropLoading(isLoadingWithBackdrop));
  }, [isLoadingWithBackdrop]);

  if (isLoading) {
    return <AppLoading />;
  }

  if (!data) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No counselor</Typography>;
  }



  return (
    <Root
      header={
        <div className='bg-white'>
          <div className='pt-16 px-32 space-y-16'>
            <Breadcrumbs
              parents={[
                {
                  label: "Management",
                  url: `${location.pathname}`
                },
                {
                  label: "Counselors",
                  url: `/management/counselors`
                }
              ]}
              currentPage={counselorData?.profile.profile.fullName}
            />
            <div className='grid grid-cols-12 gap-32'>
              <div className="col-span-3 flex flex-col items-start gap-8 h-full">
                <div className='flex relative'>
                  <Avatar
                    sx={{
                      color: (theme) => theme.palette.text.secondary
                    }}
                    className="flex-0 size-72 border"
                    alt="user photo"
                    src={counselorData?.profile.profile.avatarLink}
                  >
                    {counselorData?.profile.profile.fullName}
                  </Avatar>
                  <div className="flex flex-col mx-16 gap-6">
                    <div>
                      <Typography className='text-3xl font-semibold'>{counselorData?.profile.profile?.fullName}</Typography>
                      <Typography className='text-xl text-text-secondary'>{counselorData?.profile.major?.name || counselorData?.profile.expertise?.name}</Typography>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-2 w-full gap-4'>
                  <a
                    className="flex items-center"
                    role="button"
                    href={`mailto:${counselorData?.profile?.email}`}
                  >
                    <Mail fontSize='small' />
                    <Typography className="ml-8 leading-6">{counselorData?.profile.email}</Typography>
                  </a>
                  <div
                    className="flex items-center"
                    role="button"
                  >
                    <Phone fontSize='small' />
                    <Typography className="ml-8 leading-6">{counselorData?.profile.profile.phoneNumber}</Typography>
                  </div>

                  <div className="flex items-center">
                    <Cake fontSize='small' />
                    <div className="ml-8 leading-6">{dayjs(counselorData.profile.profile.dateOfBirth).format('DD-MM-YYYY')}</div>
                  </div>
                  <div className="flex items-center">
                    {
                      counselorData?.profile.profile.gender === `MALE` ? <Male fontSize='small' /> : <Female fontSize='small' />
                    }
                    <div className="ml-8 leading-6 capitalize">{counselorData?.profile.profile.gender.toLowerCase()}</div>
                  </div>
                </div>

              </div>

              <div className='col-span-4 flex flex-col gap-16 flex-1'>
                <Typography className='text-lg font-semibold'>Availability</Typography>
                <div className='flex items-center'>
                  <TextField
                    size='small'
                    className='w-full'
                    select
                    value={counselorData?.profile.status}
                    label="Status"
                    variant="outlined"
                    disabled={isLoadingCounselorStatus}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleStatusChange} // Add onChange here
                  >
                    <MenuItem value="AVAILABLE">Available</MenuItem>
                    <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
                  </TextField>
                </div>
                <div className='flex items-center'>
                  <div className='flex items-start w-full gap-16'>
                    <DatePicker
                      className='h-12 w-full'
                      label="Start date"
                      value={dayjs(counselorData?.availableDateRange.startDate)}
                      onChange={handleStartDateChange}
                      maxDate={dayjs(counselorData?.availableDateRange.endDate)}
                      disabled={counselorData?.profile.status === 'UNAVAILABLE' || isLoadingUpdateCounselorAvailableDateRange}
                    />
                    <DatePicker
                      className='h-12 w-full'
                      label="End date"
                      value={dayjs(counselorData?.availableDateRange.endDate)}
                      onChange={handleEndDateChange}
                      minDate={dayjs(counselorData?.availableDateRange.startDate)}
                      disabled={counselorData?.profile.status === 'UNAVAILABLE' || isLoadingUpdateCounselorAvailableDateRange}
                    />
                  </div>
                </div>
              </div>
              <div className='col-span-5 flex flex-col gap-16 flex-1'>
                <div className='flex gap-32'>
                  <Typography className='text-lg font-semibold'>Weekly Schedule</Typography>
                </div>
                <div className='flex items-start w-full'>
                  <div className='flex flex-col w-full gap-16'>
                    <Box className='grid grid-cols-2 gap-16 w-full'>
                      <TextField
                        size="small"
                        select
                        value={selectedDay}
                        onChange={handleDayChange}
                        label="Select Day"
                        variant="outlined"
                        fullWidth
                      >
                        {daysOfWeek.map(day => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </TextField>
                      <div>
                        <Popover
                          trigger={
                            <Button size='large' startIcon={<CalendarMonth fontSize='large' />}>View</Button>
                          }
                          content={
                            <WeeklySlots slots={counselorCounselingSlots} />
                          }
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        />
                      </div>

                    </Box>

                    <Autocomplete
                      className="w-full"
                      multiple
                      disabled={isLoadingCounselingSlotsData || isLoadingDeleteCounselorCounselingSlots || isLoadingUpdateCounselorCounselingSlots}
                      options={counselingSlots}
                      getOptionLabel={(option) => `${dayjs(option.startTime, 'HH:mm:ss').format('HH:mm')} -  ${dayjs(option.endTime, 'HH:mm:ss').format('HH:mm')}`}
                      isOptionEqualToValue={(option, value) => option.slotCode === value.slotCode}
                      // value={counselorData?.counselingSlot}
                      value={filteredSlots}
                      onChange={handleSlotsChange}
                      size='small'
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select slots"
                          label="Slots"
                          variant="outlined"
                          className='w-full'
                        // InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ div>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: 'w-full h-32 border-b bg-background-paper px-16 mt-8' }}
          >
            <Tab
              className="px-16 text-lg font-semibold min-h-40 min-w-64"
              label="Overview"
            />
            <Tab
              className="px-16 text-lg font-semibold min-h-40 min-w-64"
              label="Appointments"
            />
            <Tab
              className="px-16 text-lg font-semibold min-h-40 min-w-64"
              label="Requests"
            />
            <Tab
              className="px-16 text-lg font-semibold min-h-40 min-w-64"
              label="Schedule"
            />
            <Tab
              className="px-16 text-lg font-semibold min-h-40 min-w-64"
              label="Q&As"
            />
            <Tab
              className="px-16 text-lg font-semibold min-h-40 min-w-64"
              label="Feedbacks"
            />
             <Tab
              className="px-16 text-lg font-semibold min-h-40 min-w-64"
              label="Demands"
            />
            <Tab
              className="px-16 text-lg font-semibold min-h-40 min-w-64"
              label="Profile"
            />
          </Tabs>
        </div>
      }
      content={
        <>
          <div className='w-full'>
            <div className="w-full h-full p-16" >
              <div className='min-h-full'>
                <div className="w-full pr-8">
                  {tabValue === 0 && <OverviewTab />}
                  {tabValue === 1 && <AppointmentsTable />}
                  {tabValue === 2 && <RequestsTable />}
                  {tabValue === 3 && <ScheduleTab />}
                  {tabValue === 4 && <QnaTab />}
                  {tabValue === 5 && <FeedbackTab />}
                  {tabValue === 6 && <DemandTab />}
                  {tabValue === 7 && <ProfileTab />}
                </div>
              </div>
            </div>
          </div >
        </>
      }
      ref={pageLayout}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Counseling;
