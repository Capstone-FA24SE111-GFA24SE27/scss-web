import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter, Pagination, QuestionCardItem, openDialog } from '@shared/components';
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
  const { data, isLoading } = useGetCounselorQuestionCardsManagementQuery({
    counselorId: Number(id),
    page: pagination.pageIndex + 1,
  })
  const [page, setPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const columns = useMemo<MRT_ColumnDef<Question>[]>(() => [
    {
      accessorKey: 'student.profile.id',
      header: 'Student',
      Cell: ({ row }) => (
        <Typography
          component={NavLinkAdapter}
          to={`/management/student/${row.original.student.profile.id}`}
          className="!underline !text-secondary-main"
          color="secondary"
        >
          {row.original.student.profile.fullName}
        </Typography>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ row }) => (
        <Chip
          label={row.original.status}
          variant='filled'
          color={statusColor[row.original.status as string]}
          size='small'
        />

      )
    },
    {
      accessorKey: 'answer',
      header: 'Is answered',
      Cell: ({ row }) => (
        <div>
          {Boolean(row.original.answer) ? `true` : `false`}
        </div>
      )
    },
  ], []);

  // if (isLoading) {
  //   return <ContentLoading />;
  // }
  const questions = data?.content?.data

  return (
    // <DataTable
    //   data={data?.content.data || []}
    //   columns={columns}
    //   manualPagination
    //   rowCount={data?.content.totalElements || 0}
    //   onPaginationChange={setPagination}
    //   state={{ pagination }}
    //   enableColumnFilterModes={false}
    //   enableGlobalFilter={false} // Disable global search
    //   renderRowActionMenuItems={({ closeMenu, row, table }) => [
    //     <MenuItem
    //       key={0}
    //       onClick={() => {
    //         dispatch(openDialog({
    //           children: <AppointmentDetail id={row.original.id.toString()} />
    //         }))
    //         closeMenu();
    //         table.resetRowSelection();
    //       }}
    //     >
    //       <ListItemIcon>
    //         <Visibility />
    //       </ListItemIcon>
    //       View Detail
    //     </MenuItem>,
    //     <MenuItem
    //       key={1}
    //       onClick={() => {
    //         navigate(`report/${row.original.id}`)
    //         closeMenu();
    //         table.resetRowSelection();
    //       }}
    //     >
    //       <ListItemIcon>
    //         <Summarize />
    //       </ListItemIcon>
    //       View Report
    //     </MenuItem>

    //   ]}
    //   renderTopToolbarCustomActions={({ table }) => {
    //     const { rowSelection } = table.getState();

    //     if (Object.keys(rowSelection).length === 0) {
    //       return null;
    //     }

    //     return (
    //       <div>
    //       </div>
    //     );
    //   }}
    // />
    <div>
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

