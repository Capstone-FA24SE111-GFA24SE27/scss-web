import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Chip, MenuItem, ListItemIcon, Tooltip, Typography, Paper } from '@mui/material';
import { NavLinkAdapter, DataTable } from '@shared/components';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '@shared/components';
import { AppointmentDetail } from '@/shared/pages';
import dayjs from 'dayjs';
import { useGetAllCounselingDemandsQuery } from '@/features/managers/dashboard/overview/overview-api'
import { useNavigate, useParams } from 'react-router-dom';
import { CounselingDemand } from '@/shared/types';
import { statusColor } from '@/shared/constants';
import { Visibility } from '@mui/icons-material';
import DemandDetail from '@/shared/pages/demand/DemandDetail';

function DemandTab() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const dispatch = useAppDispatch();

  // Fetch data
  const { data: demandsDataAll, isLoading } = useGetAllCounselingDemandsQuery({
  });

  const demands = demandsDataAll?.content.filter(demand => demand.counselor?.id === Number(id))


  const columns = useMemo<MRT_ColumnDef<CounselingDemand>[]>(() => [
    {
      accessorFn: (row) => row.counselor?.profile?.fullName || 'N/A', // Counselor Full Name
      header: 'Counselor',
      Cell: ({ row }) => (
        <Typography
          component={NavLinkAdapter}
          to={`/management/counselors/counselor/${row.original.counselor.profile.id}`}
          className="!underline !text-secondary-main"
          color="secondary"
        >
          {row.original.counselor.profile.fullName}
        </Typography>
      )
    },
    {
      accessorFn: (row) => row.student?.profile?.fullName || 'N/A', // Student Full Name
      header: 'Student',
      Cell: ({ row }) => (
        <Typography
          component={NavLinkAdapter}
          to={`/management/students/student/${row.original.student.profile.id}`}
          className="!underline !text-secondary-main"
          color="secondary"
        >
          {row.original.student.profile.fullName}
        </Typography>
      )
    },
    {
      accessorKey: 'priorityLevel', // Priority Level
      header: 'Priority',
      Cell: ({ row }) => (
        <Chip
          label={row.original.priorityLevel}
          variant='filled'
          color={row.original.priorityLevel === 'HIGH' ? 'error' : 'info'}
          size='small'
        />
      ),
    },
    {
      accessorKey: 'status', // Status
      header: 'Status',
      Cell: ({ row }) => (
        <Chip
          label={row.original.status}
          variant='filled'
          color={statusColor[row.original.status]} // Adjust color mapping as needed
          size='small'
        />
      ),
    },
    {
      accessorFn: (row) => dayjs(row.startDateTime).format('YYYY-MM-DD HH:mm'), // Start DateTime
      header: 'Start Date/Time',
    },
    {
      accessorFn: (row) => row.endDateTime ? dayjs(row.endDateTime).format('YYYY-MM-DD HH:mm') : 'N/A', // End DateTime
      header: 'End Date/Time',
    },
  ], []);



  return (
    <Paper className='p-16 rouned-md shadow'>


      <DataTable
        data={demands || []}
        columns={columns}
        manualPagination
        rowCount={10}
        onPaginationChange={setPagination}
        state={{ pagination }}
        enableColumnFilterModes={false}
        enableGlobalFilter={false} // Disable global search
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={0}
            onClick={() => {
              dispatch(openDialog({
                children: <DemandDetail id={row.original.id.toString()} />
              }));
              closeMenu();
              table.resetRowSelection();
            }}
          >
            <ListItemIcon>
              <Visibility />
            </ListItemIcon>
            View Detail
          </MenuItem>,
        ]}
      />
    </Paper>

  );
}

export default DemandTab;
