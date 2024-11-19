import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Paper, Typography, Select, MenuItem } from '@mui/material';
import { counselingTypeColor } from '@/shared/constants';

const AppointmentChart = () => {
  // Mock data for appointments
  const appointmentData = {
    semester: [
      {
        period: 'Spring 2024',
        academic: { appointments: 140, canceled: 6, completed: 130, expired: 4 },
        nonAcademic: { appointments: 120, canceled: 8, completed: 110, expired: 2 },
      },
      {
        period: 'Summer 2024',
        academic: { appointments: 125, canceled: 5, completed: 115, expired: 5 },
        nonAcademic: { appointments: 130, canceled: 8, completed: 120, expired: 2 },
      },
      {
        period: 'Fall 2024',
        academic: { appointments: 150, canceled: 10, completed: 140, expired: 0 },
        nonAcademic: { appointments: 140, canceled: 7, completed: 130, expired: 3 },
      },
    ],
    month: [
      {
        period: 'January',
        academic: { appointments: 265, canceled: 11, completed: 245, expired: 9 },
        nonAcademic: { appointments: 250, canceled: 16, completed: 230, expired: 4 },
      },
      {
        period: 'February',
        academic: { appointments: 300, canceled: 15, completed: 280, expired: 6 },
        nonAcademic: { appointments: 270, canceled: 15, completed: 250, expired: 5 },
      },
      {
        period: 'March',
        academic: { appointments: 280, canceled: 12, completed: 260, expired: 8 },
        nonAcademic: { appointments: 260, canceled: 10, completed: 240, expired: 10 },
      },
      {
        period: 'April',
        academic: { appointments: 290, canceled: 14, completed: 270, expired: 6 },
        nonAcademic: { appointments: 275, canceled: 13, completed: 255, expired: 7 },
      },
      {
        period: 'May',
        academic: { appointments: 310, canceled: 10, completed: 290, expired: 10 },
        nonAcademic: { appointments: 295, canceled: 12, completed: 280, expired: 3 },
      },
      {
        period: 'June',
        academic: { appointments: 320, canceled: 15, completed: 300, expired: 5 },
        nonAcademic: { appointments: 310, canceled: 10, completed: 295, expired: 5 },
      },
      {
        period: 'July',
        academic: { appointments: 330, canceled: 18, completed: 310, expired: 2 },
        nonAcademic: { appointments: 315, canceled: 15, completed: 300, expired: 0 },
      },
      {
        period: 'August',
        academic: { appointments: 350, canceled: 20, completed: 330, expired: 0 },
        nonAcademic: { appointments: 340, canceled: 18, completed: 320, expired: 2 },
      },
      {
        period: 'September',
        academic: { appointments: 340, canceled: 14, completed: 320, expired: 6 },
        nonAcademic: { appointments: 330, canceled: 10, completed: 315, expired: 5 },
      },
      {
        period: 'October',
        academic: { appointments: 355, canceled: 12, completed: 340, expired: 3 },
        nonAcademic: { appointments: 345, canceled: 15, completed: 325, expired: 5 },
      },
      {
        period: 'November',
        academic: { appointments: 360, canceled: 10, completed: 345, expired: 5 },
        nonAcademic: { appointments: 355, canceled: 12, completed: 340, expired: 3 },
      },
      {
        period: 'December',
        academic: { appointments: 375, canceled: 8, completed: 360, expired: 7 },
        nonAcademic: { appointments: 365, canceled: 10, completed: 350, expired: 5 },
      },
    ],
    week: [
      {
        period: 'Monday',
        academic: { appointments: 30, canceled: 2, completed: 25, expired: 3 },
        nonAcademic: { appointments: 25, canceled: 3, completed: 20, expired: 2 },
      },
      {
        period: 'Tuesday',
        academic: { appointments: 35, canceled: 1, completed: 32, expired: 2 },
        nonAcademic: { appointments: 28, canceled: 2, completed: 25, expired: 1 },
      },
      {
        period: 'Wednesday',
        academic: { appointments: 40, canceled: 2, completed: 38, expired: 0 },
        nonAcademic: { appointments: 35, canceled: 3, completed: 30, expired: 2 },
      },
      {
        period: 'Thursday',
        academic: { appointments: 45, canceled: 3, completed: 42, expired: 0 },
        nonAcademic: { appointments: 40, canceled: 2, completed: 37, expired: 1 },
      },
      {
        period: 'Friday',
        academic: { appointments: 50, canceled: 4, completed: 45, expired: 1 },
        nonAcademic: { appointments: 45, canceled: 3, completed: 40, expired: 2 },
      },
      {
        period: 'Saturday',
        academic: { appointments: 55, canceled: 5, completed: 50, expired: 0 },
        nonAcademic: { appointments: 50, canceled: 4, completed: 45, expired: 1 },
      },
      {
        period: 'Sunday',
        academic: { appointments: 20, canceled: 1, completed: 18, expired: 1 },
        nonAcademic: { appointments: 15, canceled: 1, completed: 13, expired: 1 },
      },
    ],
    day: [
      {
        period: '2024/16/11',
        academic: { appointments: 10, canceled: 0, completed: 8, expired: 2 },
        nonAcademic: { appointments: 8, canceled: 1, completed: 7, expired: 0 },
      },
     
    ],
  };

  const [granularity, setGranularity] = useState('semester');
  const [selectedData, setSelectedData] = useState(null);

  // Update data dynamically based on granularity
  const barData = appointmentData[granularity];

  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const index = config.dataPointIndex;
          const seriesIndex = config.seriesIndex;
          const isAcademic = seriesIndex === 0;
          const selectedPeriodData = barData[index];
          setSelectedData({
            period: selectedPeriodData.period,
            data: isAcademic ? selectedPeriodData.academic : selectedPeriodData.nonAcademic,
            category: isAcademic ? 'Academic' : 'Non-academic',
          });
        },
      },
    },
    xaxis: {
      categories: barData.map(item => item.period),
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'top',
    },
    yaxis: {
      title: {
        text: 'Number of Appointments',
      },
    },
  };

  const barChartSeries = [
    {
      name: 'Academic',
      data: barData.map(item => item.academic.completed),
    },
    {
      name: 'Non-academic',
      data: barData.map(item => item.nonAcademic.completed),
    },
  ];

  const pieChartOptions: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Completed', 'Canceled', 'Expired'],
    dataLabels: {
      enabled: true,
    },
  };

  const pieChartOptionsForLocation: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Online', 'Offline'],
    dataLabels: {
      enabled: true,
    },
  };

  const pieChartSeriesForLocation = [60, 40]; // Example data

  const pieChartOptionsForCounselingState: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Active Booking', 'Passive Booking'],
    dataLabels: {
      enabled: true,
    },
  };

  const pieChartSeriesForCounselingState = [70, 30]; // Example data

  const pieChartSeries = selectedData
    ? [selectedData.data.completed, selectedData.data.canceled, selectedData.data.expired]
    : [0, 0, 0];

  const handleGranularityChange = (event) => {
    setGranularity(event.target.value);
    setSelectedData(null); // Reset selected data on granularity change
  };

  return (
    <div className="gap-16 flex">
      <Paper className="p-16 w-fit space-y-8">
        <div className='flex justify-between'>
          <Typography className="font-semibold text-xl">Appointments Overview</Typography>
          <Select value={granularity} onChange={handleGranularityChange} size='small' className='font-semibold'>
            <MenuItem value="semester">Semester</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="day">Day</MenuItem>
          </Select>
        </div>
        <ReactApexChart
          options={barChartOptions}
          series={barChartSeries}
          type="bar"
          height={400}
          width={600}
        />
      </Paper>
      <Paper className="w-full p-16">
        <Typography className="font-semibold text-xl">
          {
            selectedData ? (
              <div className='flex gap-8 justify-between'>
                <Typography className='text-2xl font-semibold'>{selectedData.period}</Typography>
                <Typography className={`text-2xl font-semibold text-${counselingTypeColor[selectedData.category]}`}>{selectedData.category}</Typography>
                <Typography className='text-2xl font-semibold'></Typography>
              </div>
            ) :
              <Typography className='text-2xl font-semibold'>Select a bar to view details</Typography>
          }
        </Typography>
        {selectedData && (
          <div className="flex h-full items-center flex-1 flex-wrap justify-around p-16">
            <ReactApexChart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
            />
            <ReactApexChart
              options={pieChartOptionsForLocation}
              series={pieChartSeriesForLocation}
              type="pie"
            />
            <ReactApexChart
              options={pieChartOptionsForCounselingState}
              series={pieChartSeriesForCounselingState}
              type="pie"
            />
          </div>
        )}
      </Paper>
    </div>
  );
};

export default AppointmentChart;
