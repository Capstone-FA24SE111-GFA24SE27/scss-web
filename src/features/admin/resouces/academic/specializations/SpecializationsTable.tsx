import { useEffect, useMemo, useState } from 'react';
import { MRT_Updater, type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, Edit, RemoveCircle } from '@mui/icons-material';
import { useAppDispatch } from '@shared/store';
import {
	useGetDepartmentsAdminQuery,
	useGetMajorsAdminQuery,
	useGetSpecializationsAdminQuery,
} from '../academic-data-admin-api';
import { Major, Specialization } from '@/shared/types';
import { useAppSelector } from '@shared/store';
import {
	selectSpecializationFilter,
	setSpecializationFilter,
} from '../../admin-resource-slice';
import { useNavigate } from 'react-router-dom';

function SpecializationsTable() {
	const filter = useAppSelector(selectSpecializationFilter);
	const { keyword, page, size, sortDirection } = filter;

	const [pagination, setPagination] = useState({
		pageIndex: page - 1,
		pageSize: size,
	});

	const { data: departmentsData, isLoading: isLoadingDepartment } =
		useGetDepartmentsAdminQuery({ size: 999 });

	const { data: majorsData, isLoading: isLoadingMajor } =
		useGetMajorsAdminQuery({
			size: 999,
		});

	const { data, isLoading } = useGetSpecializationsAdminQuery({
		keyword,
		page: pagination.pageIndex + 1,
		size: pagination.pageSize,
		sortDirection: sortDirection as 'ASC' | 'DESC',
	});

	console.log('spe', data);
	const departments = departmentsData?.data;
	const majors = majorsData?.data;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (pagination) {
			dispatch(
				setSpecializationFilter({
					page: pagination.pageIndex + 1,
					size: pagination.pageSize,
					...filter,
				})
			);
		}
	}, [pagination]);

	const findDepartmentById = (id: string | number) => {
		if (id !== null) {
			const result = departments.find((item) => item.id === id);
			return !result ? 'No Department' : result.name;
		}
	};

	const findMajorById = (id: string | number) => {
		if (id !== null) {
			const result = majors.find((item) => item.id === id);
			return !result ? 'No Major' : result.name;
		}
	};

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

	const updateSpecialization = (id: number) => {
		if (id !== null) {
			navigate(`specialization/form/${id}`);
		}
	};

	const columns = useMemo<MRT_ColumnDef<Specialization>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Specialization Name',
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
				Cell: ({ row }) => (
					<Typography>
						{departments && departments.length > 0
							? findDepartmentById(row.original.departmentId)
							: ''}
					</Typography>
				),
			},
			{
				accessorKey: 'majorId',
				header: 'Major',
				Cell: ({ row }) => (
					<Typography>
						{majors && majors.length > 0
							? findMajorById(row.original.majorId)
							: ''}
					</Typography>
				),
			},
		],
		[]
	);

	if (isLoading || isLoadingDepartment || isLoadingMajor) {
		return <ContentLoading />;
	}

	return (
		<Paper className='flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0'>
			<DataTable
				data={data?.data || []}
				columns={columns}
				manualPagination
				rowCount={data?.totalElements || 0}
				onPaginationChange={setPagination}
				state={{ pagination }}
				enableRowActions={false}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							updateSpecialization(row.original.id);
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

export default SpecializationsTable;
