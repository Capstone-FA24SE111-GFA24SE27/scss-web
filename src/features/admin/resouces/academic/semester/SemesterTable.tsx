import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, RemoveCircle } from '@mui/icons-material';
import { ProblemTag, TimeSlot } from '@/shared/types/admin';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { ContributedQuestionCategory, Department } from '@/shared/types';
import {
	useGetDepartmentsAdminQuery,
	useGetSemesterAdminQuery,
} from '../academic-data-admin-api';
import { Semester } from '@/shared/services';
import { selectSemesterSearchAdmin } from '../../admin-resource-slice';
function SemestersTable() {
	//   const [pagination, setPagination] = useState({
	//     pageIndex: 0,
	//     pageSize: 10,
	//   });
	//   console.log(pagination)
	const keyword = useAppSelector(selectSemesterSearchAdmin);
	const { data, isLoading } = useGetSemesterAdminQuery();
	const dispatch = useAppDispatch();
	const [tableData, setTableData] = useState([]);

	console.log(data)
	useEffect(() => {
		if (data && data.length > 0 ) {
			const filtered = data.filter((item) =>
				item?.name?.toLowerCase().includes(keyword?.toLowerCase() || ``)
			);
			setTableData(filtered);
		}
	}, [data, keyword]);

	const columns = useMemo<MRT_ColumnDef<Semester>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Semester Name',
				Cell: ({ row }) => <Typography>{row.original.name}</Typography>,
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
				data={tableData}
				columns={columns}
				enablePagination={true}
				rowCount={tableData.length || 0}
				enableRowActions={false}
				// renderRowActionMenuItems={({ closeMenu, row, table }) => [
				// 	<MenuItem
				// 		key={0}
				// 		onClick={() => {
				// 			removeProducts([row.original.id]);
				// 			closeMenu();
				// 			table.resetRowSelection();
				// 		}}
				// 	>
				// 		<ListItemIcon>
				// 			<Delete />
				// 		</ListItemIcon>
				// 		Delete
				// 	</MenuItem>,
				// ]}
				enableRowSelection={false}
				// renderTopToolbarCustomActions={({ table }) => {
				// 	const { rowSelection } = table.getState();

				// 	if (Object.keys(rowSelection).length === 0) {
				// 		return null;
				// 	}

				// 	return (
				// 		<Button
				// 			variant='contained'
				// 			size='small'
				// 			onClick={() => {
				// 				const selectedRows =
				// 					table.getSelectedRowModel().rows;
				// 				// removeProducts(selectedRows.map((row) => row.original.id));
				// 				table.resetRowSelection();
				// 			}}
				// 			className='flex shrink min-w-40 ltr:mr-8 rtl:ml-8'
				// 			color='secondary'
				// 		>
				// 			<Delete />
				// 			<span className='hidden mx-8 sm:flex'>
				// 				Delete selected items
				// 			</span>
				// 		</Button>
				// 	);
				// }}
			/>
		</Paper>
	);
}

export default SemestersTable;
