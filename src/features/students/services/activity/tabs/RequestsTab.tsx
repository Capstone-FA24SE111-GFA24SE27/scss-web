import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, Paper, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { useGetCounselingAppointmentRequestsQuery, useSendCouselingAppointmentFeedbackMutation } from '../activity-api'
import { AppLoading, DateRangePicker, ExpandableText, NavLinkAdapter, Pagination, RequestItem, SelectField, SortingToggle, UserListItem, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { ChangeEvent, useEffect, useState } from 'react'
import { openCounselorView } from '@/features/students/students-layout-slice';
import { AppointmentRequest } from '@/shared/types';
import { useRequestsSocketListener } from '@/shared/context';
const RequestsTab = () => {
  const account = useAppSelector(selectAccount)
  const [page, setPage] = useState(1);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [selectedMeetingType, setSelectedMeetingType] = useState('');

  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  const dispatch = useAppDispatch();

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSelectMeetingType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMeetingType(event.target.value);
  };

  const meetingTypeOptions = [
    { label: 'Online', value: 'ONLINE' },
    { label: 'Offline', value: 'OFFLINE' },
  ]

  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);


  const handleSortChange = (newSortDirection: 'ASC' | 'DESC') => {
    setSortDirection(newSortDirection);
  };

  const { data, isLoading, refetch } = useGetCounselingAppointmentRequestsQuery({
    dateFrom: startDate,
    dateTo: endDate,
    meetingType: selectedMeetingType as `ONLINE` | `OFFLINE` | ``,
    page: page,
    sortDirection: sortDirection
  })

  const appointmentRequests = data?.content.data

  useRequestsSocketListener(account?.profile.id, refetch)

  const statusColor = {
    'REJECTED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }

  // useEffect(() => {
  //   refetch()
  // }, []);

  if (isLoading) {
    return <AppLoading />
  }
  return (
    <div className='p-16 container mx-auto'>
      <Box className='flex justify-between'>
        <div className='flex gap-32'>
          <DateRangePicker
            startDate={startDate ? dayjs(startDate) : null}
            endDate={endDate ? dayjs(endDate) : null}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
          <SelectField
            label="Meting type"
            options={meetingTypeOptions}
            value={selectedMeetingType}
            onChange={handleSelectMeetingType}
            className='w-192'
            showClearOptions
          />
        </div>
        <SortingToggle
          onSortChange={handleSortChange}
          initialSort='DESC'
        />
      </Box>
      <List className='flex flex-col gap-16 mt-8'>
        {
          !appointmentRequests?.length
            ? <Typography color='text.secondary' variant='h5' className='p-16'>No appointment requests</Typography>
            : appointmentRequests.map(appointment =>
              <Paper
                key={appointment.id}
                className="flex gap-16 shadow w-full"
                sx={{ bgcolor: 'background.paper' }}
              >
                <RequestItem appointment={appointment} />
              </Paper>
            )}
      </List >
      <Pagination
        page={page}
        count={data?.content.totalPages}
        handleChange={handlePageChange}
      />
    </div>
  )
}

export default RequestsTab