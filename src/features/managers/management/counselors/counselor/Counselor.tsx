import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppLoading, Breadcrumbs, Gender, Heading, PageSimple } from '@shared/components';
import { Autocomplete, Box, MenuItem, Paper, Rating, Select, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import CounselorSidebarContent from '../CounselorSidebarContent';
import { Feedback, Mail, Phone, Star } from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { CounselingSlot, useDeleteCounselorCounselingSlotsMutation, useGetCounselingSlotsQuery, useGetCounselorCounselingSlotsQuery, useGetCounselorManagementQuery, useUpdateCounselorAvailableDateRangeMutation, useUpdateCounselorCounselingSlotsMutation, useUpdateCounselorStatusMutation } from '../counselors-api';
import { z } from 'zod';
import dayjs from 'dayjs';
import AppointmentsTable from './AppointmentsTab';
import RequestsTable from './RequestsTab';
import FeedbackTab from './FeedbackTab';


const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper
  },
}));

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];


function Counseling() {
  const pageLayout = useRef(null);
  const routeParams = useParams()
  const { id } = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [selectedDay, setSelectedDay] = useState('MONDAY');

  const { data, isLoading } = useGetCounselorManagementQuery(Number(id));
  const counselorData = data?.content

  const { data: counselingSlotsData, isLoading: isLoadingCounselingSlotsData } = useGetCounselingSlotsQuery()
  const { data: counselorCounselingSlotsData, isLoading: isLoadingCounselorCounselingSlotsData } = useGetCounselorCounselingSlotsQuery(Number(id))
  const counselorCounselingSlots = counselorCounselingSlotsData?.content
  const counselingSlots = counselingSlotsData?.content || []

  const filteredSlots = counselorCounselingSlots?.filter(slot => slot.dayOfWeek === selectedDay) || []

  console.log(filteredSlots)

  const isMobile = false

  const [updateCounselorStatus, { isLoading: isLoadingCounselorStatus }] = useUpdateCounselorStatusMutation()
  const [updateCounselorCounselingSlots, { isLoading: isLoadingUpdateCounselorCounselingSlots }] = useUpdateCounselorCounselingSlotsMutation()
  const [deleteCounselorCounselingSlots, { isLoading: isLoadingDeleteCounselorCounselingSlots }] = useDeleteCounselorCounselingSlotsMutation()
  const [updateCounselorAvailableDateRange, { isLoading: isLoadingDeleteCounselorAvailableDateRange }] = useUpdateCounselorAvailableDateRangeMutation()

  const location = useLocation();

  function handleChangeTab(event: React.SyntheticEvent, value: number) {
    setTabValue(value);
  }

  const handleStatusChange = (e) => {
    updateCounselorStatus({
      status: e.target.value,
      counselorId: Number(id),
    })
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

  if (isLoading) {
    return <AppLoading />;
  }
  if (!data) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No counselor</Typography>;
  }

  return (
    <Root
      header={
        <div className=''>
          <div className='p-16 px-32 space-y-16'>
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
            <div className='flex gap-16 lg:gap-64'>
              <div className='flex w-[42rem] mt-12'>
                <div className='w-full h-full relative'>
                  <img src={counselorData?.profile.profile.avatarLink} className='size-144 border rounded-full' />
                  <div className='absolute top-112 bg-white rounded-full border left-112'>
                    <Gender gender={counselorData?.profile.profile.gender} />
                  </div>
                </div>
                <div className='flex flex-col gap-8 w-full'>
                  <Heading
                    title={counselorData?.profile.profile.fullName}
                    description={counselorData?.profile.specialization?.name || counselorData?.profile.expertise?.name}
                  />
                  <Rating readOnly value={counselorData?.profile.rating} />
                  <div className='flex justify-between divide-x-1 border-t mt-16'>
                    <Tooltip title={counselorData?.profile.profile.phoneNumber}>
                      <a
                        className="flex flex-1 items-center p-8"
                        href={`tel${counselorData?.profile.profile.phoneNumber}`}
                        role="button"
                      >
                        <Phone fontSize='small' />
                        <Typography className="ml-8">Call</Typography>
                      </a>
                    </Tooltip>
                    <Tooltip title={counselorData?.profile.email}>
                      <a
                        className="flex flex-1 items-center p-8 justify-end"
                        href={`mailto:${counselorData?.profile.email}`}
                        role="button"
                      >
                        <Mail fontSize='small' />
                        <Typography className="ml-8">Email</Typography>
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </div>


              <div className='flex-1 flex flex-col gap-16 '>
                <div className='flex items-center'>
                  <Typography className='w-224 font-semibold '>Availability Status </Typography>
                  <TextField
                    size='small'
                    className='w-full'
                    select
                    value={counselorData?.profile.status}
                    label="Availability"
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
                <div className='flex items-start'>
                  <Typography className='w-224 font-semibold'>Assign Slots</Typography>
                  <div className='flex flex-col gap-16 w-full'>
                    <TextField
                      size="small"
                      select
                      value={selectedDay}
                      onChange={handleDayChange}
                      label="Select Day"
                      variant="outlined"
                      className="w-256"
                    >
                      {daysOfWeek.map(day => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select slots"
                          label="Slots"
                          variant="outlined"
                        // InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='flex items-center'>
                  <Typography className='w-224 font-semibold '>Available date range</Typography>
                  <div className='flex w-full gap-32 items-start'>
                    <DatePicker
                      className='h-12'
                      label="Basic date picker"
                      value={dayjs(counselorData?.availableDateRange.startDate)}
                      onChange={handleStartDateChange}
                      maxDate={dayjs(counselorData?.availableDateRange.endDate)}
                      disabled={isLoadingDeleteCounselorAvailableDateRange}
                    />
                    <div className='font-semibold pt-8'>to</div>
                    <DatePicker
                      className='h-12'
                      label="Basic date picker"
                      value={dayjs(counselorData?.availableDateRange.endDate)}
                      onChange={handleEndDateChange}
                      minDate={dayjs(counselorData?.availableDateRange.startDate)}
                      disabled={isLoadingDeleteCounselorAvailableDateRange}
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
            classes={{ root: 'w-full h-32 border-b bg-background-paper px-16' }}
          >
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Overview"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Appointments"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Requests"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Schedule"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Feedbacks"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Q&A"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Profile"
            />
          </Tabs>
        </div>
      }
      content={
        < div className="w-full p-16 h-full" >
          <Paper className='p-16 h-full shadow'>
            <div className="w-full pr-8">
              {tabValue === 1 && <AppointmentsTable />}
              {tabValue === 2 && <RequestsTable />}
              {tabValue === 3 && <FeedbackTab />}
            </div>
          </Paper>
        </div >
      }
      ref={pageLayout}
      // rightSidebarContent={< CounselorSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Counseling;
