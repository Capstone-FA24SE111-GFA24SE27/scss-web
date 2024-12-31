import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllCounselingDemandsQuery } from "./overview-api";
import { ApexOptions } from "apexcharts";
import { Appointment } from "@/shared/types";
import { getLastGroupedItem, groupAppointmentsByCounselingType, groupAppointmentsByMonth } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { DatePicker } from "@mui/x-date-pickers";
import { DateRangePicker } from "@/shared/components";
import { firstDayOfMonth, lastDayOfMonth, today } from "@/shared/constants";

const DemandsDistribution = () => {
  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth);
  const { data: demandsData } = useGetAllCounselingDemandsQuery({
    from: startDate,
    to: endDate,
  });

  const demands = demandsData?.content?.map(item => {
    const { student, ...rest } = item;
    return rest;
  })

  const groupedByMonth = groupAppointmentsByMonth(demands);


  const sortedMonths = Object.keys(groupedByMonth)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .slice(0, 6);

  const academicCounts = [];
  const nonAcademicCounts = [];

  sortedMonths?.forEach(month => {
    const groupedByType = groupAppointmentsByCounselingType(groupedByMonth[month]);
    academicCounts.push(groupedByType.ACADEMIC.length || 0);
    nonAcademicCounts.push(groupedByType.NON_ACADEMIC.length || 0);
  });


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


  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  return (
    <Paper className="p-16 space-y-8">
      <div className="grid grid-cols-2 gap-16">
        <Typography className="font-semibold text-2xl">Appointments Distribution</Typography>
        <div className='flex items-start w-full gap-16'>
          <DateRangePicker
            startDate={startDate ? dayjs(startDate) : null}
            endDate={endDate ? dayjs(endDate) : null}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            className="h-12"
          />
        </div>
      </div>
      <Box className="w-full flex items-center justify-around gap-16 h-full">
        <Box className="w-full">
          <ReactApexChart
            options={statusChartOptions}
            series={statusChartOptions.series}
            type="pie"
            height={200}
          />
        </Box>
        <Box className="w-full">
          <ReactApexChart
            options={priorityLevelChartOptions}
            series={priorityLevelChartOptions.series}
            type="pie"
            height={200}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default DemandsDistribution;
