import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { useGetCounselorAppointmentsManagementQuery } from "../counselors-api";
import { ApexOptions } from "apexcharts";
import { groupAppointmentsByDay, groupAppointmentsByDays, groupAppointmentsByMonth, groupAppointmentsByWeek } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { PeriodFilter } from "@/shared/components";
import { firstDayOfMonth, lastDayOfMonth } from "@/shared/constants";

const CounselorAppointmentsWorkload = ({ counselorId }: { counselorId?: string }) => {
  const { id: routeId } = useParams()
  const id = counselorId || routeId

  const { data: appointmentsData } = useGetCounselorAppointmentsManagementQuery({
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
    counselorId: Number(id),
    size: 9999,
  });
  const [selectedPeriod, setSelectedPeriod] = useState(`month`)

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setSelectedPeriod(event.target.value as string);
  };

  const appointments = appointmentsData?.content?.data.map(item => {
    const { studentInfo, ...rest } = item;
    return rest;
  });

  // const groupedByMonth = groupAppointmentsByMonth(appointments);
  const groupedByMonth = groupAppointmentsByDays(appointments);
  const groupedByWeek = groupAppointmentsByWeek(appointments);
  const groupedByDay = groupAppointmentsByDay(appointments);

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

  return (
    <Paper className="p-16 space-y-8 shadow">
      <div className="flex justify-between gap-16">
        <Typography className="font-semibold text-2xl">Appointments Workload</Typography>
        {/* <PeriodFilter
          onPeriodChange={handlePeriodChange}
          period={selectedPeriod}
        /> */}
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

export default CounselorAppointmentsWorkload;
