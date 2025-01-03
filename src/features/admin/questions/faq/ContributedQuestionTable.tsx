import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import {
	ContentLoading,
	DataTable,
	NavLinkAdapter,
	openDialog,
} from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
	CheckCircle,
	Delete,
	Edit,
	RemoveCircle,
	Visibility,
} from '@mui/icons-material';
import { ProblemTag, TimeSlot } from '@/shared/types/admin';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';

import {
	ContributedQuestionAdmin,
	ContributedQuestionCategory,
	Counselor,
	Question,
} from '@/shared/types';
import { useGetContributedQuestionAdminQuery } from './question-card-api';
import { selectContributedQuestionFilter } from '../admin-question-slice';
import ContributedQuestionCardDetail from './ContributedQuestionCardDetail';
function ContributedQuestionTable() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	//   consol                         e.log(pagination)

	const filter = useAppSelector(selectContributedQuestionFilter);
	const { category, search, status } = filter;

	const { data, isLoading } = useGetContributedQuestionAdminQuery({
		page: pagination.pageIndex + 1,
		size: pagination.pageSize,
		query: search,
		status: status,
		categoryId: category?.id,
	});

	console.log(data);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	// const removeProducts = (ids: number[]) => {
	// 	if (ids && ids.length > 0) {
	// 		useConfirmDialog({
	// 			dispatch,
	// 			title: 'Are you sure you want to remove the selected category?',
	// 			confirmButtonFunction: () => {
	// 				// removeCategory(ids[0])
	// 				// 	.then((res) => {
	// 				// 		if (res) {
	// 				// 			useAlertDialog({
	// 				// 				dispatch,
	// 				// 				title: 'Question category removed successfully',
	// 				// 			});
	// 				// 		}
	// 				// 	})
	// 				// 	.catch((err) => console.error(err));
	// 			},
	// 		});
	// 	}
	// };

	const getParamRole = (counselor: Counselor) => {
		if (counselor?.expertise) {
			return 'na-counselor';
		} else {
			return 'a-counselor';
		}
	};

	const updateVisibility = (id: number) => {
		if (id !== null) {
			navigate(`update/${id}`);
		}
	};

	const columns = useMemo<MRT_ColumnDef<ContributedQuestionAdmin>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Question Title',
				Cell: ({ row }) => (
					<Typography>{row.original.title}</Typography>
				),
			},
			{
				accessorKey: 'question',
				header: 'Question',
				Cell: ({ row }) => (
					<Typography>{row.original.question}</Typography>
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Typography
						className='font-semibold'
						color={
							row.original.status === 'HIDE'
								? 'textDisabled'
								: 'primary'
						}
					>
						{row.original.status}
					</Typography>
				),
			},
			{
				accessorKey: 'counselor.profile.fullName',
				header: 'Counselor',
				Cell: ({ row }) => (
					<Typography
						component={NavLinkAdapter}
						to={`/accounts/${
							row.original.counselor.id
						}/${getParamRole(row.original.counselor)}`}
						className='!underline !text-secondary-main'
						color='secondary'
					>
						{row.original.counselor.profile.fullName}
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
				data={data?.content?.data || []}
				columns={columns}
				manualPagination
				onPaginationChange={setPagination}
				state={{ pagination }}
				pageCount={data?.content?.totalPages || 1}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={1}
						onClick={() => {
							dispatch(
								openDialog({
									children: (
										<ContributedQuestionCardDetail
											question={row.original}
										/>
									),
								})
							);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<Visibility />
						</ListItemIcon>
						View Detail
					</MenuItem>,
					<MenuItem
						key={0}
						onClick={() => {
							updateVisibility(row.original.id);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<Edit />
						</ListItemIcon>
						Update Visibility Status
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

export default ContributedQuestionTable;
