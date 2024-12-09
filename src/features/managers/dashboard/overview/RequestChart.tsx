import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Paper, Typography, Select, MenuItem } from '@mui/material';
import { counselingTypeColor } from '@/shared/constants';
import { chartData } from './chartData';

const RequestChart = () => {
  // Mock data for appointments
  const appointmentData = chartData

  const [granularity, setGranularity] = useState('month');
  const [selectedData, setSelectedData] = useState({
    period: `November`,
    data:{ appointments: 140, canceled: 7, completed: 130, expired: 3 },
    category: 'Academic',
  });

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
        text: 'Number of appointment requests',
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
          <Typography className="font-semibold text-xl">Appoitnment Requests Overview</Typography>
          <Select value={granularity} onChange={handleGranularityChange} size='small' className='font-semibold'>
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
          </div>
        )}
      </Paper>
    </div>
  );
};

export default RequestChart;
