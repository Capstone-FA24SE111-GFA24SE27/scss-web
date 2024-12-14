import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, RemoveCircle } from '@mui/icons-material';
import { ProblemTag, TimeSlot } from '@/shared/types/admin';
import { useDeleteTimeSlotMutation, useGetTimeSlotsQuery } from './time-slot-api';
import { useAppDispatch } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
function TimeSlotTable() {

//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   console.log(pagination)

  const { data, isLoading } = useGetTimeSlotsQuery({})
  const dispatch = useAppDispatch()

  const [removeTimeSlot] = useDeleteTimeSlotMutation()


  const removeProducts = (ids: number[]) => {
    if(ids && ids.length > 0) {
      useConfirmDialog({
				dispatch,
				title: 'Are you sure you want to remove the selected time slot?',
				confirmButtonFunction: () => {
          removeTimeSlot(ids[0]).then((res) => {
            if(res){
              useAlertDialog({
                dispatch, title: 'Time slot removed successfully'
              })
            }
          }).catch(err => console.error(err))
				},
			});
    
    }
  };

  const columns = useMemo<MRT_ColumnDef<TimeSlot>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Slot Name',
      Cell: ({ row }) => (
        <Typography
        >
          {row.original.name}
        </Typography>
      )
    },
 
    {
      accessorKey: 'slotCode',
      header: 'Slot Code',
      Cell: ({ row }) => (
        <Typography
        >
          {row.original.slotCode}
        </Typography>
      )
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      Cell: ({ row }) => (
        <Typography className='w-fit'
        >
          {row.original.startTime}
        </Typography>
      )
    },
    {
        accessorKey: 'endTime',
        header: 'End Time',
        Cell: ({ row }) => (
          <Typography className='w-fit'
          >
            {row.original.endTime}
          </Typography>
        )
      },

  ], []);

  if (isLoading) {
    return <ContentLoading />;
  }


  return (
    <Paper
      className="flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0"
    >
      <DataTable
        data={data?.content || []}
        columns={columns}
        enablePagination={false}
        rowCount={data?.content.length || 0}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={0}
            onClick={() => {
              removeProducts([row.original.id]);
              closeMenu();
              table.resetRowSelection();
            }}
          >
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            Delete
          </MenuItem>
        ]}
        enableRowSelection={false}
        renderTopToolbarCustomActions={({ table }) => {
          const { rowSelection } = table.getState();

          if (Object.keys(rowSelection).length === 0) {
            return null;
          }

          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().rows;
                // removeProducts(selectedRows.map((row) => row.original.id));
                table.resetRowSelection();
              }}
              className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
              color="secondary"
            >
              <Delete />
              <span className="hidden mx-8 sm:flex">Delete selected items</span>
            </Button>
          );
        }}
      />
    </Paper>
  );
}

export default TimeSlotTable;

