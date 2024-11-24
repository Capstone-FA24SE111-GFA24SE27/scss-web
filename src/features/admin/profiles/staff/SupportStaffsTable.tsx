import { useMemo, useState, useEffect, ChangeEvent } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, FilterTabs, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _, { words } from 'lodash';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, RemoveCircle } from '@mui/icons-material';
import { Account, Role } from '@/shared/types';
import { clsx} from 'clsx';
import { useGetSupportStaffsFilterAdminQuery } from './admin-staffs-api';
import useDebounceValue from '@/shared/hooks/useDebounceValue';
import BlockIcon from '@mui/icons-material/Block';

type Props = {}

const SupportStaffsTable = (props: Props) => {
  const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

  const [search, setSearch] = useState('');


  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    
    setSearch(useDebounceValue(event.target.value, 500))
  }


  const handleBlockAccount = (id: number) => {
    
  }

	console.log(pagination);

	const { data, isLoading } = useGetSupportStaffsFilterAdminQuery({
		page: pagination.pageIndex + 1,
	});
	console.log(data);

	const removeProducts = (ids: string[]) => {};

	const columns = useMemo<MRT_ColumnDef<Account>[]>(
		() => [
			{
				accessorKey: 'id',
				header: 'ID',
      size: 64,
      Cell: ({ row }) => (
					<Typography
					>
						{row.original.id}
					</Typography>
				),
			},
      {
				accessorFn: (row) => row.profile.avatarLink,
				id: 'profile',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className='flex items-center justify-center'>
						<img
							className='block w-full rounded max-h-40 max-w-40'
							src={row.original.profile.avatarLink}
							alt={row.original.profile.fullName}
						/>
					</div>
				),
			},
      {
				accessorKey: 'profile.fullName',
				header: 'Full name',
				Cell: ({ row }) => (
					<Typography
						component={NavLinkAdapter}
						to={`${row.original.profile.id}`}
						className='!underline !text-secondary-main'
						color='secondary'
					>
						{row.original.profile.fullName}
					</Typography>
				),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				Cell: ({ row }) => (
					<Typography
					>
						{row.original.email}
					</Typography>
				),
			},
	
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Typography className={clsx(row.original.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600', 'font-semibold  ')}>
						{row.original.status}
					</Typography>
				),
			},
		],
		[]
	);

	if (isLoading) {
		return <ContentLoading />;
	}
  return (
    <Paper className='flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0'>
      
			<DataTable
				data={data?.content.data || []}
				columns={columns}
				manualPagination
				rowCount={data?.content.totalElements || 1}
				onPaginationChange={setPagination}
				state={{ pagination }}
        
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							handleBlockAccount(row.original.id)
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<BlockIcon />
						</ListItemIcon>
						Block
					</MenuItem>,
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant='contained'
							size='small'
							onClick={() => {
								const selectedRows =
									table.getSelectedRowModel().rows;
								// removeProducts(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className='flex shrink min-w-40 ltr:mr-8 rtl:ml-8'
							color='secondary'
						>
							<Delete />
							<span className='hidden mx-8 sm:flex'>
								Delete selected items
							</span>
						</Button>
					);
				}}
			/>
		</Paper>
  )
}

export default SupportStaffsTable