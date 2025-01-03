import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper, Tooltip } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { CheckCircle, Circle, Delete, Info, RemoveCircle, Report, Summarize } from '@mui/icons-material';
import { Appointment, AppointmentRequest } from '@/shared/types';
import dayjs from 'dayjs';
import { meetingTypeColor, statusColor } from '@/shared/constants';
import { useGetCounselorAppointmentRequestsAdminQuery } from '../admin-counselor-api';
function RequestsTable() {

  const { id } = useParams()
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useGetCounselorAppointmentRequestsAdminQuery(Number(id))
  console.log(data)


  const removeProducts = (ids: string[]) => {

  };

  const columns = useMemo<MRT_ColumnDef<AppointmentRequest>[]>(() => [
    {
      accessorFn: (row) => dayjs(row.requireDate).format('YYYY-MM-DD'),
      header: 'Date',
    },
    {
      accessorFn: (row) => `${dayjs(row.startTime, "HH:mm:ss").format('HH:mm')} - ${dayjs(row.startTime, "HH:mm:ss").format('HH:mm')}`,
      header: 'Time',
    },
    {
      accessorKey: 'fullname',
      header: 'Student',
      Cell: ({ row }) => (
        <Typography
          component={NavLinkAdapter}
          to={`/management/counselor/${row.original.student.profile.id}`}
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
          color={statusColor[row.original.status]}
          size='small'
        />

      )
    },
    {
      accessorKey: 'meetingType',
      header: 'Meeting Type',
      Cell: ({ row }) => (
        <div>
          <Chip
            label={row.original.meetingType}
            size='small'
            icon={<Circle color={meetingTypeColor[row.original.meetingType as string]} />}
            className='items-center font-semibold'
          />
        </div>
      )
    },
  ], []);

  // if (isLoading) {
  //   return <ContentLoading />;
  // }


  return (
    <DataTable
      data={data?.content.data || []}
      columns={columns}
      manualPagination
      rowCount={data?.content.totalElements || 0}
      onPaginationChange={setPagination}
      state={{ pagination }}
      enableColumnFilterModes={false}
      enableGlobalFilter={false} // Disable global search
      renderRowActionMenuItems={({ closeMenu, row, table }) => [
        <MenuItem
          key={0}
          onClick={() => {
            closeMenu();
            table.resetRowSelection();
            navigate(`report/${row.original.id}`)
          }}
        >
          <ListItemIcon>
            <Summarize />
          </ListItemIcon>
          View Report
        </MenuItem>
      ]}
      renderTopToolbarCustomActions={({ table }) => {
        const { rowSelection } = table.getState();

        if (Object.keys(rowSelection).length === 0) {
          return null;
        }

        return (
          <div>
          </div>
        );
      }}
    />

  );
}

export default RequestsTable;

