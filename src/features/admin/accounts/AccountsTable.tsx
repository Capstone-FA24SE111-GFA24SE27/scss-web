import { useMemo, useState, useEffect, ChangeEvent } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import {
	ContentLoading,
	DataTable,
	FilterTabs,
	NavLinkAdapter,
} from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, RemoveCircle } from '@mui/icons-material';
import { Account, Role } from '@/shared/types';
import {
	useGetAccountsQuery,
	usePutBlockAccountByIdMutation,
	usePutUnblockAccountByIdMutation,
} from './admin-accounts-api';
import { clsx } from 'clsx';
import useDebounceValue from '@/shared/hooks/useDebounceValue';
import dayjs from 'dayjs';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import { useAppDispatch } from '@shared/store';
import useConfirmDialog from '@/shared/hooks/form/useConfirmDialog';

type Props = {
	selectedRole: Role;
};

const AccountsTable = (props: Props) => {
	const { selectedRole } = props;
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const dispatch = useAppDispatch();

	const [search, setSearch] = useState('');

	const { data, isLoading } = useGetAccountsQuery({
		page: pagination.pageIndex + 1,
		role: selectedRole,
	});
	console.log(data);

	const [blockAccountById] = usePutBlockAccountByIdMutation();
	const [unblockAccountById] = usePutUnblockAccountByIdMutation();

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setSearch(useDebounceValue(event.target.value, 500));
	};

	const handleBlockAccount = (id: number) => {
		console.log(id);
		useConfirmDialog({
			dispatch,
			confirmButtonFunction: () => {
				if (id) {
					blockAccountById({ id, role: selectedRole })
						.unwrap()
						.then((result) => {
							if (result) {
								useAlertDialog({
									dispatch,
									title: result.message,
								});
							}
						})
						.catch((err) => console.log(err));
				}
			},
			title: 'Are you sure you want to block this account?',
		});
	};

	const handleUnblockAccount = (id: number) => {
		console.log(id);
		useConfirmDialog({
			dispatch,
			confirmButtonFunction: () => {
				if (id) {
					unblockAccountById({ id, role: selectedRole })
						.unwrap()
						.then((result) => {
							if (result) {
								useAlertDialog({
									dispatch,
									title: result.message,
								});
							}
						})
						.catch((err) => console.log(err));
				}
			},
			title: 'Are you sure you want to unblock this account?',
		});
	};

	// const handleBlockMultipleAccounts = (selected: number[]) => {
	// 	console.log(selected);
	// 	if (selected.length > 0) {
	// 		blockAccountById({id, role: selectedRole})
	// 			.unwrap()
	// 			.then((result) => console.log(result))
	// 			.catch((err) => console.log(err));
	// 	}
	// };

	const columns = useMemo<MRT_ColumnDef<Account>[]>(
		() => [
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
				accessorKey: 'profile.dateOfBirth',
				header: 'Birthdate',
				Cell: ({ row }) => (
					<Typography className='w-fit'>
						{dayjs(row.original.profile.dateOfBirth).format(
							'DD-MM-YYYY'
						)}
					</Typography>
				),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				Cell: ({ row }) => (
					<Typography>{row.original.email}</Typography>
				),
			},
			{
				accessorKey: 'profile.phoneNumber',
				header: 'Phone number',
				Cell: ({ row }) => (
					<Typography className='w-fit'>
						{row.original.profile.phoneNumber}
					</Typography>
				),
			},
			{
				accessorKey: 'profile.gender',
				header: 'Gender',
				Cell: ({ row }) => (
					<Typography className='w-min'>
						{row.original.profile.gender}
					</Typography>
				),
			},

			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Typography
						className={clsx(
							row.original.status === 'ACTIVE'
								? 'text-green-600'
								: 'text-red-600',
							'font-semibold  '
						)}
					>
						{row.original.status}
					</Typography>
				),
			},
			// {
			// 	accessorKey: 'profile',
			// 	header: 'Email',
			// 	Cell: ({ row }) => (
			// 		<Typography
			// 		>
			// 			{row.original.email}
			// 		</Typography>
			// 	),
			// },
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
							if (row.original.status === 'ACTIVE') {
								handleBlockAccount(row.original.id);
							} else {
								handleUnblockAccount(row.original.id);
							}
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<Delete />
						</ListItemIcon>
						{row.original.status === 'ACTIVE' ? 'Block' : 'Unblock'}
					</MenuItem>,
				]}
				enableRowSelection={false}
				// 	renderTopToolbarCustomActions={({ table }) => {
				// 		const { rowSelection } = table.getState();

				// 		if (Object.keys(rowSelection).length === 0) {
				// 			return null;
				// 		}

				// 		return (
				// 			<Button
				// 				variant='contained'
				// 				size='small'
				// 				onClick={() => {
				// 					const selectedRows =
				// 						table.getSelectedRowModel().rows;
				// 					handleBlockMultipleAccounts(selectedRows.map((row) => row.original.id));
				// 					table.resetRowSelection();
				// 				}}
				// 				className='flex shrink min-w-40 ltr:mr-8 rtl:ml-8'
				// 				color='secondary'
				// 			>
				// 				<Delete />
				// 				<span className='hidden mx-8 sm:flex'>
				// 					Block slected accounts
				// 				</span>
				// 			</Button>
				// 		);
				// 	}}
			/>
		</Paper>
	);
};

export default AccountsTable;
