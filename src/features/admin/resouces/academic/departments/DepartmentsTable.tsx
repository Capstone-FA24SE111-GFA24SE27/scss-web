import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import {
	ContentLoading,
	DataTable,
	NavLinkAdapter,
	SearchField,
} from '@shared/components';
import { Chip, ListItemIcon, Menu, MenuItem, Paper } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, Edit, RemoveCircle } from '@mui/icons-material';
import { ProblemTag, TimeSlot } from '@/shared/types/admin';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { ContributedQuestionCategory, Department } from '@/shared/types';
import {
	useDeleteDepartmentByIdAdminMutation,
	useGetDepartmentsAdminQuery,
} from '../academic-data-admin-api';
import {
	selectDepartmentFilter,
	setDepartmentFilter,
} from '../../admin-resource-slice';
function DepartmentsTable() {
	const filter = useAppSelector(selectDepartmentFilter);
	const { keyword, page, size, sortDirection } = filter;

	console.log(keyword)

	const [pagination, setPagination] = useState({
		pageIndex: page - 1,
		pageSize: size,
	});

	const { data, isLoading } = useGetDepartmentsAdminQuery({
		keyword,
		page: pagination.pageIndex + 1,
		size: pagination.pageSize,
		sortDirection: sortDirection as 'ASC' | 'DESC',
	});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	console.log(data);
	const [removeDepartment] = useDeleteDepartmentByIdAdminMutation();

	const handlePagination = (value) => {
		console.log(value());
		// setPagination(value);
		// dispatch(
		// 	setDepartmentFilter({
		// 		page: value.pageIndex + 1,
		// 		size: value.pageSize,
		// 		...filter,
		// 	})
		// );
	};

	const removeProduct = (id: number) => {
		if (id) {
			//   useConfirmDialog({
			// 			dispatch,
			// 			title: 'Are you sure you want to remove the selected category?',
			// 			confirmButtonFunction: () => {
			//       removeCategory(ids[0]).then((res) => {
			//         if(res){
			//           useAlertDialog({
			//             dispatch, title: 'Question category removed successfully'
			//           })
			//         }
			//       }).catch(err => console.error(err))
			// 			},
			// 		});
		}
	};

	const updateDepartment = (id: number) => {
		if (id !== null) {
			navigate(`department/form/${id}`);
		}
	};

	const columns = useMemo<MRT_ColumnDef<Department>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Department Name',
				Cell: ({ row }) => <Typography>{row.original.name}</Typography>,
			},

			{
				accessorKey: 'code',
				header: 'Code',
				Cell: ({ row }) => <Typography>{row.original.code}</Typography>,
			},
		],
		[]
	);

	

	useEffect(() => {
		if (pagination) {
			dispatch(
				setDepartmentFilter({
					page: pagination.pageIndex + 1,
					size: pagination.pageSize,
					...filter,
				})
			);
		}
	}, [pagination]);

	if (isLoading) {
		return <ContentLoading />;
	}

	return (
		<Paper className='flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0'>
			
			<DataTable
				data={data?.data || []}
				columns={columns}
				manualPagination={true}
				rowCount={data?.totalElements || 0}
				onPaginationChange={setPagination}
				state={{ pagination }}
				enableRowActions={false}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							updateDepartment(row.original.id);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<Edit />
						</ListItemIcon>
						Update
					</MenuItem>,
					<MenuItem
						key={0}
						onClick={() => {
							removeProduct(row.original.id);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<Delete />
						</ListItemIcon>
						Delete
					</MenuItem>,
				]}
				enableRowSelection={false}
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
	);
}

export default DepartmentsTable;
