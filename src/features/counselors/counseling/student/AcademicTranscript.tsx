import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography } from '@mui/material';
import { Breadcrumbs, ContentLoading, Heading } from '@shared/components';
import { useParams } from 'react-router-dom';
import { useGetStudentQuery } from './student-api';

interface Subject {
  no: number;
  term: string;
  semester: string;
  subjectCode: string;
  prerequisite?: string;
  replacedSubject?: string;
  subjectName: string;
  credit: number;
  grade: number;
  status: string;
}

const subjects: Subject[] = [
  { no: 1, term: "0", semester: "Spring2022", subjectCode: "GDQP", subjectName: "Military Education", credit: 0, grade: 7.7, status: "Passed" },
  { no: 2, term: "0", semester: "Fall2021", subjectCode: "VOV114", subjectName: "Vovinam 1", credit: 2, grade: 8.5, status: "Passed" },
  { no: 3, term: "0", semester: "Spring2022", subjectCode: "VOV124", prerequisite: "VOV114", subjectName: "Vovinam 2", credit: 2, grade: 7.2, status: "Passed" },
  { no: 4, term: "0", semester: "Fall2022", subjectCode: "VOV134", prerequisite: "VOV124", subjectName: "Vovinam 3", credit: 2, grade: 6.3, status: "Passed" },
  { no: 5, term: "0", semester: "Fall2021", subjectCode: "TRS601", prerequisite: "TRS501", subjectName: "English 6 (University Success)", credit: 0, grade: 7, status: "Passed" },
  { no: 6, term: "0", semester: "Fall2022", subjectCode: "TMI101", replacedSubject: "DSA102", subjectName: "Traditional Musical Instrument", credit: 3, grade: 8, status: "Passed" },
  { no: 7, term: "1", semester: "Spring2022", subjectCode: "CSI104", subjectName: "Introduction to Computing", credit: 3, grade: 8.3, status: "Passed" },
  { no: 8, term: "1", semester: "Spring2022", subjectCode: "SSL101c", subjectName: "Academic Skills for University Success", credit: 3, grade: 8.7, status: "Passed" },
  { no: 9, term: "1", semester: "Spring2022", subjectCode: "PRF192", subjectName: "Programming Fundamentals", credit: 3, grade: 8.3, status: "Passed" },
  { no: 10, term: "1", semester: "Spring2022", subjectCode: "MAE101", subjectName: "Mathematics for Engineering", credit: 3, grade: 8.1, status: "Passed" },
  { no: 11, term: "1", semester: "Spring2022", subjectCode: "CEA201", subjectName: "Computer Organization and Architecture", credit: 3, grade: 8.6, status: "Passed" },
  { no: 12, term: "2", semester: "Summer2022", subjectCode: "PRO192", prerequisite: "PRF192", subjectName: "Object-Oriented Programming", credit: 3, grade: 9.1, status: "Passed" },
  { no: 13, term: "2", semester: "Summer2022", subjectCode: "MAD101", subjectName: "Discrete Mathematics", credit: 3, grade: 7.6, status: "Passed" },
  { no: 14, term: "2", semester: "Summer2022", subjectCode: "OSG202", subjectName: "Operating Systems", credit: 3, grade: 6.7, status: "Passed" },
  { no: 15, term: "2", semester: "Summer2022", subjectCode: "NWC203c", subjectName: "Computer Networking", credit: 3, grade: 9.2, status: "Passed" },
  { no: 16, term: "2", semester: "Summer2022", subjectCode: "SSG104", subjectName: "Communication and In-Group Working Skills", credit: 3, grade: 6.7, status: "Passed" },
  { no: 17, term: "3", semester: "Fall2022", subjectCode: "JPD113", subjectName: "Elementary Japanese 1- A1.1", credit: 3, grade: 9.1, status: "Passed" },
  // More data
  { no: 18, term: "3", semester: "Fall2022", subjectCode: "PHY101", subjectName: "Physics 1", credit: 3, grade: 7.5, status: "Passed" },
  { no: 19, term: "3", semester: "Spring2023", subjectCode: "CSE204", subjectName: "Data Structures", credit: 3, grade: 8.8, status: "Passed" },
  { no: 20, term: "3", semester: "Spring2023", subjectCode: "CSL302", subjectName: "Machine Learning", credit: 3, grade: 9.0, status: "Passed" },
  { no: 21, term: "3", semester: "Spring2023", subjectCode: "ENG101", subjectName: "English Communication", credit: 2, grade: 8.0, status: "Passed" },
  { no: 22, term: "4", semester: "Fall2023", subjectCode: "CST401", subjectName: "Capstone Project", credit: 5, grade: 8.5, status: "Passed" },
  { no: 23, term: "4", semester: "Fall2023", subjectCode: "CSE312", subjectName: "Advanced Algorithms", credit: 3, grade: 7.9, status: "Passed" },
  { no: 24, term: "4", semester: "Fall2023", subjectCode: "DBS301", subjectName: "Database Systems", credit: 3, grade: 8.7, status: "Passed" },
  { no: 25, term: "4", semester: "Fall2023", subjectCode: "CSE202", subjectName: "Compiler Design", credit: 3, grade: 7.0, status: "Passed" },
  { no: 26, term: "5", semester: "Spring2024", subjectCode: "NET204", subjectName: "Network Security", credit: 3, grade: 8.4, status: "Passed" },
  { no: 27, term: "5", semester: "Spring2024", subjectCode: "IOT301", subjectName: "Internet of Things", credit: 3, grade: 8.3, status: "Passed" },
];

const AcademicTranscript = () => {
  const routeParams = useParams();
  const { id: studentId } = routeParams as { id: string };
  const { data, isLoading } = useGetStudentQuery(studentId);
  const student = data?.content

  if (isLoading) {
    return <ContentLoading className='m-32 w-md' />
  }

  if (!student) {
    return <div className='relative p-48 w-md'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid student!
      </Typography>
    </div>
  }
  return (
    <div className='p-32 mt-32'>
      <Breadcrumbs
        className=''
        parents={[
          {
            label: "Student",
            url: `../`
          }
        ]}
        currentPage={"Booking"}
      />
      <Heading
        title='Academic Transcript of Student'
        className='mt-8'
      />
      <TableContainer component={Paper} className='mt-16'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Term</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Subject Code</TableCell>
              <TableCell>Prerequisite</TableCell>
              <TableCell>Replaced Subject</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.no} className="hover:bg-gray-100">
                <TableCell>{subject.no}</TableCell>
                <TableCell>{subject.term}</TableCell>
                <TableCell>{subject.semester}</TableCell>
                <TableCell>{subject.subjectCode}</TableCell>
                <TableCell>{subject.prerequisite || '-'}</TableCell>
                <TableCell>{subject.replacedSubject || '-'}</TableCell>
                <TableCell>{subject.subjectName}</TableCell>
                <TableCell>{subject.credit}</TableCell>
                <TableCell className={subject.grade >= 5 ? 'text-secondary-main' : 'text-red-500'} >

                  <p className='font-semibold'>{subject.grade}</p>
                </TableCell>
                <TableCell >
                  <Chip label={subject.status} color={subject.status === 'Passed' ? 'success' : 'error'} />
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