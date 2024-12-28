import { MaterialReactTable, useMaterialReactTable, MaterialReactTableProps, MRT_Icons } from 'material-react-table';
import _ from 'lodash';
import { useMemo } from 'react';
import { Theme } from '@mui/material/styles/createTheme';
import DataTableTopToolbar from './DataTableTopToolbar';

function DataTable<TData>(props: MaterialReactTableProps<TData>) {
	const { columns, data, ...rest } = props;

	const columnsWithIndex = useMemo(() => [
		{
			id: 'index',
			header: '#',
			accessorFn: (_, index) => index + 1, // Removed index argument
			accessorKey: undefined, // Ensure it's not confused with a key in data
			size: 50, // Set column width
			enableSorting: false, // Disable sorting for index column
			cell: ({ row }) => row.index + 1, // Access row index correctly
		},
		...columns,
	], [columns]);

	const defaults = useMemo(
		() =>
			_.defaults(rest, {
				initialState: {
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: false,
					columnPinning: {
						left: ['mrt-row-expand'], // Removed 'mrt-row-select' to disable selection box
						right: ['mrt-row-actions']
					},
					pagination: {
						pageSize: 10
					},
					enableFullScreenToggle: false
				},
				state: {
					pageIndex: 0,
					pageSize: 5, // Customize the default page size
				},
				enableFullScreenToggle: false,
				enableColumnFilterModes: true,
				enableColumnOrdering: true,
				enableGrouping: true,
				enableColumnPinning: true,
				enableFacetedValues: true,
				enableRowActions: true,
				enableRowSelection: false, // Disable row selection
				enableGlobalFilter: false, // Disable the global search functionality
				muiBottomToolbarProps: {
					className: 'flex items-center min-h-56 h-56'
				},
				muiTablePaperProps: {
					elevation: 0,
					square: true,
					className: 'flex flex-col flex-auto h-full'
				},
				muiTableContainerProps: {
					className: 'flex-auto'
				},
				enableStickyHeader: true,
				paginationDisplayMode: 'pages',
				positionToolbarAlertBanner: 'top',
				muiPaginationProps: {
					color: 'secondary',
					rowsPerPageOptions: [10, 20, 30],
					shape: 'rounded',
					variant: 'outlined',
					showRowsPerPage: false
				},
				muiSearchTextFieldProps: {
					placeholder: 'Search',
					sx: { minWidth: '300px' },
					variant: 'outlined',
					size: 'small'
				},
				muiFilterTextFieldProps: {
					variant: 'outlined',
					size: 'small',
				},
				muiSelectAllCheckboxProps: {
					className: 'w-48'
				},
				muiSelectCheckboxProps: {
					className: 'w-48'
				},
				muiTableBodyRowProps: ({ row, table }) => {
					const { density } = table.getState();

					if (density === 'compact') {
						return {
							sx: {
								backgroundColor: 'initial',
								opacity: 1,
								boxShadow: 'none',
								height: row.getIsPinned() ? `${37}px` : undefined
							}
						};
					}

					return {
						sx: {
							backgroundColor: 'initial',
							opacity: 1,
							boxShadow: 'none',
							// Set a fixed height for pinned rows
							height: row.getIsPinned() ? `${density === 'comfortable' ? 53 : 69}px` : undefined
						}
					};
				},
				muiTableHeadCellProps: ({ column }) => ({
					sx: {
						'& .Mui-TableHeadCell-Content-Labels': {
							flex: 1,
							justifyContent: 'space-between'
						},
						'& .Mui-TableHeadCell-Content-Actions': {},
						'& .MuiFormHelperText-root': {
							textAlign: 'center',
							marginX: 0,
							color: (theme: Theme) => theme.palette.text.disabled,
							fontSize: 11
						},
						backgroundColor: (theme) => (column.getIsPinned() ? theme.palette.background.paper : 'inherit')
					}
				}),
				mrtTheme: (theme) => ({
					baseBackgroundColor: theme.palette.background.paper,
					menuBackgroundColor: theme.palette.background.paper,
					pinnedRowBackgroundColor: theme.palette.background.paper,
					pinnedColumnBackgroundColor: theme.palette.background.paper
				}),
			} as Partial<MaterialReactTableProps<TData>>),
		[rest]
	);

	const table = useMaterialReactTable<TData>({
		// @ts-ignore
		columns: columnsWithIndex,
		data,
		...defaults,
		...rest
	});

	return <MaterialReactTable table={table} />;
}

export default DataTable;
