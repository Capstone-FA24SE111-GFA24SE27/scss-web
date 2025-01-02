import { Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { useGetCounselorAppointmentsManagementQuery } from "../counselors-api";
import dayjs from "dayjs";
import { firstDayOfMonth, lastDayOfMonth } from "@/shared/constants";
import { calculateAverageRating, groupFeedbacksByRating } from "@/shared/utils";

const CounselorAppointmentFeedbacksDistribution = ({ counselorId }: { counselorId?: string }) => {
  const { id: routeId } = useParams()
  const id = counselorId || routeId
  const { data: appointmentsData } = useGetCounselorAppointmentsManagementQuery({
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
    counselorId: Number(id),
    size: 9999,
  });

  const ratings = groupFeedbacksByRating(appointmentsData?.content?.data);

  const totalFeedbacks = ratings.reduce((a, b) => a + b, 0);
  const averageRating = calculateAverageRating(ratings)

  const ratingSeries = ratings?.reverse()

  const chartOptions: ApexCharts.ApexOptions = {
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

  return (
    <Paper className="p-16 space-y-8 shadow h-sm">
      <Typography className="font-semibold text-2xl">Appointment Average Rating</Typography>
      <div className="pt-32">
        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="donut"
          height={350}
        />
      </div>
    </Paper>
  );
};

export default CounselorAppointmentFeedbacksDistribution;
