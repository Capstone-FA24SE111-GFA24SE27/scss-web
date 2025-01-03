import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, Edit, RemoveCircle } from '@mui/icons-material';
import {
	useDeleteProblemTagsCategoryMutation,
	useGetProblemTagsCategoriesQuery,
} from './problem-tag-api';
import { ProblemTag, ProblemTagCategory } from '@/shared/types/admin';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { selectProblemTagCategorySearch, setProblemTagCategoryUpdate } from '../admin-resource-slice';
import { useNavigate } from 'react-router-dom';
function CategoryTable() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const keyword = useAppSelector(selectProblemTagCategorySearch);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [tableData, setTableData] = useState([]);

	const { data, isLoading } = useGetProblemTagsCategoriesQuery({});

	const [removeCategory] = useDeleteProblemTagsCategoryMutation();

	const removeProducts = (ids: number[]) => {
		if (ids && ids.length > 0) {
			useConfirmDialog({
				dispatch,
				title: 'Are you sure you want to remove the selected category?',
				confirmButtonFunction: () => {
					removeCategory({ id: ids[0] })
						.then((res) => {
							if (res) {
								useAlertDialog({
									dispatch,
									title: 'Category removed successfully',
								});
							}
						})
						.catch((err) => console.error(err));
				},
			});
		}
	};

	const columns = useMemo<MRT_ColumnDef<ProblemTagCategory>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Tag Name',
				Cell: ({ row }) => <Typography>{row.original.name}</Typography>,
			},
		],
		[]
	);

	const updateCategory = (item: ProblemTagCategory) => {
		if (item) {
			console.log(item)
			dispatch(setProblemTagCategoryUpdate(item));
			navigate(`category/update/${item.id}`);
		}
	};


	useEffect(() => {
		if (data) {
			const filtered = data.filter((item) =>
				item.name.toLowerCase().includes(keyword.toLowerCase())
			);
			setTableData(
				filtered.slice(
					pagination.pageIndex * pagination.pageSize,
					(pagination.pageIndex + 1) * pagination.pageSize
				)
			);
		}
	}, [data, keyword]);

	if (isLoading) {
		return <ContentLoading />;
	}

	return (
		<Paper className='flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0'>
			<DataTable
				data={tableData}
				rowCount={tableData.length}
				columns={columns}
				manualPagination
				onPaginationChange={setPagination}
				state={{ pagination }}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							updateCategory(row.original);
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
						key={1}
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

export default CategoryTable;
