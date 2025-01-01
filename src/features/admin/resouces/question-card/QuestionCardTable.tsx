import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import {
	closeDialog,
	ContentLoading,
	DataTable,
	NavLinkAdapter,
	openDialog,
} from '@shared/components';
import {
	Chip,
	DialogActions,
	DialogContent,
	DialogTitle,
	ListItemIcon,
	MenuItem,
	Paper,
	TextField,
} from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, RemoveCircle } from '@mui/icons-material';
import { ProblemTag, TimeSlot } from '@/shared/types/admin';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { ContributedQuestionCategory, Question } from '@/shared/types';
import {
	useGetQuestionCardAdminQuery,
	usePutUpdateQuestionPublicStatusAdminMutation,
} from './question-card-api';
import {
	selectAdminQuestionCardSearch,
	selectAdminQuestionTab,
} from '../admin-resource-slice';
import EditIcon from '@mui/icons-material/Edit';
import { Controller } from 'react-hook-form';

function QuestionCardTable() {
	const tabValue = useAppSelector(selectAdminQuestionTab);

	const search = useAppSelector(selectAdminQuestionCardSearch);

	const questionTabs = [
		{ label: 'All', value: '' },
		{ label: 'Academic', value: 'ACADEMIC' },
		{ label: 'Non Academic', value: 'NON_ACADEMIC' },
	];

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data, isLoading } = useGetQuestionCardAdminQuery({
		page: pagination.pageIndex + 1,
		keyword: search,
		type:
			questionTabs[tabValue].value === ''
				? undefined
				: (questionTabs[tabValue].value as 'ACADEMIC' | 'NON_ACADEMIC'),
	});
	const dispatch = useAppDispatch();

	const removeProducts = (ids: number[]) => {
		if (ids && ids.length > 0) {
			useConfirmDialog({
				dispatch,
				title: 'Are you sure you want to remove the selected category?',
				confirmButtonFunction: () => {
					// removeCategory(ids[0]).then((res) => {
					//   if(res){
					//     useAlertDialog({
					//       dispatch, title: 'Question category removed successfully'
					//     })
					//   }
					// }).catch(err => console.error(err))
				},
			});
		}
	};

	const columns = useMemo<MRT_ColumnDef<Question>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Question title',
				Cell: ({ row }) => (
					<Typography>{row.original.title}</Typography>
				),
			},

			{
				accessorKey: 'publicStatus',
				header: 'Public Status',
				Cell: ({ row }) => (
					<Typography
						className='font-semibold'
						color={
							row.original.publicStatus === 'HIDE'
								? 'textDisabled'
								: 'primary'
						}
					>
						{row.original.publicStatus}
					</Typography>
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Typography
						className='font-semibold'
						color={
							row.original.status === 'VERIFIED'
								? 'success'
								: row.original.status === 'FLAGGED'
								? 'error'
								: row.original.status === 'REJECTED'
								? 'warning'
								: 'textDisabled'
						}
					>
						{row.original.status}
					</Typography>
				),
			},
		],
		[]
	);

	const editStatus = (ids: number[], initialStatus: string) => {
		if (ids && ids.length > 0) {
			dispatch(
				openDialog({
					children: (
						<StatusPicker ids={ids} initialStatus={initialStatus} />
					),
				})
			);
		}
	};

	if (isLoading) {
		return <ContentLoading />;
	}

	return (
		<Paper className='flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0'>
			<DataTable
				data={data?.content?.data || []}
				columns={columns}
				manualPagination={true}
				onPaginationChange={setPagination}
				state={{ pagination }}
				rowCount={data?.content?.totalElements || 0}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							editStatus(
								[row.original.id],
								row.original.publicStatus
							);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<EditIcon />
						</ListItemIcon>
						Update public status
					</MenuItem>,
				]}
				enableRowSelection={true}
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
								editStatus(
									selectedRows.map((row) => row.original.id),
									'HIDE'
								);
								table.resetRowSelection();
							}}
							className='flex shrink min-w-40 ltr:mr-8 rtl:ml-8'
							color='secondary'
						>
							<EditIcon />
							<span className='hidden mx-8 sm:flex'>
								Update Public Status of Selected Items
							</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

const StatusPicker = ({
	ids,
	initialStatus,
}: {
	ids: number[];
	initialStatus: string;
}) => {
	const dispatch = useAppDispatch();
	const [updatePublicStatus] =
		usePutUpdateQuestionPublicStatusAdminMutation();
	const [status, setStatus] = useState(initialStatus);
	const handleUpdate = async () => {
		if (ids && ids.length > 0) {
			let success = 0;
			let fail = [];
			for (const item of ids) {
				const res = await updatePublicStatus({
					questionCardId: item,
					questionCardPublicStatus: status as 'HIDE' | 'VISIBLE',
				});
				if (res && res.data?.status === 200) {
					success++;
				} else {
					fail.push(item);
				}
			}
			let successTitle = '';
			let errorTitle = '';

			if (success > 0) {
				successTitle = `Successfully update ${success} out of ${ids.length} item `;
			}

			if (fail.length > 0) {
				errorTitle = `Fail to update ${fail.length} out of ${ids.length} item`;
			}

			useAlertDialog({
				dispatch,
				title: successTitle + '.' + `\n${errorTitle}`,
				confirmFunction: () => {
					dispatch(closeDialog());
				},
			});
		}
	};

	return (
		<div className='min-w-320'>
			<DialogTitle id='alert-dialog-title'>
				Please select the status you want to update to
			</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					required
					margin='dense'
					id='status'
					name='Public status'
					label='Public status'
					select
					fullWidth
					variant='standard'
					onChange={(e) => {
						setStatus(e.target.value);
					}}
					value={status}
				>
					<MenuItem key={'Hide'} value={'HIDE'}>
						{'Hide'}
					</MenuItem>

					<MenuItem key={'Visible'} value={'VISIBLE'}>
						{'Visible'}
					</MenuItem>
				</TextField>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => dispatch(closeDialog())} color='primary'>
					Cancel
				</Button>
				<Button
					color='secondary'
					variant='contained'
					onClick={handleUpdate}
				>
					Update
				</Button>
			</DialogActions>
		</div>
	);
};

export default QuestionCardTable;
