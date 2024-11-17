import { StudentDocument } from '@/shared/types';
import { CalendarMonth } from '@mui/icons-material';
import { Box, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetStudentAppointmentsQuery, useGetStudentDocumentViewQuery } from './student-api';
import { ContentLoading, DateRangePicker, Pagination, SortingToggle, openDialog } from '@/shared/components';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch } from '@shared/store';
import StudentAppointmentReport from './StudentAppointmentReport';
/**
 * The contact view.
 */

interface StudentAppointmentListProps {
  student: StudentDocument
}
function StudentAppointmentList({ id }: { id: string }) {
  const routeParams = useParams();
  const { id: studentRouteId } = routeParams as { id: string };
  const studentId = id || studentRouteId;
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(1);

  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  const handleSortChange = (newSortDirection: 'ASC' | 'DESC') => {
    setSortDirection(newSortDirection);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const { data, isLoading } = useGetStudentAppointmentsQuery({
    id: studentId,
    fromDate: startDate,
    toDate: endDate,
    sortDirection: sortDirection,
    page: page
  }, {
    skip: !studentId
  });

  const dispatch = useAppDispatch()

  const appointments = data?.content?.data

  if (isLoading) {
    return <ContentLoading />
  }

  return (
    <div className='flex flex-col gap-16 mt-8'>
      <Box className='flex justify-between items-center'>
        <DateRangePicker
          className='text-xs h-36 mt-8 w-144'
          initialLabelShrink={true}
          startDate={startDate ? dayjs(startDate) : null}
          endDate={endDate ? dayjs(endDate) : null}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        <SortingToggle
          onSortChange={handleSortChange}
          initialSort='DESC'
        />
      </Box>
      {
        !appointments?.length
          ? <Typography color='textSecondary'>No appointments found</Typography>
          : appointments?.map((appointment) =>
            <Paper
              key={appointment.id}
              className='flex justify-between px-8 py-4 rounded shadow'
            >
              <div className='flex gap-8'>
                <div className='flex items-center gap-8 '>
                  <CalendarMonth fontSize='small' />
                  <Typography className=''>{dayjs(appointment.startDateTime).format('YYYY-MM-DD')}</Typography>
                </div>
                <div className='flex items-center gap-8'>
                  <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
                </div>
              </div>
              <Button
                size='small'
                className='flex gap-8 px-8'
                color='secondary'
                disabled={!appointment.havingReport}
                // onClick={() => navigate(`report/${appointment.id}`)}
                onClick={() => {
                  dispatch(openDialog({
                    children: <StudentAppointmentReport id={appointment?.id.toString()}/>
                  }))
                }}
              >
                View report
              </Button>
            </Paper>
          )
      }
      {
        <Pagination
          page={page}
          count={data?.content?.totalPages}
          handleChange={handlePageChange}
        />
      }
    </div>
  );
}

export default StudentAppointmentList;
