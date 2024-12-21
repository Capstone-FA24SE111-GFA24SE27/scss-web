import { Divider, Paper } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';

const BehaviorTagsChart: React.FC = () => {
  // Data for the horizontal bar chart (Behavior Tags with Student Counts)
  const behaviorTagsBarOptions = {
    chart: {
      type: 'bar' as const, // Explicitly cast to 'bar'
      width: '100%', // Make the chart responsive and allow it to take up the available space
    },
    plotOptions: {
      bar: {
        horizontal: true, // Horizontal bars
        barHeight: '75%', // Adjust the bar height
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels for a cleaner chart
    },
    xaxis: {
      categories: [
        'Easily Distracted by Surroundings',
        'Does Not Follow Lecture',
        'Frequent Mental Distractions',
        'Lack of Eye Contact',
        'Constantly Looking Around',
        'Not Engaged in the Discussion',
        'Attention Wanders During Lectures',
        'Gazing Outside',
        'Frequent Tardiness',
        'Skipping Mandatory Classes',
      ],
      title: {
        text: 'Number of Students',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
        },
      },
      labels: {
        style: {
          fontSize: '12px', // Smaller font size for labels to fit better
          colors: ['#333'],
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'normal',
        },
        rotate: -45, // Rotate labels if necessary to avoid overlap
        hideOverlappingLabels: true, // Hide overlapping labels
      },
    },
    yaxis: {
      title: {
        text: 'Behavior Tags',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ['#FF4560'], // Color for bars
    margin: {
      left: 60, // Adjust left margin to accommodate long labels
    },
  };

  // Mock Data for Behavior Tags and Corresponding Student Counts
  const behaviorTagsBarData = [
    {
      name: 'Behavior Tags',
      data: [15, 12, 20, 25, 10, 30, 18, 14, 8, 5].sort((a, b) => b - a),
    },
  ];

  return (
    <div className="p-16">
      <h2 className="text-2xl font-semibold mb-8 text-text-secondary">Student Behavior Analysis</h2>
      <Paper className="p-16 shadow">
        {/* Horizontal Bar Chart: Behavior Tags with Student Counts */}
        <div className="rounded-lg">
          <h3 className="text-xl font-semibold">Behavior Tags with Number of Students</h3>
          <Chart
            options={behaviorTagsBarOptions}
            series={behaviorTagsBarData}
            type="bar"
            height={350}
          />
        </div>
      </Paper>
    </div>
  );
};

export default BehaviorTagsChart;
