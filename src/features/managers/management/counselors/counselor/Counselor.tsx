import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppLoading, Breadcrumbs, Gender, Heading, PageSimple } from '@shared/components';
import { Autocomplete, MenuItem, Paper, Rating, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import CounselorSidebarContent from '../CounselorSidebarContent';
import { Feedback, Mail, Phone, Star } from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { CounselingSlot, useDeleteCounselorCounselingSlotsMutation, useGetCounselingSlotsQuery, useGetCounselorManagementQuery, useUpdateCounselorAvailableDateRangeMutation, useUpdateCounselorCounselingSlotsMutation, useUpdateCounselorStatusMutation } from '../counselors-api';
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

function Counseling() {
  const pageLayout = useRef(null);
  const routeParams = useParams()
  const { id } = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { data, isLoading } = useGetCounselorManagementQuery(Number(id));
  const counselorData = data?.content

  const { data: counselingSlotsData, isLoading: isLoadingCounselingSlotsData } = useGetCounselingSlotsQuery()
  const counselingSlots = counselingSlotsData?.content || []

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

  const handleSlotsChange = (e, newValue: CounselingSlot[]) => {
    const selectedSlots = counselorData?.counselingSlot
    const addedSlot = newValue.find(slot => !selectedSlots.includes(slot));
    const removedSlot = selectedSlots.find(slot => !newValue.includes(slot));
    if (addedSlot) {
      updateCounselorCounselingSlots({
        counselorId: Number(id),
        slotId: addedSlot?.id
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
              currentPage={"Nguyễn Văn A4 4"}
            />
            <div className='flex relative'>
              <div className='flex gap-16 min-w-xs max-w-sm'>
                <img src={counselorData?.profile.profile.avatarLink} className='size-144 border rounded-full' />
                <div className='absolute bottom-8 bg-white rounded-full border left-112'>
                  <Gender gender={counselorData?.profile.profile.gender} />
                </div>
                <div className='flex flex-col gap-8 w-full'>
                  <Heading
                    title={counselorData?.profile.profile.fullName}
                    description={counselorData?.profile.specialization?.name || counselorData?.profile.expertise?.name}
                  />
                  <Rating readOnly value={counselorData?.profile.rating} />
                  <div className='flex justify-between divide-x-1 border-t h-full mt-8'>
                    <Tooltip title={counselorData?.profile.profile.phoneNumber}>
                      <a
                        className="flex flex-1 items-center p-4"
                        href={`tel${counselorData?.profile.profile.phoneNumber}`}
                        role="button"
                      >
                        <Phone fontSize='small' />
                        <Typography className="ml-8">Call</Typography>
                      </a>
                    </Tooltip>
                    <Tooltip title={counselorData?.profile.email}>
                      <a
                        className="flex flex-1 items-center p-4 justify-end"
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


              <div className='flex-1 ml-120 flex flex-col gap-16'>
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
                <div className='flex items-center'>
                  <Typography className='w-224 font-semibold '>Assign Slots</Typography>
                  <Autocomplete
                    size="small"
                    className="w-full"
                    multiple
                    disabled={isLoadingCounselingSlotsData || isLoadingDeleteCounselorCounselingSlots || isLoadingUpdateCounselorCounselingSlots}
                    options={counselingSlots}
                    getOptionLabel={(option) => `${option.slotCode}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={counselorData?.counselingSlot}
                    onChange={handleSlotsChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select slots"
                        label="Slots"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>
                <div className='flex items-center'>
                  <Typography className='w-224 font-semibold '>Available date range</Typography>
                  <div className='flex w-full gap-32'>
                    <DatePicker
                      className='h-12'
                      label="Basic date picker"
                      value={dayjs(counselorData?.availableDateRange.startDate)}
                      onChange={handleStartDateChange}
                      maxDate={dayjs(counselorData?.availableDateRange.endDate)}
                      disabled={isLoadingDeleteCounselorAvailableDateRange}
                    />
                    <div>to</div>
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

          </div>
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
              label="Appointments"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Requests"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Feedbacks"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Students"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 px-16"
              label="Profile"
            />
          </Tabs>
        </div>
      }
      content={
        <div className="w-full p-16 h-full">
          <Paper className='p-16 h-full shadow'>
            <div className="w-full pr-8">
              {tabValue === 0 && <AppointmentsTable />}
              {tabValue === 1 && <RequestsTable />}
              {tabValue === 2 && <FeedbackTab />}
            </div>
          </Paper>
        </div>
      }
      ref={pageLayout}
      rightSidebarContent={<CounselorSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Counseling;
