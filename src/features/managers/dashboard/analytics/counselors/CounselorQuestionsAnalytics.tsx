import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ListItemAvatar, ListItemButton, Avatar, ListItemText, Divider } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllAppointmentsQuery, useGetAllQuestionCardsQuery } from "../../overview/overview-api";
import { ApexOptions } from "apexcharts";
import { Appointment, Counselor } from "@/shared/types";
import { calculateAverageRating, getCurrentMonthYear, getLastGroupedItem, groupAppointmentsByCounselingType, groupAppointmentsByDay, groupAppointmentsByDays, groupAppointmentsByMonth, groupAppointmentsByWeek, groupFeedbacksByRating, groupQuestionsByDays } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { EmailOutlined, LocalPhoneOutlined } from "@mui/icons-material";
import { NavLinkAdapter, PeriodFilter, SubHeading } from "@/shared/components";
import { periodDateRange } from "@/shared/constants";

const CounselorQuestionsAnalytics = ({ isAcademic }: { isAcademic: boolean }) => {

  const [selectedPeriod, setSelectedPeriod] = useState(`month`)

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setSelectedPeriod(event.target.value as string);
  };

  const { data: questionsData } = useGetAllQuestionCardsQuery({
    from: periodDateRange[selectedPeriod].from,
    to: periodDateRange[selectedPeriod].to,
  });

  const questions = questionsData?.content?.filter(item => isAcademic ? item.counselor?.academicDegree : !item.counselor?.academicDegree)

  const groupedByMonth = groupQuestionsByDays(questions, `month`);
  const groupedByWeek = groupQuestionsByDays(questions, `week`);
  const groupedByDay = groupQuestionsByDays(questions, `day`);

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

  const counselorAppoitmentCounts = questions?.reduce((acc, question) => {
    const counselor = JSON.stringify(question.counselor)
    if (counselor) {
      acc[counselor] = (acc[counselor] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert to an array and sort by count
  const sortedCounselorsByAppointments = counselorAppoitmentCounts && Object.entries(counselorAppoitmentCounts)
    .map(([counselor, count]) => ({
      counselor: JSON.parse(counselor) as Counselor,
      count: count as number
    }))
    .sort((a, b) => b.count - a.count);

  const counselorRatings = questions?.reduce((acc, question) => {
    const counselor = JSON.stringify(question.counselor);
    const rating = question.feedback?.rating;

    if (counselor && rating !== undefined) {
      if (!acc[counselor]) {
        acc[counselor] = { totalRating: 0, count: 0 };
      }
      acc[counselor].totalRating += rating;
      acc[counselor].count += 1;
    }

    return acc;
  }, {});

  // const ratingSeries = groupFeedbacksByRating(questions);
  // const totalFeedbacks = ratingSeries.reduce((a, b) => a + b, 0);
  // const averageRating = (
  //   ratingSeries.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalFeedbacks
  // ).toFixed(2);

  const ratings = groupFeedbacksByRating(questions);

  const totalFeedbacks = ratings.reduce((a, b) => a + b, 0);
  const averageRating = calculateAverageRating(ratings)

  const ratingSeries = ratings?.reverse()

  const ratingChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    series: ratingSeries,
    labels: ["5 ⭐", "4 ⭐", "3 ⭐", "2 ⭐", "1 ⭐"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: false, // Hide default name labels
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
            },
            total: {
              show: true,
              label: `${totalFeedbacks} Feedbacks`,
              formatter: () => `${averageRating} ⭐`, // Show total feedbacks below
            },
          },
        },
      },
    },
    legend: {
      position: "right",
    },
  };


  const completed = questions?.filter(item => item.answer).length || 0;
  const flagged = questions?.filter(item => item.status === 'FLAGGED').length || 0;
  const rejected = questions?.filter(item => item.status === 'REJECTED').length || 0;
  // Pie chart data
  const statusChartOptions: ApexOptions = {
    series: [completed, rejected, flagged],
    labels: ['Completed', 'Rejected', 'Flagged'],
    chart: {
      type: 'pie',
    },
  };

  // Convert to an array and calculate average rating
  const sortedCounselorsByAverageRating =
    counselorRatings &&
    Object.entries(counselorRatings)
      // @ts-ignore
      .map(([counselor, { totalRating, count }]) => ({
        counselor: JSON.parse(counselor) as Counselor,
        averageRating: totalRating / count,
      }))
      .sort((a, b) => b.averageRating - a.averageRating);

  console.log(`😉`, questions?.filter(question => question.feedback))
  return (
    <div className="space-y-8">
      <div className="flex justify-between gap-16">
        <SubHeading title={`Q&As Overview - ${getCurrentMonthYear()}`} className='text-xl' size='large' />
        <PeriodFilter
          onPeriodChange={handlePeriodChange}
          period={selectedPeriod}
        />
      </div>
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-2 flex flex-col gap-8">
          <Paper className="shadow p-16">
            <Typography className="font-semibold text-lg">Q&As Breakdown</Typography>
            <ReactApexChart
              options={chartOptions}
              series={chartOptions.series}
              type="bar"
              height={400}
            />
          </Paper>
          <div className="grid grid-cols-2 gap-8">
            <Paper className="p-16 space-y-8 shadow h-xs">
              <Typography className="font-semibold text-lg">Q&As Average Rating</Typography>
              <div className="">
                <ReactApexChart
                  options={ratingChartOptions}
                  series={ratingChartOptions.series}
                  type="donut"
                  height={350}
                />
              </div>
            </Paper>
            <Paper className="p-16 space-y-8 shadow h-xs">
              <Typography className="font-semibold text-lg">Q&As Statuses</Typography>
              <div className="">
                <ReactApexChart
                  options={statusChartOptions}
                  series={statusChartOptions?.series}
                  type="pie"
                  height={350}
                />
              </div>
            </Paper>
          </div>


        </div>
        <Paper className="shadow p-16">
          <Typography className="font-semibold text-lg">Top counselors by Handled Questions</Typography>
          <TableContainer className="mt-8">
            <Table>
              <TableHead className="">
                <TableRow>
                  <TableCell className="font-bold p-4 text-text-secondary">#</TableCell>
                  <TableCell className="font-bold p-4 text-text-secondary">Counselor</TableCell>
                  <TableCell className="font-bold p-4 text-text-secondary">Questions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCounselorsByAppointments?.map(({ counselor, count }, index) => (
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
                            alt={counselor?.profile.fullName}
                            src={counselor?.profile.avatarLink}
                            className='size-44'
                          />
                        </ListItemAvatar>
                        <Box className='flex flex-col gap-4'>
                          <Typography
                            component={NavLinkAdapter}
                            to={`/management/counselors/counselor/${counselor?.profile.id}`}
                            className="!underline !text-secondary-main"
                            color="secondary"
                          >
                            {counselor?.profile.fullName}
                          </Typography>
                          <Typography className="text-sm">{counselor?.expertise?.name || counselor?.major?.name}</Typography>
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
        <Paper className="shadow p-16">
          <Typography className="font-semibold text-lg">Top Counselors by Average Rating</Typography>
          <TableContainer className="mt-8">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold p-4 text-text-secondary">#</TableCell>
                  <TableCell className="font-bold p-4 text-text-secondary">Counselor</TableCell>
                  <TableCell className="font-bold p-4 text-text-secondary">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="">
                {sortedCounselorsByAverageRating?.map(({ counselor, averageRating }, index) => (
                  <TableRow key={index}
                  // sx={{
                  //   borderBottom: '2px solid #e0e0e0',
                  //   '&:last-child': {
                  //     borderBottom: 'none',
                  //   },
                  // }}
                  >
                    <TableCell className="p-0 font-semibold py-8 flex justify-center">{index + 1}</TableCell>
                    <TableCell className="p-0 font-semibold py-8">
                      <div className="flex gap-8">
                        <ListItemAvatar>
                          <Avatar
                            alt={counselor?.profile.fullName}
                            src={counselor?.profile.avatarLink}
                            className="size-44"
                          />
                        </ListItemAvatar>
                        <Box className="flex flex-col gap-4">
                          <Typography
                            component={NavLinkAdapter}
                            to={`/management/counselors/counselor/${counselor?.profile.id}`}
                            className="!underline !text-secondary-main"
                            color="secondary"
                          >
                            {counselor?.profile.fullName}
                          </Typography>
                          <Typography className="text-sm">
                            {counselor?.expertise?.name || counselor?.major?.name}
                          </Typography>
                        </Box>
                      </div>
                    </TableCell>
                    <TableCell className="p-0 font-semibold py-8 flex justify-center">{averageRating.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default CounselorQuestionsAnalytics;
