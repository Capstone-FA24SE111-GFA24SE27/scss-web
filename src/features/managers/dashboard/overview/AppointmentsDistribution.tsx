import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllAppointmentsQuery } from "./overview-api";
import { ApexOptions } from "apexcharts";
import { Appointment } from "@/shared/types";
import { getLastGroupedItem, groupAppointmentsByCounselingType, groupAppointmentsByMonth } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { DatePicker } from "@mui/x-date-pickers";
import { DateRangePicker } from "@/shared/components";
import { firstDayOfMonth, lastDayOfMonth, today } from "@/shared/constants";

const AppointmentsDistribution = () => {
  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth);
  const { data: appointmentsData } = useGetAllAppointmentsQuery({
    from: startDate,
    to: endDate,
  });

  const appointments = appointmentsData?.content?.map(item => {
    const { studentInfo, ...rest } = item;
    return rest;
  })

  const groupedByMonth = groupAppointmentsByMonth(appointments);


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


  const completed = appointments?.filter(item => item.status === 'ATTEND').length || 0;
  const canceled = appointments?.filter(item => item.status === 'CANCELED').length || 0;
  const expired = appointments?.filter(item => item.status === 'EXPIRED').length || 0;
  const waiting = appointments?.filter(item => item.status === 'WAITING').length || 0;
  const absent = appointments?.filter(item => item.status === 'ABSENT').length || 0;
  const online = appointments?.filter(item => item.meetingType === 'ONLINE').length || 0;
  const offline = appointments?.filter(item => item.meetingType === 'OFFLINE').length || 0;

  // Pie chart data
  const statusChartOptions: ApexOptions = {
    series: [completed, waiting, absent, canceled, expired],
    labels: ['Completed', 'Waiting', 'Canceled', 'Absent', 'Expired',],
    chart: {
      type: 'pie',
    },
  };

  const meetingTypeChartOptions: ApexOptions = {
    series: [online, offline],
    labels: ['Online', 'Offline'],
    chart: {
      type: 'pie',
    },
    colors: ['#2196f3', '#9e9e9e'], // Tailwind-compatible blue and gray
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
            options={meetingTypeChartOptions}
            series={meetingTypeChartOptions.series}
            type="pie"
            height={200}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default AppointmentsDistribution;
