import { NavLinkAdapter, PeriodFilter, SubHeading } from "@/shared/components";
import { periodDateRange } from "@/shared/constants";
import { Counselor } from "@/shared/types";
import { getCurrentMonthYear, groupDemandsByDays } from "@/shared/utils";
import { Avatar, Box, ListItemAvatar, Paper, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetAllCounselingDemandsQuery } from "@/features/managers/dashboard/overview/overview-api";
import { useParams } from "react-router-dom";

const CounselorDemandsOverview = ({ counselorId }: { counselorId?: string }) => {
  const { id: routeId } = useParams()
  const id = counselorId || routeId
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

  const demands = demandsData?.content?.filter(item => item.counselor?.id === Number(id))


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
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <Paper className="shadow p-16">
            <Typography className="font-semibold text-2xl">Demands Workload</Typography>
            <ReactApexChart
              options={chartOptions}
              series={chartOptions.series}
              type="bar"
            />
          </Paper>
        </div>
        <Paper className="flex flex-col gap-16 shadow p-16">
          <Typography className="font-semibold text-2xl">Demands Distribution</Typography>
          <div className="w-full flex items-center justify-around gap-16 h-full">
            <Box className="w-full">
              <ReactApexChart
                options={statusChartOptions}
                series={statusChartOptions.series}
                type="donut"
                height={240}
              />
            </Box>
            <Box className="w-full">
              <ReactApexChart
                options={priorityLevelChartOptions}
                series={priorityLevelChartOptions?.series}
                type="pie"
                height={240}
              />
            </Box>
          </div>
        </Paper>
      </div>
    </div >
  );
};

export default CounselorDemandsOverview;
