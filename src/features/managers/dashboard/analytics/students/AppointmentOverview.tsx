import { useGetCounselorsNonAcademicQuery } from '@/features/students/services/counseling/counseling-api';
import { EmailOutlined, LocalPhoneOutlined } from '@mui/icons-material';
import { Avatar, Box, Divider, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Paper, Rating, Select, Typography } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';

const AppointmentOverview: React.FC = () => {
  // Data for the column chart (Total Appointments Handled Weekly)
  const columnChartOptions = {
    chart: {
      type: 'bar' as const, // "bar" is explicitly cast as a constant value.
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Days of the week
      title: {
        text: 'Days of the Week', // X-axis label
        style: {
          fontSize: '14px', // Optional, style for the label
          fontWeight: 'bold',
          color: '#333',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Total Appointments', // Y-axis label
        style: {
          fontSize: '14px', // Optional, style for the label
          fontWeight: 'bold',
          color: '#333',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ['#00E396'], // Use one color for the total
  };

  // Total sessions data (combined for all counselors per day of the week)
  const columnChartData = [
    {
      name: 'Total Appointments',
      data: [30, 35, 40, 50, 45, 60, 55], // Example data for total sessions each day of the week
    },
  ];

  // Data for the first pie chart (Online vs Offline Appointments)
  const onlineOfflinePieOptions = {
    chart: {
      type: 'pie' as const, // Explicitly cast to 'pie'
      height: 350,
    },
    labels: ['Online', 'Offline'],
    colors: ['#00E396', '#FF4560'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const onlineOfflinePieData = [60, 40]; // Example data (60% Online, 40% Offline)

  // Data for the second pie chart (Appointment Statuses: Completed, Canceled/Absent, Expired)
  const sessionStatusPieOptions = {
    chart: {
      type: 'pie' as const, // Explicitly cast to 'pie'
      height: 350,
    },
    labels: ['Completed', 'Canceled/Absent', 'Expired'],
    colors: ['#00E396', '#FF4560', '#008FFB'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const sessionStatusPieData = [50, 30, 20]; // Example data (50% Completed, 30% Canceled/Absent, 20% Expired)

  // Data for the third pie chart (Approved vs Rejected Appointments)
  const approvalStatusPieOptions = {
    chart: {
      type: 'pie' as const, // Explicitly cast to 'pie'
      height: 350,
    },
    labels: ['Approved', 'Rejected'],
    colors: ['#00E396', '#FF4560'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const approvalStatusPieData = [70, 30]; // Example data (70% Approved, 30% Rejected)


  const { data: nonAcademicCounselors, isFetching: isFetchingNonAcademicCounselors } = useGetCounselorsNonAcademicQuery({})
  const counselors = nonAcademicCounselors?.content?.data
  const numbers = [32, 27, 20, 18, 17, 10]
  return (
    <div className="p-16">
      <h2 className="text-2xl font-semibold mb-8 text-text-secondary">Student Appointments Overview</h2>
      <div className='flex gap-16 w-full'>
        <Paper className="p-16 shadow flex-1">
          <div className='flex justify-between'>
            <h3 className="text-xl font-semibold">Total Booked Appointments</h3>
            <Select size='small' className='font-semibold' value={`week`}>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="day">Day</MenuItem>
            </Select>
          </div>
          <div className="rounded-lg p-16">
            <Chart
              options={columnChartOptions}
              series={columnChartData}
              type="bar"
              height={400}
            />
          </div>
          <Divider />
          <div className="rounded-lg p-16 mt-16">
            <div className="flex gap-32">
              <div>
                {/* <h3 className="text-xl font-medium mb-4">Appointment Statuses</h3> */}
                <Chart
                  options={sessionStatusPieOptions}
                  series={sessionStatusPieData}
                  type="pie"
                  height={400}
                />
              </div>


              <div className="mb-8">
                {/* <h3 className="text-xl font-medium mb-4">Online vs Offline Appointments</h3> */}
                <Chart
                  options={onlineOfflinePieOptions}
                  series={onlineOfflinePieData}
                  type="pie"
                  height={400}
                />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default AppointmentOverview;
