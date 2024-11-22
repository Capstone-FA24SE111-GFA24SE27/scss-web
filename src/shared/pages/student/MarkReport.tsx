import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Divider, Box, Grid } from '@mui/material';
import { Breadcrumbs, ContentLoading, Heading } from '@shared/components';
import { useLocation, useParams } from 'react-router-dom';
import { useGetStudentDocumentDetailQuery, useGetStudentSemesterDetailsQuery, useGetStudentStudyDetailQuery, useGetStudentDetailQuery, useGetStudentMarkReportQuery } from './student-api';
import { navigateUp } from '@/shared/utils';
import { Subject } from '@/shared/types';
import { useGetSemestersQuery } from '@/shared/services';


const MarkReport = ({ id }: { id?: string }) => {
  const { id: studentRouteId } = useParams();
  const studentId = id || studentRouteId
  const { data: studentData, isLoading: isLoadingStudentData } = useGetStudentDocumentDetailQuery(studentId, {
    skip: !studentId
  });

  const { data: semesterData, isLoading: isLoadingSemesterData } = useGetSemestersQuery();
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')

  const { data: markReportData, isFetching: isFetchingStudentMarkReport } = useGetStudentMarkReportQuery({
    studentId,
    semesterName: selectedSemester
  }, {
    skip: !selectedSemester
  }
  )

  const markReport = markReportData?.content


  // const { data: academicTranscriptData, isLoading } = useGetStudentStudyDetailQuery(studentId);

  const student = studentData?.content;

  // const academicTranscript = academicTranscriptData?.content;

  const location = useLocation();
  const studentUrl = navigateUp(location, 1);


  const terms = semesterData


  const onTermClick = (term: string) => {
    setSelectedSemester(term)
  };


  useEffect(() => {
    if (semesterData) {
      setSelectedSemester(semesterData.at(-1).name);
    }
  }, [semesterData]);

  if (isLoadingStudentData) {
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
        currentPage={"Mark Report"}
      />
      }

      <Heading title='Mark Report'
        description={`Mark report of ${student?.studentProfile.profile.fullName} (${student?.studentProfile.studentCode})`}
        className='mt-8'
      />

      <div className='flex gap-8 mt-16'>

        <Paper className='p-16 !w-160 shadow'>
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

        <Paper className='shadow p-8 w-lg bg-background'>
          {
            isFetchingStudentMarkReport
              ? <ContentLoading />
              : markReport?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                  {markReport?.map((report) => (
                    <Paper
                      key={report.id}
                      className="p-16 shadow space-y-8"
                    >
                      <div className='flex flex-col'>
                        <p className="text-lg font-semibold">
                          {report.subjectName}
                        </p>
                        <p className="text-text-secondary">
                          Start Date: {new Date(report.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-text-secondary">
                          Semester: {report.semesterName}
                        </p>
                        <p className="text-text-secondary">
                          Total Slots: {report.totalSlot}
                        </p>
                      </div>

                      <Divider />
                      <div className='flex justify-between'>
                        <p className="text-lg">
                          Grade: {report.grade ?? "N/A"}
                        </p>
                        {
                          !report.grade && (
                            <Chip color={report.grade >= 5 ? `success` : `error`} label={report.grade >= 5 ? `Passed` : `Not passed`} size='small' />
                          )
                        }
                      </div>
                    </Paper>
                  ))}
                </div>
              ) : (
                <Typography className="text-center text-gray-500">
                  No mark reports found for this semester.
                </Typography>
              )}
        </Paper>
      </div>

    </div >
  );
};

export default MarkReport;

