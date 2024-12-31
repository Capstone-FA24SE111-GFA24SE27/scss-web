import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { useGetCounselorQuestionCardsManagementQuery } from "../counselors-api";
import { ApexOptions } from "apexcharts";
import { groupQuestionsByDay, groupQuestionsByDays, groupQuestionsByWeek } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { PeriodFilter } from "@/shared/components";
import { firstDayOfMonth, lastDayOfMonth } from "@/shared/constants";

const CounselorQuestionsOverview = ({ counselorId }: { counselorId?: string }) => {
  const { id: routeId } = useParams()
  const id = counselorId || routeId

  const { data: questionsData } = useGetCounselorQuestionCardsManagementQuery({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
    counselorId: Number(id),
    size: 9999,
  });

  const [selectedPeriod, setSelectedPeriod] = useState(`month`)

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setSelectedPeriod(event.target.value as string);
  };

  const questions = questionsData?.content?.data.map(item => {
    const { student, ...rest } = item;
    return rest;
  });


  // const groupedByMonth = groupQuestionsByMonth(questions);
  const groupedByMonth = groupQuestionsByDays(questions);
  const groupedByWeek = groupQuestionsByWeek(questions);
  const groupedByDay = groupQuestionsByDay(questions);

  console.log(`😢`, groupedByMonth)

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
        name: 'Total Questions',
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
        <Typography className="font-semibold text-2xl">Q&As Workload</Typography>
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

export default CounselorQuestionsOverview;
