import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, Edit, RemoveCircle } from '@mui/icons-material';
import { ProblemTag, TimeSlot } from '@/shared/types/admin';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import {
	useDeleteQuestionCategoryAdminMutation,
	useGetContributedQuestionCardCategoryQuery,
} from '../question-card-api';
import { ContributedQuestionCategory } from '@/shared/types';
import { selectAdminQuestionCardSearchCategory } from '../../admin-question-slice';
function QuestionCardCategoryTable() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	//   console.log(pagination)
	const [tableData, setTableData] = useState([]);

	const keyword = useAppSelector(selectAdminQuestionCardSearchCategory);

	const { data: fetchedData, isLoading } =
		useGetContributedQuestionCardCategoryQuery();
	const data = fetchedData?.content;

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [removeCategory] = useDeleteQuestionCategoryAdminMutation();

	const removeProducts = (ids: number[]) => {
		if (ids && ids.length > 0) {
			useConfirmDialog({
				dispatch,
				title: 'Are you sure you want to remove the selected category?',
				confirmButtonFunction: () => {
					removeCategory(ids[0])
						.then((res) => {
							if (res) {
								useAlertDialog({
									dispatch,
									title: 'Question category removed successfully',
								});
							}
						})
						.catch((err) => console.error(err));
				},
			});
		}
	};

	const updateCategory = (id: number) => {
		if (id !== null) {
			navigate(`update/${id}`);
		}
	};

	const columns = useMemo<MRT_ColumnDef<ContributedQuestionCategory>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Category Name',
				Cell: ({ row }) => <Typography>{row.original.name}</Typography>,
			},

			{
				accessorKey: 'type',
				header: 'Type',
				Cell: ({ row }) => <Typography>{row.original.type}</Typography>,
			},
		],
		[]
	);

	useEffect(() => {
		if (data) {
			const filtered = data.filter((item) =>
				item.name.toLowerCase().includes(keyword.toLowerCase())
			);
			console.log(keyword);
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
				columns={columns}
				manualPagination
				onPaginationChange={setPagination}
				state={{ pagination }}
				rowCount={tableData?.length}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							updateCategory(row.original.id);
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

export default QuestionCardCategoryTable;
