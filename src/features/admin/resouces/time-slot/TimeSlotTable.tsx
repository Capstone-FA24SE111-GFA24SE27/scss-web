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
import {
	useDeleteTimeSlotMutation,
	useGetTimeSlotsQuery,
} from './time-slot-api';
import { useAppDispatch } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { useAppSelector } from '@shared/store';
import { selectTimeSlotSearch } from '../admin-resource-slice';
function TimeSlotTable() {
	//   const [pagination, setPagination] = useState({
	//     pageIndex: 0,
	//     pageSize: 10,
	//   });
	//   console.log(pagination)
	const keyword = useAppSelector(selectTimeSlotSearch);
	const [tableData, setTableData] = useState([]);

	const { data, isLoading } = useGetTimeSlotsQuery({});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [deleteTimeSlot] = useDeleteTimeSlotMutation();
	const removeTimeSlot = (ids: number[]) => {
		if (ids && ids.length > 0) {
			useConfirmDialog({
				dispatch,
				title: 'Are you sure you want to remove the selected time slot?',
				confirmButtonFunction: () => {
					deleteTimeSlot(ids[0])
						.then((res) => {
							if (res) {
								useAlertDialog({
									dispatch,
									title: 'Time slot removed successfully',
								});
							}
						})
						.catch((err) => {
							console.error(err);
							useAlertDialog({
								dispatch,
								title: 'An error occur while removing time slot',
								color: 'error',
							});
						});
				},
			});
		}
	};

	const updateTimeSlot = (id: number) => {
		if (id !== null) {
			navigate(`update/${id}`);
		}
	};

	const columns = useMemo<MRT_ColumnDef<TimeSlot>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Slot Name',
				Cell: ({ row }) => <Typography>{row.original.name}</Typography>,
			},

			{
				accessorKey: 'slotCode',
				header: 'Slot Code',
				Cell: ({ row }) => (
					<Typography>{row.original.slotCode}</Typography>
				),
			},
			{
				accessorKey: 'startTime',
				header: 'Start Time',
				Cell: ({ row }) => (
					<Typography className='w-fit'>
						{row.original.startTime}
					</Typography>
				),
			},
			{
				accessorKey: 'endTime',
				header: 'End Time',
				Cell: ({ row }) => (
					<Typography className='w-fit'>
						{row.original.endTime}
					</Typography>
				),
			},
		],
		[]
	);

	useEffect(() => {
		if (data && data.content) {
			const filtered = data.content.filter(
				(item) =>
					item.name.toLowerCase().includes(keyword.toLowerCase()) ||
					item.slotCode.toLowerCase().includes(keyword.toLowerCase())
			);
			console.log(keyword);
			setTableData(filtered);
		}
	}, [data, keyword]);

	if (isLoading) {
		return <ContentLoading />;
	}

	return (
		<Paper className='flex flex-col flex-auto w-full h-full mx-32 overflow-hidden shadow rounded-b-0'>
			<DataTable
				data={tableData}
				rowCount={tableData.length}
				columns={columns}
				enablePagination
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							updateTimeSlot(row.original.id);
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
							removeTimeSlot([row.original.id]);
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

export default TimeSlotTable;
