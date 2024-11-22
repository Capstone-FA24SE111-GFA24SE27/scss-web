import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Paper, Radio, RadioGroup, TextField, Tooltip, Typography } from '@mui/material'
import { useGetCounselorAppointmentRequestsQuery } from './requests-api'
import { AppLoading, DateRangePicker, FilterTabs, NavLinkAdapter, Pagination, RequestItem, SelectField, SortingToggle, UserListItem, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle, Edit, EditNote } from '@mui/icons-material';
import { Link } from 'react-router-dom'
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { Dialog } from '@shared/components';
import dayjs, { Dayjs } from 'dayjs';
import { useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation, useDenyAppointmentRequestMutation } from '../counseling-api';
import { Appointment, AppointmentRequest } from '@/shared/types';
import { ExpandableText } from '@shared/components'
import { openStudentView } from '../../counselors-layout-slice';
import { useRequestsSocketListener } from '@/shared/context';

const RequestsContent = () => {
  const account = useAppSelector(selectAccount)
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [selectedMeetingType, setSelectedMeetingType] = useState('');
  const [statusValue, setStatusValue] = useState(0);

  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');



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

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Waiting', value: 'WAITING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Denied', value: 'DENIED' },
    { label: 'Expired', value: 'EXPIRED' },
  ];

  const handleChangeStatus = (event: React.SyntheticEvent, newValue: number) => {
    setStatusValue(newValue);
  };


  const { data, isLoading, refetch } = useGetCounselorAppointmentRequestsQuery({
    dateFrom: startDate,
    dateTo: endDate,
    meetingType: selectedMeetingType,
    page: page,
    sortDirection: sortDirection,
    status: statusTabs[statusValue].value,
  })

  const appointmentRequests = data?.content.data
  

  useRequestsSocketListener(account?.profile.id, refetch)


  const dispatch = useAppDispatch()


  if (isLoading) {
    return <AppLoading />
  }


  return (
    <div className='container mx-auto p-32 flex flex-col gap-16'>
      <Box className='flex gap-32 justify-between'>
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
      <FilterTabs tabs={statusTabs} tabValue={statusValue} onChangeTab={handleChangeStatus}/>

      <List className='flex flex-col gap-16'>
        {
          !appointmentRequests?.length
            ? <Typography color='text.secondary' variant='h5' className='p-16'>No appointment requests</Typography>
            : appointmentRequests?.map(appointment =>
              <Paper
                key={appointment.id}
                className="shadow"
                sx={{ bgcolor: 'background.paper' }}
              >
                <RequestItem appointment={appointment} />
              </Paper >
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

export default RequestsContent