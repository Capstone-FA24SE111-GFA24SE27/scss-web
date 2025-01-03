import { StudentDocument } from '@/shared/types';
import { CalendarMonth, Circle, Summarize } from '@mui/icons-material';
import { Box, Chip, ListItem, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetStudentAppointmentsQuery, useGetStudentDocumentDetailQuery } from './student-api';
import { ContentLoading, DateRangePicker, ItemMenu, Pagination, SortingToggle, openDialog } from '@/shared/components';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch } from '@shared/store';
import StudentAppointmentReport from './StudentAppointmentReport';
import { statusColor } from '@/shared/constants';
import { StudentDetailAppointmentItem } from '.';
/**
 * The contact view.
 */

interface StudentDetailAppointmentListProps {
  student: StudentDocument
}
function StudentDetailAppointmentList({ id }: { id: string }) {
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
      <Box className='flex flex-col gap-8'>
        {
          !appointments?.length
            ? <Typography color='textSecondary'>No appointments found</Typography>
            : appointments?.map((appointment) =>
              <StudentDetailAppointmentItem
                key={appointment.id}
                appointment={appointment}
              />
            )
        }
      </Box>

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

export default StudentDetailAppointmentList;
