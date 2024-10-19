import { MaterialReactTable, useMaterialReactTable, MaterialReactTableProps, MRT_Icons } from 'material-react-table';
import _ from 'lodash';
import { useMemo } from 'react';
import { Theme } from '@mui/material/styles/createTheme';
import DataTableTopToolbar from './DataTableTopToolbar';
function DataTable<TData>(props: MaterialReactTableProps<TData>) {
	const { columns, data, ...rest } = props;

	const defaults = useMemo(
		() =>
			_.defaults(rest, {
				initialState: {
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageSize: 10
					},
					enableFullScreenToggle: false
				},
				state: {
					pageIndex: 0,
					pageSize: 5, //customize the default page size
				},
				enableFullScreenToggle: false,
				enableColumnFilterModes: true,
				enableColumnOrdering: true,
				enableGrouping: true,
				enableColumnPinning: true,
				enableFacetedValues: true,
				enableRowActions: true,
				enableRowSelection: true,
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
				// enableStickyFooter: true,
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
					sx: {
						'& .MuiInputBase-root': {
							padding: '0px 8px',
							height: '32px!important',
							minHeight: '32px!important'
						}
					}
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
				// renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
				// icons: tableIcons
			} as Partial<MaterialReactTableProps<TData>>),
		[rest]
	);

	const table = useMaterialReactTable<TData>({
		columns,
		data,
		...defaults,
		...rest
	});

	return <MaterialReactTable table={table} />;
}

export default DataTable;
