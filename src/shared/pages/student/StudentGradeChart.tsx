import React from "react";
import Chart from "react-apexcharts";
import { Box, Paper, Typography } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { Subject } from "@/shared/types";
import { calculateGPA } from "@/shared/utils";
import { memo } from "react"
const StudentGradeChart = ({ data }: { data: Subject[] }) => {
  // Extract subjects and their grades
  const subjects = [...new Set(data.map((d) => d.subjectName))];
  const terms = [...new Set(data.map((d) => `Term ${d.term}`))];
  console.log(terms)
  // Prepare series data for each subject
  const series = subjects.map((subject) => ({
    name: subject,
    data: terms.map((term) => {
      const grade = data.find(
        (d) => d.subjectName === subject && `Term ${d.term}` === term
      )?.grade;
      console.log(grade);
      return grade !== undefined ? grade : null;
    }),
  }));


  // Calculate average grades for each term
  const averageGrades = terms.map((term) => {
    const gradesForTerm = data
      .filter((d) => `Term ${d.term}` === term && d.grade !== null)
      .map((d) => d.grade);
    const avgGrade = gradesForTerm.length
      ? gradesForTerm.reduce((acc, grade) => acc + grade, 0) / gradesForTerm.length
      : null;
    return avgGrade;
  });

  // Add the average grades as a separate series
  series.unshift({
    name: "Average grade per term",
    data: averageGrades,
  });

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
    },
    stroke: {
      width: 4,
      curve: "smooth",
    },
    title: {
      text: "Student Grades Over Terms",
      align: "center",
    },
    xaxis: {
      categories: terms,
    },
    yaxis: {
      title: {
        text: "Grades",
      },
      min: 0,
      max: 10,
      labels: {
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    tooltip: {
      theme: "dark",
      shared: false, // Ensures each series is treated independently
      followCursor: true, // Tooltip follows the cursor for clarity
      y: {
        formatter: (value: number | null) => {
          // Only display non-null and non-zero values
          if (value !== null && value > 0) {
            return value.toString();
          }
          return ""; // Return an empty string to suppress tooltip for invalid values
        },
      },
    },
    markers: {
      size: 5,
    },
  };

  return (
    <Paper className="shadow p-4">
      <Chart options={options} series={series} type="line" height={350} />
      <Box className="flex gap-8 py-8 px-16">
        <Typography color="textSecondary" >Currnet GPA:</Typography>
        <Typography className="font-semibold">{calculateGPA(data)}</Typography>
      </Box>
    </Paper>
  );
};

export default memo(StudentGradeChart);
