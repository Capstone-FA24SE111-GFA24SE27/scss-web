import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper, Box, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ListItemAvatar, ListItemButton, Avatar, ListItemText, Divider } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllAppointmentsQuery } from "../../overview/overview-api";
import { ApexOptions } from "apexcharts";
import { Appointment, Counselor } from "@/shared/types";
import { calculateAverageRating, getCurrentMonthYear, getLastGroupedItem, groupAppointmentsByDays, groupAppointmentsByCounselingType, groupAppointmentsByDay, groupAppointmentsByMonth, groupAppointmentsByWeek, groupFeedbacksByRating } from "@/shared/utils";
import ReactApexChart from "react-apexcharts";
import { EmailOutlined, LocalPhoneOutlined } from "@mui/icons-material";
import { NavLinkAdapter, PeriodFilter, SubHeading } from "@/shared/components";
import { firstDay4PreviousMonth, firstDayOfMonth, lastDayOfMonth, periodDateRange } from "@/shared/constants";

const CounselorAppointmentsAnalytics = ({ isAcademic }: { isAcademic: boolean }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(`month`)

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setSelectedPeriod(event.target.value as string);
  };

  const { data: appointmentsData } = useGetAllAppointmentsQuery({
    from: periodDateRange[selectedPeriod].from,
    to: periodDateRange[selectedPeriod].to,
  });

  const appointments = appointmentsData?.content?.filter(item => isAcademic ? item.counselorInfo?.academicDegree : !item.counselorInfo?.academicDegree)
  // const appointmentsLast4Months = appointmentsDataLast4MonthsData?.content?.filter(item => isAcademic ? item.counselorInfo?.academicDegree : !item.counselorInfo?.academicDegree)

  const groupedByMonth = groupAppointmentsByDays(appointments, `month`);
  const groupedByWeek = groupAppointmentsByDays(appointments, `week`);
  const groupedByDay = groupAppointmentsByDays(appointments, `day`);
  // console.log(`👉`, appointments?.map(item =>{
  //   const { studentInfo, counselorInfo, ...rest } = item;
  //   return rest;
  // }))

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

  const counselorAppoitmentCounts = appointments?.reduce((acc, appointment) => {
    const counselorInfo = JSON.stringify(appointment.counselorInfo)
    if (counselorInfo) {
      acc[counselorInfo] = (acc[counselorInfo] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert to an array and sort by count
  const sortedCounselorsByAppointments = counselorAppoitmentCounts && Object.entries(counselorAppoitmentCounts)
    .map(([counselorInfo, count]) => ({
      counselorInfo: JSON.parse(counselorInfo) as Counselor,
      count: count as number
    }))
    .sort((a, b) => b.count - a.count);

  const counselorRatings = appointments?.reduce((acc, appointment) => {
    const counselorInfo = JSON.stringify(appointment.counselorInfo);
    const rating = appointment.appointmentFeedback?.rating;

    if (counselorInfo && rating !== undefined) {
      if (!acc[counselorInfo]) {
        acc[counselorInfo] = { totalRating: 0, count: 0 };
      }
      acc[counselorInfo].totalRating += rating;
      acc[counselorInfo].count += 1;
    }

    return acc;
  }, {});

  // const ratingSeries = groupFeedbacksByRating(appointments);
  // const totalFeedbacks = ratingSeries.reduce((a, b) => a + b, 0);
  // const averageRating = (
  //   ratingSeries.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalFeedbacks
  // ).toFixed(2);

  const ratings = groupFeedbacksByRating(appointments);

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


  const completed = appointments?.filter(item => item.status === 'ATTEND')?.length || 0
  const canceled = appointments?.filter(item => item.status === 'CANCELED')?.length || 0
  const expired = appointments?.filter(item => item.status === 'EXPIRED')?.length || 0
  const waiting = appointments?.filter(item => item.status === 'WAITING')?.length || 0
  const absent = appointments?.filter(item => item.status === 'ABSENT')?.length || 0
  const online = appointments?.filter(item => item.meetingType === 'ONLINE')?.length || 0
  const offline = appointments?.filter(item => item.meetingType === 'OFFLINE')?.length || 0
  // Pie chart data
  const statusChartOptions: ApexOptions = {
    series: [completed, waiting, absent, canceled, expired],
    labels: ['Completed', 'Waiting', 'Absent', 'Canceled', 'Expired'],
    chart: {
      type: 'pie',
    },
  };

  // Convert to an array and calculate average rating
  const sortedCounselorsByAverageRating =
    counselorRatings &&
    Object.entries(counselorRatings)
      // @ts-ignore
      .map(([counselorInfo, { totalRating, count }]) => ({
        counselorInfo: JSON.parse(counselorInfo) as Counselor,
        averageRating: totalRating / count,
      }))
      .sort((a, b) => b.averageRating - a.averageRating);

  return (
    <div className="space-y-8">
      <div className="flex justify-between gap-16">
        <SubHeading title={`Appointments Overview - ${getCurrentMonthYear()}`} className='text-xl' size='large' />
        <PeriodFilter
          onPeriodChange={handlePeriodChange}
          period={selectedPeriod}
        />
      </div>
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-2 flex flex-col gap-8">
          <Paper className="shadow p-16">
            <Typography className="font-semibold text-lg">Appointments Breakdown</Typography>
            <ReactApexChart
              options={chartOptions}
              series={chartOptions.series}
              type="bar"
              height={360}
            />
          </Paper>
          <div className="grid grid-cols-2 gap-8">
            <Paper className="p-16 space-y-8 shadow">
              <Typography className="font-semibold text-lg">Appointment Average Rating</Typography>
              <div className="">
                <ReactApexChart
                  options={ratingChartOptions}
                  series={ratingChartOptions.series}
                  type="donut"
                 
                />
              </div>
            </Paper>
            <Paper className="p-16 space-y-8 shadow">
              <Typography className="font-semibold text-lg">Appointment Statuses</Typography>
              <div className="">
                <ReactApexChart
                  options={statusChartOptions}
                  series={statusChartOptions?.series}
                  type="pie"
                 
                />
              </div>
            </Paper>
          </div>


        </div>
        <Paper className="shadow p-16">
          <Typography className="font-semibold text-lg">Top counselors by Handled Sessions</Typography>
          <TableContainer className="mt-8">
            <Table>
              <TableHead className="">
                <TableRow>
                  <TableCell className="font-bold p-4 text-text-secondary">#</TableCell>
                  <TableCell className="font-bold p-4 text-text-secondary">Counselor</TableCell>
                  <TableCell className="font-bold p-4 text-text-secondary">Sessions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCounselorsByAppointments?.map(({ counselorInfo, count }, index) => (
                  <TableRow key={index}
                  // sx={{
                  //   mt: 8,
                  //   borderBottom: '2px solid #e0e0e0',
                  //   '&:last-child': {
                  //     borderBottom: 'none',
                  //   },
                  // }}
                  >
                    <TableCell className="p-0 text-text-secondary py-8 flex justify-center">{index + 1}</TableCell>
                    <TableCell className="p-0 font-semibold py-8 pt-8">
                      <div className="flex gap-8">
                        <ListItemAvatar>
                          <Avatar
                            alt={counselorInfo.profile.fullName}
                            src={counselorInfo.profile.avatarLink}
                            className='size-44'
                          />
                        </ListItemAvatar>
                        <Box className='flex flex-col gap-4'>
                          <Typography
                            component={NavLinkAdapter}
                            to={`/management/counselors/counselor/${counselorInfo.profile.id}`}
                            className="!underline !text-secondary-main"
                            color="secondary"
                          >
                            {counselorInfo.profile.fullName}
                          </Typography>
                          <Typography className="text-sm">{counselorInfo.expertise?.name || counselorInfo.major?.name}</Typography>
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
                {sortedCounselorsByAverageRating?.map(({ counselorInfo, averageRating }, index) => (
                  <TableRow key={index}
                  // sx={{
                  //   borderBottom: '2px solid #e0e0e0',
                  //   '&:last-child': {
                  //     borderBottom: 'none',
                  //   },
                  // }}
                  >
                    <TableCell className="p-0 text-text-secondary py-8 flex justify-center">{index + 1}</TableCell>
                    <TableCell className="p-0 font-semibold py-8">
                      <div className="flex gap-8">
                        <ListItemAvatar>
                          <Avatar
                            alt={counselorInfo.profile.fullName}
                            src={counselorInfo.profile.avatarLink}
                            className="size-44"
                          />
                        </ListItemAvatar>
                        <Box className="flex flex-col gap-4">
                          <Typography
                            component={NavLinkAdapter}
                            to={`/management/counselors/counselor/${counselorInfo.profile.id}`}
                            className="!underline !text-secondary-main"
                            color="secondary"
                          >
                            {counselorInfo.profile.fullName}
                          </Typography>
                          <Typography className="text-sm">
                            {counselorInfo.expertise?.name || counselorInfo.major?.name}
                          </Typography>
                        </Box>
                      </div>
                    </TableCell>
                    <TableCell className="p-0 font-semibold py-8 flex justify-center text-yellow-900">{averageRating.toFixed(2)}</TableCell>
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

export default CounselorAppointmentsAnalytics;
