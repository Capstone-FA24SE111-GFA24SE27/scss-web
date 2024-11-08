import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography } from '@mui/material';
import { Breadcrumbs, ContentLoading, Heading } from '@shared/components';
import { useLocation, useParams } from 'react-router-dom';
import { useGetStudentDocumentViewQuery, useGetStudentStudyViewQuery, useGetStudentViewQuery } from './student-api';
import { navigateUp } from '@/shared/utils';
import { Subject } from '@/shared/types';

const AcademicTranscript = ({ id }: { id?: string }) => {
  const { id: studentRouteId } = useParams();
  const studentId = id || studentRouteId
  const { data: studentData, isLoading: isLoadingStudentData } = useGetStudentDocumentViewQuery(studentId);
  const { data: academicTranscriptData, isLoading } = useGetStudentStudyViewQuery(studentId);

  const student = studentData?.content;

  const academicTranscript = academicTranscriptData?.content;

  const location = useLocation();
  const studentUrl = navigateUp(location, 1);

  if (isLoading) {
    return <ContentLoading className='m-32 w-md' />;
  }

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
        currentPage={"Academic Transcript"}
      />
      }
      <Heading title='Academic Transcript'
        description={`Grade report of ${student?.studentProfile.profile.fullName} (${student?.studentProfile.studentCode})`}
        className='mt-8'
      />
      <TableContainer component={Paper} className='mt-16 shadow'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Term</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Subject Code</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {academicTranscript?.map((subject) => (
              <TableRow key={subject.subjectCode} className="hover:bg-gray-100">
                <TableCell>{subject.term}</TableCell>
                <TableCell>{subject.semester !== 'N/A' ? subject.semester : '-'}</TableCell>
                <TableCell>{subject.subjectCode}</TableCell>
                <TableCell>{subject.subjectName}</TableCell>
                <TableCell
                  className={
                    subject.grade !== null
                      ? subject.grade > 8
                        ? 'text-green-500' // Green for grades above 8
                        : subject.grade >= 5
                          ? 'text-orange-500' // Default color for grades 5-8
                          : 'text-red-500' // Red for grades below 5
                      : ''
                  }
                >
                  <p className='font-semibold'>{subject.grade !== null ? subject.grade : '-'}</p>
                </TableCell>
                <TableCell>
                  <Chip label={subject.status} color={subject.status === 'PASSED' ? 'success' : subject.status === 'NOT_PASSED' ? 'error' : 'default'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AcademicTranscript;
