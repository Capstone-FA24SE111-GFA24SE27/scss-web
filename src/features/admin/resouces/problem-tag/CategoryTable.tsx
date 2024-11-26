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
import { useGetProblemTagsCategoriesQuery, useGetProblemTagsQuery } from './problem-tag-api';
import { ManagementCounselor } from '@/features/managers/management/counselors/counselors-api';
import { ProblemTag, ProblemTagCategory } from '@/shared/types/admin';
function CategoryTable() {

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  console.log(pagination)
  const [tableData, setTableData] = useState([])

  const { data, isLoading } = useGetProblemTagsCategoriesQuery({
    page: pagination.pageIndex + 1
  })

  console.log(data)


  const columns = useMemo<MRT_ColumnDef<ProblemTagCategory>[]>(() => [
    {
      id: 'avatarLink',
      header: 'ID',
      size: 32,
      Cell: ({ row }) => (
          <Typography >{row.original.id}</Typography>
      )
    },
    {
      accessorKey: 'name',
      header: 'Tag Name',
      Cell: ({ row }) => (
        <Typography
        >
          {row.original.name}
        </Typography>
      )
    },

  ], []);

  useEffect(() => {
    if(data){
         setTableData(data.slice((pagination.pageIndex)*(pagination.pageSize), (pagination.pageIndex+1)*(pagination.pageSize)))
    }
  },[data])


  if (isLoading) {
    return <ContentLoading />;
  }


  return (
    <Paper
      className="flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0"
    >
      <DataTable
        data={tableData}
        columns={columns}
        manualPagination
        rowCount={data ? data.length : 1}
        onPaginationChange={setPagination}
        state={{ pagination }}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={0}
            onClick={() => {
              // removeProducts([row.original.id]);
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

export default CategoryTable;

