import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Divider, Paper, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '@/shared/components';

const AppointmentChart = () => {
  // Mock data for the appointments
  const barData = [
    { month: 'Spring 2024', appointments: 140, canceled: 6, completed: 130, expired: 4 },
    { month: 'Summer 2024', appointments: 125, canceled: 8, completed: 110, expired: 7 },
    { month: 'Fall 2024', appointments: 150, canceled: 10, completed: 135, expired: 5 },
  ];

  const [selectedMonthData, setSelectedMonthData] = useState(null);

  const dispatch = useAppDispatch()
  
  // Data for the bar chart
  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      events: {
        dataPointMouseEnter: (event, chartContext, config) => {
          const index = config.dataPointIndex;
          const monthData = barData[index];
          setSelectedMonthData(monthData);
          dispatch(() => {
            openDialog({
              children: <Paper className="w-fit p-16">
                <Typography className='font-semibold text-xl'>Spring 2024</Typography>
                <div className='flex h-full items-center'>
                  <ReactApexChart
                    options={pieChartOptions}
                    series={pieChartSeries}
                    type="pie"
                    width={360}
                  />
                </div>
              </Paper>
            })
          })
        },
      },
    },
    xaxis: {
      categories: barData.map(item => item.month),
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',  // Control the width of the bars
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  // Data for the bar chart (two series for each category)
  const barChartSeries = [
    {
      name: 'Academic',
      data: barData.map(item => item.completed),
    },
    {
      name: 'Non-academic',
      data: barData.map(item => 60),
    },
  ];

  // Data for the pie chart (based on hovered bar)
  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'pie',  // Explicitly set the chart type to 'pie'
    },
    labels: ['Canceled', 'Completed', 'Expired'],
    dataLabels: {
      enabled: true,
    },
  };

  const pieChartSeries = selectedMonthData
    ? [selectedMonthData.canceled, selectedMonthData.completed, selectedMonthData.expired]
    : [0, 0, 0]; // Default to 0 if no month is selected

  const pieChartOptionsForCounselingType: ApexOptions = {
    chart: {
      type: 'pie',  // Explicitly set the chart type to 'pie'
    },
    labels: ['Academic', 'Non-academic'],
    dataLabels: {
      enabled: true,
    },
  };

  const pieChartSeriesForCounseling = [48, 52];

  return (
    <div className='gap-16 flex'>
      <Paper className="p-16 w-fit">
        <Typography className='font-semibold text-xl'>Appointments Summary</Typography>
        <ReactApexChart
          options={barChartOptions}
          series={barChartSeries}
          type="bar"
          height={350}
          width={542}
        />
      </Paper>
      {selectedMonthData ? 
        <Paper className="w-fit p-16">
          <Typography className='font-semibold text-xl'>Spring 2024</Typography>
          <div className='flex h-full items-center'>
            <ReactApexChart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
              width={360}
            />
          </div>
        </Paper>
        : <Paper className="w-[360px] p-16">
          <Typography className='font-semibold text-xl'>Please select a semester</Typography>
        </Paper>
      }
      <Paper className="w-fit p-16">
        <Typography className='font-semibold text-xl'>Counseling Type</Typography>
        <div className='flex h-full items-center'>
          <ReactApexChart
            options={pieChartOptionsForCounselingType}
            series={pieChartSeriesForCounseling}
            type="pie"
            width={360}
          />
        </div>
      </Paper>
    </div>
  );
};

export default AppointmentChart;
