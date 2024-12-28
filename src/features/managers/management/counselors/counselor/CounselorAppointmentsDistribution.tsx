import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import { ApexOptions } from "apexcharts";
import { Appointment } from "@/shared/types";
import { getLastGroupedItem, groupAppointmentsByCounselingType, groupAppointmentsByMonth } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { DatePicker } from "@mui/x-date-pickers";
import { DateRangePicker } from "@/shared/components";
import { firstDayOfMonth, lastDayOfMonth, today } from "@/shared/constants";
import { useParams } from "react-router-dom";
import { useGetCounselorAppointmentsManagementQuery } from "../counselors-api";

const CounselorAppointmentsDistribution = () => {
  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth);
  const { id } = useParams()

  const { data: appointmentsData } = useGetCounselorAppointmentsManagementQuery({
    fromDate: dayjs().subtract(3, 'month').startOf('month').format("YYYY-MM-DD"),
    // to: dayjs().endOf("month").format("YYYY-MM-DD"),
    toDate: dayjs().add(1, 'month').endOf("month").format("YYYY-MM-DD"),
    counselorId: Number(id),
    size: 9999,
  });

  const appointments = appointmentsData?.content?.data.map(item => {
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
    academicCounts.push(groupedByType.ACADEMIC.length);
    nonAcademicCounts.push(groupedByType.NON_ACADEMIC.length);
  });


  const completed = appointments?.filter(item => item.status === 'ATTEND').length;
  const canceled = appointments?.filter(item => item.status === 'CANCELED').length;
  const expired = appointments?.filter(item => item.status === 'EXPIRED').length;
  const waiting = appointments?.filter(item => item.status === 'WAITING').length;
  const absent = appointments?.filter(item => item.status === 'ABSENT').length;
  const online = appointments?.filter(item => item.meetingType === 'ONLINE').length;
  const offline = appointments?.filter(item => item.meetingType === 'OFFLINE').length;

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

  if (!appointments) {
    return <Typography className="text-text-secondary text-lg mt-16">No data to display</Typography>;
  }

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

export default CounselorAppointmentsDistribution;