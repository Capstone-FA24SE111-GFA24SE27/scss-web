import { Breadcrumbs, FilterTabs, Scrollbar } from '@/shared/components';
import React, { useState } from 'react';

import { useGetCounselorsAcademicQuery, useGetCounselorsNonAcademicQuery } from '@/features/students/services/counseling/counseling-api';
import { EmailOutlined, LocalPhoneOutlined } from '@mui/icons-material';
import { Avatar, Box, Divider, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Paper, Rating, Select, Typography } from '@mui/material';
import Chart from 'react-apexcharts';


const AdminCounselorsOverview = ({tabValue}) => {
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
      const { data: academicCounselors, isFetching: isFetchingAcademicCounselors } = useGetCounselorsAcademicQuery({})
    
      const counselors = tabValue === 0 ? academicCounselors?.content?.data : nonAcademicCounselors?.content?.data
      const numbers = [32, 27, 20, 18, 17, 10]
      return (
        <div className="p-16 ">
          <h2 className="mb-8 text-2xl font-semibold text-text-secondary">Performance Overview</h2>
          <div className='flex w-full gap-16'>
            <Paper className="flex-1 p-16 shadow">
              <div className='flex justify-between'>
                <h3 className="text-xl font-semibold">Total Appointments Handled Weekly</h3>
                <Select size='small' className='font-semibold' value={`week`}>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="day">Day</MenuItem>
                </Select>
              </div>
              <div className="p-16 rounded-lg">
                <Chart
                  options={columnChartOptions}
                  series={columnChartData}
                  type="bar"
                  height={400}
                />
              </div>
              <Divider />
              <div className="p-16 mt-16 rounded-lg">
                <div className="flex justify-around">
                  {/* Pie Chart: Appointment Statuses */}
                  <div className="mt-8">
                    {/* Pie Chart: Approved vs Rejected Appointments */}
                    {/* <h3 className="mb-4 text-xl font-medium">Approved vs Rejected Appointments</h3> */}
                    <Chart
                      options={approvalStatusPieOptions}
                      series={approvalStatusPieData}
                      type="pie"
                      height={350}
                    />
                  </div>
                  <div>
                    {/* <h3 className="mb-4 text-xl font-medium">Appointment Statuses</h3> */}
                    <Chart
                      options={sessionStatusPieOptions}
                      series={sessionStatusPieData}
                      type="pie"
                      height={350}
                    />
                  </div>
    
    
                  <div className="mb-8">
                    {/* <h3 className="mb-4 text-xl font-medium">Online vs Offline Appointments</h3> */}
                    <Chart
                      options={onlineOfflinePieOptions}
                      series={onlineOfflinePieData}
                      type="pie"
                      height={350}
                    />
                  </div>
                </div>
              </div>
            </Paper>
            <Paper className="p-16 shadow">
              <h3 className="text-xl font-semibold">Top Counselors by Handled Sessions</h3>
              <div className='flex justify-between pt-8'>
                <Typography className='ml-32 font-semibold text-text-secondary'>Counselor</Typography>
                <Typography className='font-semibold text-text-secondary'>Total</Typography>
              </div>
              {
                counselors?.map((counselor, index) => (
                  <div className='flex justify-between gap-36'>
                    <div className='flex-1'>
                      <ListItemButton
                        className="flex items-start justify-between gap-24 p-8 px-24 py-16"
                        sx={{ bgcolor: 'background.paper' }}
                      >
                        <div className='flex items-start gap-24'>
                          <ListItemAvatar>
                            <Avatar
                              alt={counselor.profile.fullName}
                              src={counselor.profile.avatarLink}
                              className='size-80'
                            />
                          </ListItemAvatar>
                          <Box className='flex flex-col gap-8 '>
                            <ListItemText
                              classes={{ root: 'm-0', primary: 'font-semibold leading-5 truncate text-lg' }}
                              primary={counselor.profile.fullName}
                              secondary={counselor.expertise?.name || counselor.major?.name}
                            />
                            <div className="flex items-center gap-16">
                              <div className="flex items-center w-120">
                                <LocalPhoneOutlined fontSize='small' />
                                <div className="ml-8 leading-6 text-text-secondary">{counselor.profile.phoneNumber}</div>
                              </div>
                              <div className="flex items-center">
                                <EmailOutlined fontSize='small' />
                                <div className="ml-8 leading-6 text-text-secondary">{counselor.email}</div>
                              </div>
                            </div>
                          </Box>
    
                        </div>
    
                      </ListItemButton >
                      <Divider />
                    </div>
                    <Typography className='pt-16 text-3xl font-semibold'>
                      {numbers[index]}
                    </Typography>
                  </div>
                ))
              }
            </Paper>
          </div>
        </div>
      );
};

export default AdminCounselorsOverview;
