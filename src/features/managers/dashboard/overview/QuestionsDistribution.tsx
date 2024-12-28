import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllAppointmentsQuery, useGetAllQuestionCardsQuery } from "./overview-api";
import { ApexOptions } from "apexcharts";
import { Appointment } from "@/shared/types";
import { getLastGroupedItem, groupAppointmentsByCounselingType, groupAppointmentsByMonth } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { DatePicker } from "@mui/x-date-pickers";
import { DateRangePicker } from "@/shared/components";
import { firstDayOfMonth, lastDayOfMonth, today } from "@/shared/constants";

const QuestionsDistribution = () => {
  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth);
  const { data: appointmentsData } = useGetAllQuestionCardsQuery({
    from: startDate,
    to: endDate,
  });

  const appointments = appointmentsData?.content?.map(item => {
    const { student, ...rest } = item;
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


  const completed = appointments?.filter(item => item.answer).length;
  const flagged = appointments?.filter(item => item.status === 'FLAGGED').length;
  const rejected = appointments?.filter(item => item.status === 'REJECTED').length;
  const easy = appointments?.filter(item => item.difficultyLevel === 'Easy').length;
  const medium = appointments?.filter(item => item.difficultyLevel === 'Medium').length;
  const hard = appointments?.filter(item => item.difficultyLevel === 'Hard').length;


  // Pie chart data
  const statusChartOptions: ApexOptions = {
    series: [completed, rejected, flagged],
    labels: ['Completed', 'Canceled', 'Absent'],
    chart: {
      type: 'pie',
    },
  };

  const meetingTypeChartOptions: ApexOptions = {
    series: [easy, medium, hard ],
    labels: ['Easy', 'Medium', 'Hard'],
    chart: {
      type: 'pie',
    },
  };

  if (!appointments) {
    return <Typography className="text-text-secondary text-lg mt-16">No data to display</Typography>;
  }

  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  return (
    <Paper className="p-16 space-y-8">
      <div className="grid grid-cols-2 gap-16">
        <Typography className="font-semibold text-2xl">Q&As Distribution</Typography>
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
      <Box className="w-full flex flex-wrap justify-center items-center gap-8 h-full p-8">
        {/* <ReactApexChart
          options={statusChartOptions}
          series={statusChartOptions.series}
          type="pie"
          height={150}
        />
        <ReactApexChart
          options={meetingTypeChartOptions}
          series={meetingTypeChartOptions.series}
          type="pie"
          height={150}
        />
        <ReactApexChart
          options={meetingTypeChartOptions}
          series={meetingTypeChartOptions.series}
          type="pie"
          height={150}
        /> */}
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
      </Box>
    </Paper>
  );
};

export default QuestionsDistribution;
