import { NavLinkAdapter, PeriodFilter, SubHeading } from "@/shared/components";
import { periodDateRange } from "@/shared/constants";
import { Counselor } from "@/shared/types";
import { getCurrentMonthYear, groupDemandsByDays } from "@/shared/utils";
import { Avatar, Box, ListItemAvatar, Paper, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetAllCounselingDemandsQuery } from "../../overview/overview-api";

const SupportStaffAnalytics = () => {
	// const { data: demandsData } = useGetAllCounselingDemandsQuery({
	// 	from: dayjs().subtract(3, 'month').startOf('month').format("YYYY-MM-DD"),
	// 	to: dayjs().add(1, 'month').endOf("month").format("YYYY-MM-DD"),
	// });
	const [selectedPeriod, setSelectedPeriod] = useState(`month`)

	const handlePeriodChange = (event: SelectChangeEvent) => {
		setSelectedPeriod(event.target.value as string);
	};

	const { data: demandsData } = useGetAllCounselingDemandsQuery({
		from: periodDateRange[selectedPeriod].from,
		to: periodDateRange[selectedPeriod].to,
	});

	const demands = demandsData?.content


	const groupedByMonth = groupDemandsByDays(demands, `month`);
	const groupedByWeek = groupDemandsByDays(demands, `week`);
	const groupedByDay = groupDemandsByDays(demands, `day`);

	let displayGroup = {};
	switch (selectedPeriod) {
		case "month":
			displayGroup = groupedByMonth;
			break;
		case "week":
			displayGroup = groupedByWeek;
			break;
		case "day":
			displayGroup = groupedByDay;
			break;
	}

	let displayView = Object.keys(displayGroup).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

	const totalCounts = displayView.map(period => displayGroup[period].length);

	const chartOptions: ApexOptions = {
		chart: {
			type: 'bar',
		},
		series: [
			{
				name: 'Total Appointments',
				data: totalCounts,
			},
		],
		xaxis: {
			categories: displayView,
		},
	};

	const supportStaffAppoitmentCounts = demands?.reduce((acc, demand) => {
		const supportStaff = JSON.stringify(demand.supportStaff)
		if (supportStaff) {
			acc[supportStaff] = (acc[supportStaff] || 0) + 1;
		}
		return acc;
	}, {});

	// Convert to an array and sort by count
	const sortedSupportStaffsByDemands = supportStaffAppoitmentCounts && Object.entries(supportStaffAppoitmentCounts)
		.map(([supportStaff, count]) => ({
			supportStaff: JSON.parse(supportStaff) as Counselor,
			count: count as number
		}))
		.sort((a, b) => b.count - a.count);

	const completed = demands?.filter(item => item.status === 'DONE').length || 0;
	const processing = demands?.filter(item => item.status === 'PROCESSING').length || 0;
	const low = demands?.filter(item => item.priorityLevel === 'LOW').length || 0;
	const medium = demands?.filter(item => item.priorityLevel === 'MEDIUM').length || 0;
	const high = demands?.filter(item => item.priorityLevel === 'HIGH').length || 0;
	const urgent = demands?.filter(item => item.priorityLevel === 'URGENT').length || 0;

	// Pie chart data
	const statusChartOptions: ApexOptions = {
		series: [completed, processing],
		labels: ['Completed', 'Processing'],
		chart: {
			type: 'pie',
		},
	};

	const priorityLevelChartOptions: ApexOptions = {
		series: [low, medium, high, urgent],
		labels: ['Low', 'Medium', 'High', 'Urgent'],
		chart: {
			type: 'pie',
		},
	};

	return (
		<div className="p-16">
			<div className="p-16 space-y-8">
				<div className="flex justify-between gap-16">
					<SubHeading title={`Counseling Demands Overview - ${getCurrentMonthYear()}`} className='text-xl' size='large' />
					<PeriodFilter
						onPeriodChange={handlePeriodChange}
						period={selectedPeriod}
					/>
				</div>
				<div className="grid grid-cols-3 gap-8">
					<div className="flex flex-col gap-8">
						<Paper className="shadow p-16 h-full">
							<Typography className="font-semibold text-lg">Demands Breakdown</Typography>
							<ReactApexChart
								options={chartOptions}
								series={chartOptions.series}
								type="bar"
								height={560}
							/>
						</Paper>
					</div>
					<div className="flex flex-col gap-8">
						<Paper className="p-16 space-y-8 shadow h-xs">
							<Typography className="font-semibold text-lg">Demands Statuses Distribution</Typography>
							<div className="">
								<ReactApexChart
									options={statusChartOptions}
									series={statusChartOptions.series}
									type="donut"
									height={240}
								/>
							</div>
						</Paper>
						<Paper className="p-16 space-y-8 shadow h-xs">
							<Typography className="font-semibold text-lg">Demands Priorities Distribution</Typography>
							<div className="">
								<ReactApexChart
									options={priorityLevelChartOptions}
									series={priorityLevelChartOptions?.series}
									type="pie"
									height={240}
								/>
							</div>
						</Paper>
					</div>
					<Paper className="shadow p-16">
						<Typography className="font-semibold text-lg">Top Support Staffs by Demands Assignemnt</Typography>
						<TableContainer className="mt-8">
							<Table>
								<TableHead className="">
									<TableRow>
										<TableCell className="font-bold p-4 text-text-secondary">#</TableCell>
										<TableCell className="font-bold p-4 text-text-secondary">Support Staff</TableCell>
										<TableCell className="font-bold p-4 text-text-secondary">Demands</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{sortedSupportStaffsByDemands?.map(({ supportStaff, count }, index) => (
										<TableRow key={index}
										// sx={{
										//   mt: 8,
										//   borderBottom: '2px solid #e0e0e0',
										//   '&:last-child': {
										//     borderBottom: 'none',
										//   },
										// }}
										>
											<TableCell className="p-0 font-semibold py-8 flex justify-center">{index + 1}</TableCell>
											<TableCell className="p-0 font-semibold py-8 pt-8">
												<div className="flex gap-8">
													<ListItemAvatar>
														<Avatar
															alt={supportStaff.profile.fullName}
															src={supportStaff.profile.avatarLink}
															className='size-44'
														/>
													</ListItemAvatar>
													<Box className='flex flex-col gap-4'>
														<Typography
															component={NavLinkAdapter}
															to={`/management/supportStaffs/supportStaff/${supportStaff.profile.id}`}
															className="!underline !text-secondary-main"
															color="secondary"
														>
															{supportStaff.profile.fullName}
														</Typography>
														<Typography className="text-sm">{supportStaff.expertise?.name || supportStaff.major?.name}</Typography>
													</Box>
												</div>
											</TableCell>
											<TableCell className="p-0 font-semibold py-8 flex justify-center">{count}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</div>
			</div>
		</div>
	);
};

export default SupportStaffAnalytics;
