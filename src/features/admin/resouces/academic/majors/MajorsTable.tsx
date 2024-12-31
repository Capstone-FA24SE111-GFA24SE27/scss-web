import { useMemo, useState} from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, RemoveCircle } from '@mui/icons-material';
import { useAppDispatch } from '@shared/store';
import { useGetDepartmentsAdminQuery, useGetMajorsAdminQuery } from '../academic-data-admin-api';
import { Major } from '@/shared/types';

function MajorsTable() {
	//   const [pagination, setPagination] = useState({
	//     pageIndex: 0,
	//     pageSize: 10,
	//   });
	//   console.log(pagination)

	const [departmentsCache, setDepartmentsCache] = useState(new Map())

	const { data: departments, isLoading: isLoadingDepartment } = useGetDepartmentsAdminQuery();

	const { data, isLoading } = useGetMajorsAdminQuery();

	console.log(data)
	const dispatch = useAppDispatch();

	const findDepartmentById = (id: string | number) => {
		if(id !== null) {
			if (departmentsCache.has(id)) {
				return departmentsCache.get(id);
			  }
			  const result = departments.find((item) => item.id === id);
			  if (result) {
				setDepartmentsCache((prevCache) => new Map(prevCache).set(id, result));
			  }
			  return result ? 'No Department' : result;
		}
	}

	//   const [removeCategory] = useDeleteQuestionCategoryAdminMutation()

	const removeProducts = (ids: number[]) => {
		if (ids && ids.length > 0) {
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

	const columns = useMemo<MRT_ColumnDef<Major>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Major Name',
				Cell: ({ row }) => <Typography>{row.original.name}</Typography>,
			},

			{
				accessorKey: 'code',
				header: 'Code',
				Cell: ({ row }) => <Typography>{row.original.code}</Typography>,
			},
			{
				accessorKey: 'departmentId',
				header: 'Department',
				Cell: ({ row }) => <Typography>{departments && departments.length > 0 ? findDepartmentById(row.original.departmentId) : ''}</Typography>,
			},
		],
		[]
	);

	if (isLoading || isLoadingDepartment) {
		return <ContentLoading />;
	}

	return (
		<Paper className='flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0'>
			<DataTable
				data={data ? data : []}
				columns={columns}
				enablePagination={true}
				rowCount={data?.length || 0}
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

export default MajorsTable;
