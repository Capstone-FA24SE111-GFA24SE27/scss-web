import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { useGetCounselorQuestionCardsManagementQuery } from "../counselors-api";
import { ApexOptions } from "apexcharts";
import { groupQuestionsByDay, groupQuestionsByMonth, groupQuestionsByWeek } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";

const CounselorQuestionsOverview = () => {
  const { id } = useParams();

  const { data: questionsData } = useGetCounselorQuestionCardsManagementQuery({
    from: dayjs().subtract(3, 'month').startOf('month').format("YYYY-MM-DD"),
    to: dayjs().endOf("month").format("YYYY-MM-DD"),
    counselorId: Number(id),
    size: 9999,
  });

  const [selectedView, setSelectedView] = useState("month");

  const handleViewChange = (event: SelectChangeEvent) => {
    setSelectedView(event.target.value as string);
  };

  const questions = questionsData?.content?.data.map(item => {
    const { student, ...rest } = item;
    return rest;
  });

  const groupedByMonth = groupQuestionsByMonth(questions);
  const groupedByWeek = groupQuestionsByWeek(questions);
  const groupedByDay = groupQuestionsByDay(questions);

  const monthDisplay = Object.keys(groupedByMonth)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .slice(0, 2);

  const weekDisplay = Object.keys(groupedByWeek)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const dayDisplay = Object.keys(groupedByDay)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let displayView = [];
  let displayGroup = {};

  switch (selectedView) {
    case "month":
      displayView = monthDisplay;
      displayGroup = groupedByMonth;
      break;
    case "week":
      displayView = weekDisplay;
      displayGroup = groupedByWeek;
      break;
    case "day":
      displayView = dayDisplay;
      displayGroup = groupedByDay;
      break;
  }

  const totalCounts = displayView.map(timePeriod => displayGroup[timePeriod].length);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
    },
    series: [
      {
        name: 'Total Questions',
        data: totalCounts,
      },
    ],
    xaxis: {
      categories: displayView,
    },
  };

  return (
    <Paper className="p-16 space-y-8">
      <div className="flex justify-between gap-16">
        <Typography className="font-semibold text-2xl">Q&As Workload</Typography>
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
          height={350}
        />
      </div>
    </Paper>
  );
};

export default CounselorQuestionsOverview;
