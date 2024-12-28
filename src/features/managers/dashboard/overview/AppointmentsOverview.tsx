import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllAppointmentsQuery } from "./overview-api";
import { ApexOptions } from "apexcharts";
import { Appointment } from "@/shared/types";
import { getLastGroupedItem, groupAppointmentsByCounselingType, groupAppointmentsByDay, groupAppointmentsByMonth, groupAppointmentsByWeek } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";

const AppointmentsChart = () => {
  const { data: appointmentsData } = useGetAllAppointmentsQuery({
    from: dayjs().subtract(3, 'month').startOf('month').format("YYYY-MM-DD"),
    // to: dayjs().endOf("month").format("YYYY-MM-DD"),
    to: dayjs().add(1, 'month').endOf("month").format("YYYY-MM-DD"),
  });
  const [selectedView, setSelectedView] = useState(`month`)

  const handleViewChange = (event: SelectChangeEvent) => {
    setSelectedView(event.target.value as string);
  };

  const appointments = appointmentsData?.content?.map(item => {
    const { studentInfo, ...rest } = item;
    return rest;
  })

  const groupedByMonth = groupAppointmentsByMonth(appointments);
  const groupedByWeek = groupAppointmentsByWeek(appointments);
  const groupedByDay = groupAppointmentsByDay(appointments)

  let displayGroup = {}
  switch (selectedView) {
    case `month`:
      displayGroup = groupedByMonth
      break
    case `week`:
      displayGroup = groupedByWeek
      break
    case `day`:
      displayGroup = groupedByDay
      break
  }

  let displayView = Object.keys(displayGroup).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const academicCounts = [];
  const nonAcademicCounts = [];

  displayView?.forEach(month => {
    const groupedByType = groupAppointmentsByCounselingType(displayGroup[month]);
    academicCounts.push(groupedByType.ACADEMIC.length);
    nonAcademicCounts.push(groupedByType.NON_ACADEMIC.length);
  });

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
    },
    series: [
      {
        name: 'Academic',
        data: academicCounts,
      },
      {
        name: 'Non-Academic',
        data: nonAcademicCounts,
      },
    ],
    xaxis: {
      categories: displayView,
    },  

  };

  return (
    <Paper className="p-16 space-y-8">
      <div className="flex justify-between gap-16">
        <Typography className="font-semibold text-2xl">Appointments Overview</Typography>
        <Select value={selectedView} size='small' className='font-semibold' onChange={handleViewChange}>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="day">Day</MenuItem>
        </Select>
      </div>
      <div>
        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="bar"
          height={400}
        />
      </div>
    </Paper>
  );
};

export default AppointmentsChart;
