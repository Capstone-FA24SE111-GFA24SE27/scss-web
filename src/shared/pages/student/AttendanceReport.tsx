import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Divider, Box } from '@mui/material';
import { Breadcrumbs, ContentLoading, Heading } from '@shared/components';
import { useLocation, useParams } from 'react-router-dom';
import { useGetStudentDocumentDetailQuery, useGetStudentSemesterDetailsQuery, useGetStudentStudyDetailQuery, useGetStudentDetailQuery } from './student-api';
import { navigateUp } from '@/shared/utils';
import { Subject } from '@/shared/types';
import { useGetSemestersQuery } from '@/shared/services';


const AttendanceReport = ({ id }: { id?: string }) => {
  const { id: studentRouteId } = useParams();
  const studentId = id || studentRouteId
  const { data: studentData, isLoading: isLoadingStudentData } = useGetStudentDocumentDetailQuery(studentId, {
    skip: !studentId
  });

  const { data: semesterData, isLoading: isLoadingSemesterData } = useGetSemestersQuery();
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')

  const { data: semsesterDetailsData, isLoading: isLoadingSemsesterDetailsData } = useGetStudentSemesterDetailsQuery({
    studentId,
    semesterName: selectedSemester
  }, {
    skip: !selectedSemester
  });


  // const { data: academicTranscriptData, isLoading } = useGetStudentStudyDetailQuery(studentId);

  const student = studentData?.content;

  // const academicTranscript = academicTranscriptData?.content;

  const location = useLocation();
  const studentUrl = navigateUp(location, 1);


  const terms = semesterData

  const studentSemesterDetail = semsesterDetailsData?.content

  const courses = Array.from(new Set(studentSemesterDetail?.map((course) => course.subjectName)));

  const attendanceDetail = studentSemesterDetail?.find((course) => course.subjectName === selectedCourse)


  const onTermClick = (term: string) => {
    setSelectedSemester(term)
  };

  const totalSlots = attendanceDetail?.totalSlot || 0;
  const absentCount = attendanceDetail?.detais.filter(detail => detail.status === 'ABSENT').length || 0;
  const absentPercentage = totalSlots ? ((absentCount / totalSlots) * 100).toFixed(2) : 0;

  const onCourseClick = (course: string) => {
    setSelectedCourse(course)
  };
  // if (isLoading) {
  //   return <ContentLoading className='m-32 w-md' />;
  // }
  useEffect(() => {
    if (semesterData) {
      setSelectedSemester(semesterData.at(-1).name);
    }
  }, [semesterData]);

  useEffect(() => {
    if (semsesterDetailsData?.content?.length) {
      setSelectedCourse(semsesterDetailsData.content.at(-1).subjectName);
    }
  }, [semsesterDetailsData]);


  if (!student) {
    return (
      <div className='relative p-48 w-md'>
        <Typography color="text.secondary" variant="h5">
          Invalid student!
        </Typography>
      </div>
    );
  }


  return (
    <div className='p-32'>
      {studentRouteId && <Breadcrumbs
        className=''
        parents={[
          {
            label: student?.studentProfile.profile.fullName || '',
            url: studentUrl
          }
        ]}
        currentPage={"Attendance Report"}
      />
      }
      <Heading title='Attendance Report'
        description={`Attendence report of ${student?.studentProfile.profile.fullName} (${student?.studentProfile.studentCode})`}
        className='mt-8'
      />

      <div className='flex gap-8 mt-16'>

        <Paper className='p-16 !w-112 shadow'>
          <h2 className="mb-4 text-lg font-bold">Terms</h2>
          <div className="mb-6">
            {terms?.map((term) => (
              <div
                key={term.id}
                className={`cursor-pointer hover:underline pt-8 ${selectedSemester === term.name ? 'font-semibold underline text-primary-main hover:cursor-default' : 'text-secondary-main'}`}
                onClick={() => onTermClick(term.name)}
              >
                {term.name}
              </div>
            ))}
          </div>
        </Paper>
        <Paper className='p-16 !w-200 shadow'>
          <h2 className="mb-4 text-lg font-bold">Courses</h2>
          <div>
            {courses.map((course) => (
              <div
                key={course}
                className={`cursor-pointer hover:underline mt-8 ${selectedCourse === course ? 'font-semibold underline text-primary-main hover:cursor-default' : 'text-secondary-main'}`}
                onClick={() => onCourseClick(course)}
              >
                {course}
              </div>
            ))}
          </div>
        </Paper>
        <TableContainer component={Paper} className="!w-xl shadow">
          <Box className="p-16 text-lg font-semibold text-center">
            {`${absentPercentage}% absent so far (${absentCount} absent on ${totalSlots} total)`}
          </Box>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-bold">NO.</TableCell>
                <TableCell className="font-bold">DATE</TableCell>
                <TableCell className="font-bold">SLOT</TableCell>
                <TableCell className="font-bold">ROOM</TableCell>
                <TableCell className="font-bold">LECTURER</TableCell>
                <TableCell className="font-bold">GROUP NAME</TableCell>
                <TableCell className="font-bold">ATTENDANCE STATUS</TableCell>
                <TableCell className="font-bold">LECTURER'S COMMENT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceDetail?.detais.map((detail, index) => (
                <TableRow key={`${detail.slot}-${index}`}>
                  <TableCell >{index + 1}</TableCell>
                  <TableCell className='p-8'>{new Date(detail.date).toLocaleDateString()}</TableCell>
                  <TableCell className='p-8'>{detail.slot}</TableCell>
                  <TableCell className='p-8'>{detail.room}</TableCell>
                  <TableCell className='p-8'>{detail.lecturer}</TableCell>
                  <TableCell className='p-8'>{detail.groupName}</TableCell>
                  <TableCell className={`text-${detail.status === "PRESENT" ? "green" : "red"}-500`}>
                    {detail.status}
                  </TableCell>
                  <TableCell className='!w-200'>{detail.lecturerComment || ""}</TableCell>
                </TableRow>
              ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div >
  );
};

export default AttendanceReport;

