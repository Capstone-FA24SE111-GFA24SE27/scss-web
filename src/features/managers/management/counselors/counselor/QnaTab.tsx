import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, DateRangePicker, NavLinkAdapter, Pagination, QuestionCardItem, SearchField, openDialog } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper, Tooltip } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { CheckCircle, Circle, Delete, Info, RemoveCircle, Report, Summarize, Visibility } from '@mui/icons-material';
import { useGetCounselorAppointmentsManagementQuery, useGetCounselorQuestionCardsManagementQuery } from '../counselors-api';
import { Appointment, Question } from '@/shared/types';
import dayjs from 'dayjs';
import { meetingTypeColor, statusColor } from '@/shared/constants';
import { useAppDispatch } from '@shared/store';
import { AppointmentDetail } from '@/shared/pages';
function QnaTab() {

  const { id } = useParams()
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const dispatch = useAppDispatch()

  const [page, setPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };



  const { data, isLoading } = useGetCounselorQuestionCardsManagementQuery({
    counselorId: Number(id),
    page: pagination.pageIndex + 1,
    from: startDate,
    to: endDate,
    keyword: searchTerm,
  })

  const questions = data?.content?.data

  return (
    <div className='space-y-8'>
      <div className='flex gap-16'>
        <SearchField
          label='Question keyword'
          placeholder='Enter question keyword'
          onSearch={handleSearch}
          className='w-full'
        />
        <DateRangePicker
          startDate={startDate ? dayjs(startDate) : null}
          endDate={endDate ? dayjs(endDate) : null}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>
      <div className='flex flex-col gap-16'>
        {
          !questions?.length
            ? <div className='text-center p-32 '>
              <Typography variant='h5' className='text-text-disabled'>No qna found</Typography>
            </div>
            : data?.content?.data.map(qna => <QuestionCardItem qna={qna} />)
        }
      </div>
      {/* <Pagination
        page={page}
        count={data?.content?.totalPages}
        handleChange={handlePageChange}
      /> */}
    </div>
  );
}

export default QnaTab;

