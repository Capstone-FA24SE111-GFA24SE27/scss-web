import { Divider, Paper, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useGetAllProblemTagsBySemesterQuery } from '../../overview/overview-api';
import { useGetSemestersQuery } from '@/shared/services';
import { SelectField } from '@/shared/components';

const BehaviorTagsChart: React.FC = () => {
  
  const [selectedSemester, setSelectedSemester] = useState('');

  const { data: semesterData } = useGetSemestersQuery()
  const semesterOptions = semesterData?.map(semester => (
    { label: semester.name, value: semester.name }
  )) || []

  const handleSelectSemester = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedSemester(event.target.value);
  };

  const { data: behaviorsData } = useGetAllProblemTagsBySemesterQuery({
    semesterName: selectedSemester
  })

  const problemTags = behaviorsData?.content
  const categories = problemTags?.map(item => item.problemTagName)
  const counts = problemTags?.map(item => item.count)
  const behaviorTagsBarData = [
    {
      name: 'Behavior Tags',
      data: counts,
    },
  ];

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
      categories: categories,
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
    margin: {
      left: 60, // Adjust left margin to accommodate long labels
    },
  };

  // Mock Data for Behavior Tags and Corresponding Student Counts




  useEffect(() => {
    if (semesterData?.length) {
      setSelectedSemester(semesterData.at(-1).name)
    }
  }, [semesterData]);

  return (
    <div className="">
      {/* <h2 className="text-2xl font-semibold mb-8 text-text-secondary">Student Behavior Analysis</h2> */}
      <Paper className="p-16 mt-8 shadow">
        {/* Horizontal Bar Chart: Behavior Tags with Student Counts */}
        <div className="rounded-lg">
          <div className='flex justify-between'>
            <Typography className="text-xl font-semibold">Student Behaviors Analytics</Typography>
            <SelectField
              label="Semester"
              options={semesterOptions}
              value={selectedSemester}
              onChange={handleSelectSemester}
              className='w-192'
              size='small'
              showClearOptions
            />
          </div>
          <div className='pt-8'>
            <Chart
              options={behaviorTagsBarOptions}
              series={behaviorTagsBarData}
              type="bar"
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default BehaviorTagsChart;
