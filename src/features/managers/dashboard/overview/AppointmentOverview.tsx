import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Typography, Paper } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllAppointmentsQuery } from "./overview-api";
import { ApexOptions } from "apexcharts";

// Pie Chart Data Helper Functions
const getPieChartData = (appointmentsData) => {
  const appointments = appointmentsData?.content;
  let completed = 0;
  let canceled = 0;
  let expired = 0;
  let online = 0;
  let offline = 0;
  let active = 0;
  let passive = 0;

  appointments.forEach((appointment) => {
    // Count status-based data
    if (appointment.status === "ATTEND") completed++;
    if (appointment.status === "CANCELED") canceled++;
    if (appointment.status === "EXPIRED") expired++;

    // Count meeting type-based data
    if (appointment.meetingType === "ONLINE") online++;
    if (appointment.meetingType === "OFFLINE") offline++;

    // Active and passive bookings
    active++; // All are active
    passive = 0; // No passive appointments in this example
  });

  return {
    completed,
    canceled,
    expired,
    online,
    offline,
    active,
    passive,
  };
};

const AppointmentChart = () => {
  const [chartData, setChartData] = useState({ academic: [], nonAcademic: [] });
  const [statusPieData, setStatusPieData] = useState({ completed: 0, canceled: 0, expired: 0 });
  const [meetingTypePieData, setMeetingTypePieData] = useState({ online: 0, offline: 0 });
  const [activePieData, setActivePieData] = useState({ active: 0, passive: 0 });
  const [selectedPieTitle, setSelectedPieTitle] = useState(""); // Title for selected pie chart
  const [selectedMonth, setSelectedMonth] = useState(""); // Selected month name

  const { data: appointmentsThisMonth } = useGetAllAppointmentsQuery({
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().endOf("month").format("YYYY-MM-DD"),
  });
  const { data: appointmentsLastMonth } = useGetAllAppointmentsQuery({
    from: dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
    to: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
  });
  const { data: appointmentsLast2Month } = useGetAllAppointmentsQuery({
    from: dayjs().subtract(2, "month").startOf("month").format("YYYY-MM-DD"),
    to: dayjs().subtract(2, "month").endOf("month").format("YYYY-MM-DD"),
  });

  // Get month names dynamically using dayjs
  const months = [
    dayjs().subtract(2, "month").format("MMMM"),
    dayjs().subtract(1, "month").format("MMMM"),
    dayjs().format("MMMM"),
  ];

  useEffect(() => {
    const categorizeAppointments = (appointments) => {
      return appointments.reduce(
        (acc, curr) => {
          const isAcademic = curr.counselorInfo.specialization !== undefined;
          if (isAcademic) {
            acc.academic.push(curr);
          } else {
            acc.nonAcademic.push(curr);
          }
          return acc;
        },
        { academic: [], nonAcademic: [] }
      );
    };

    const transformData = () => {
      const thisMonthData = categorizeAppointments(appointmentsThisMonth?.content || []);
      const lastMonthData = categorizeAppointments(appointmentsLastMonth?.content || []);
      const last2MonthData = categorizeAppointments(appointmentsLast2Month?.content || []);

      setChartData({
        academic: [
          last2MonthData.academic.length,
          lastMonthData.academic.length,
          thisMonthData.academic.length,
        ],
        nonAcademic: [
          last2MonthData.nonAcademic.length,
          lastMonthData.nonAcademic.length,
          thisMonthData.nonAcademic.length,
        ],
      });
    };

    transformData();
  }, [appointmentsThisMonth, appointmentsLastMonth, appointmentsLast2Month]);

  const handleBarClick = (event, chartContext, config) => {
    const index = config.dataPointIndex;
    const appointments =
      index === 0
        ? appointmentsLast2Month
        : index === 1
          ? appointmentsLastMonth
          : appointmentsThisMonth;

    const pieData = getPieChartData(appointments);

    // Set the pie chart data for the selected bar
    setStatusPieData({
      completed: pieData.completed,
      canceled: pieData.canceled,
      expired: pieData.expired,
    });
    setMeetingTypePieData({
      online: pieData.online,
      offline: pieData.offline,
    });
    setActivePieData({
      active: pieData.active,
      passive: pieData.passive,
    });

    const isAcademic = index === 0 ? appointmentsLast2Month : index === 1 ? appointmentsLastMonth : appointmentsThisMonth;
    console.log(isAcademic)
    const isAcademicAppointments = isAcademic?.content.filter((appointment) => appointment.counselorInfo.specialization !== undefined );
    console.log(isAcademicAppointments)

    // Set title for the pie chart
    setSelectedPieTitle(isAcademicAppointments ? "Academic Appointments" : "Non-Academic Appointments");

    // Set the month name based on selected index
    setSelectedMonth(months[index]);
  };

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      events: {
        dataPointSelection: handleBarClick,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: months, // Show current month names
    },
    yaxis: {
      title: {
        text: "Number of Appointments",
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  };

  const series = [
    {
      name: "Academic",
      data: chartData.academic,
    },
    {
      name: "Non-Academic",
      data: chartData.nonAcademic,
    },
  ];

  const pieOptions: ApexOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    labels: ["Completed", "Canceled", "Expired"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const meetingTypePieOptions: ApexOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    labels: ["Online", "Offline"],
  };

  const activePieOptions: ApexOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    labels: ["Active", "Passive"],
  };

  return (
    <div className="flex justify-between gap-16">
      <Paper className="p-16 h-sm">
        <Typography className="font-semibold text-xl ">Appointments Overview</Typography>
        <ApexCharts
          options={options}
          series={series}
          type="bar"
          height={400}
          width={600}
        />
      </Paper>

      <Paper className="h-sm p-16">
        <Typography className="font-semibold text-xl">
          {selectedMonth || `Select a bar to view details`}
        </Typography>
        <div className="flex p-16 items-center flex-1 flex-wrap justify-around">

          <ApexCharts
            options={meetingTypePieOptions}
            series={[meetingTypePieData.online, meetingTypePieData.offline]}
            type="pie"
          />
          <ApexCharts
            options={pieOptions}
            series={[statusPieData.completed, statusPieData.canceled, statusPieData.expired]}
            type="pie"
          />
          <ApexCharts
            options={activePieOptions}
            series={[activePieData.active, activePieData.passive]}
            type="pie"
          />
        </div>

      </Paper>
    </div>
  );
};

export default AppointmentChart;
