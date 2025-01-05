import { useGetSemestersQuery } from '@/shared/services';
import { calculateGPA } from '@/shared/utils';
import { Add, CakeOutlined, Checklist, Description, EmailOutlined, EventNote, Grade, LocalPhoneOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, DialogActions, DialogContent, DialogTitle, Paper, Tab, Tabs } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { BackdropLoading, ContentLoading, Gender, NavLinkAdapter, SelectField, closeDialog, openDialog } from '@shared/components';
import { useAppDispatch } from '@shared/store';
import dayjs from 'dayjs';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StudentDetailAppointmentList, useGetStudentBehaviorAssessmentMutation, useGetStudentDocumentDetailQuery, useGetStudentProblemTagDetailsQuery, useGetStudentStudyDetailQuery } from '@shared/pages/student';
import StudentGradeChart from '@/shared/pages/student/StudentGradeChart';
import AcademicTranscript from '@/shared/pages/student/AcademicTranscript';
import AttendanceReport from '@/shared/pages/student/AttendanceReport';
import MarkReport from '@/shared/pages/student/MarkReport';
// const AcademicTranscript = lazy(() => import('./AcademicTranscript'))
// const StudentAppointmentList = lazy(() => import('./StudentAppointmentList'))
// const AttendanceReport = lazy(() => import('./AttendanceReport'))
/**
 * The contact view.
 */

interface GeneralInformationProps {
  id?: string,
  actionButton?: ReactNode,
}
function GeneralInformation({ id, actionButton }: GeneralInformationProps) {
  const { id: studentRouteId } = useParams();
  const studentId = id || studentRouteId
  const { data, isLoading } = useGetStudentDocumentDetailQuery(studentId);
  const { data: academicTranscriptData } = useGetStudentStudyDetailQuery(studentId);
  const [tabValue, setTabValue] = useState(0);


  const [displayView, setDisplayView] = useState<'' | 'academic_transcrip' | 'attendance_report'>('')
  const [selectedSemester, setSelectedSemester] = useState('');

  const student = data?.content
  const { data: semesterData } = useGetSemestersQuery()



  const { data: studentProblemTagsData } = useGetStudentProblemTagDetailsQuery({
    studentId,
    semesterName: selectedSemester
  }, {
    skip: !selectedSemester
  })
  const studentProblemTags = studentProblemTagsData?.content || []


  useEffect(() => {
    if (semesterData?.length) {
      setSelectedSemester(semesterData.at(-1).name)
    }
  }, [semesterData]);


  function handleChangeTab(event: React.SyntheticEvent, value: number) {
    setTabValue(value);
  }

  if (isLoading) {
    return <ContentLoading className='m-32 min-w-lg' />
  }

  if (!student) {
    return <div className='relative p-48 min-w-lg'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid student!
      </Typography>
    </div>
  }

  return (
    <Paper className='flex flex-col p-16 shadow'>
      <div className="flex flex-col space-y-16">
        <div>
          <Typography className='font-semibold'>
            General Infomation
          </Typography>
          <Box className="mt-8">
            <div className="grid grid-cols-3 gap-y-2 mb-4">
              <div className="col-span-1 font-medium text-text-secondary">Gender:</div>
              <div className="col-span-2 capitalize">{student?.studentProfile.profile.gender.toLocaleLowerCase()}</div>
            </div>
            {/* Email Section */}
            <div className="grid grid-cols-3 gap-y-2 mb-4">
              <div className="col-span-1 font-medium text-text-secondary">Email:</div>
              <div className="col-span-2">{student?.studentProfile.email}</div>
            </div>

            {/* Phone Number Section */}
            <div className="grid grid-cols-3 gap-y-2 mb-4">
              <div className="col-span-1 font-medium text-text-secondary">Phone Number:</div>
              <div className="col-span-2">{student?.studentProfile.profile.phoneNumber}</div>
            </div>

            {/* Date of Birth Section */}
            <div className="grid grid-cols-3 gap-y-2">
              <div className="col-span-1 font-medium text-text-secondary">Date of Birth:</div>
              <div className="col-span-2">
                {student?.studentProfile.profile.dateOfBirth
                  ? dayjs(student.studentProfile.profile.dateOfBirth).format('DD-MM-YYYY')
                  : 'N/A'}
              </div>
            </div>

          </Box>
        </div>

        <Divider />
        <div>
          <Typography className='font-semibold'>
            Field of study
          </Typography>
          <Box className="mt-8">
            <div className="grid grid-cols-3 gap-y-2 mb-4">
              <div className="col-span-1 font-medium text-text-secondary">Specialization:</div>
              <div className="col-span-2">{student.studentProfile.specialization?.name}</div>
            </div>

            {/* Department Section */}
            <div className="grid grid-cols-3 gap-y-2 mb-4">
              <div className="col-span-1 font-medium text-text-secondary">Department:</div>
              <div className="col-span-2">
                <span>{student.studentProfile.department.name}</span>
                {student.studentProfile.department.code && (
                  <span className="ml-2 text-text-disabled"> ({student.studentProfile.department.code})</span>
                )}
              </div>
            </div>

            {/* Major Section */}
            <div className="grid grid-cols-3 gap-y-2">
              <div className="col-span-1 font-medium text-text-secondary">Major:</div>
              <div className="col-span-2">
                <span>{student.studentProfile.major.name}</span>
                {student.studentProfile.major.code && (
                  <span className="ml-2 text-text-disabled"> ({student.studentProfile.major.code})</span>
                )}
              </div>
            </div>
          </Box>
        </div>
        <div>
          <Typography className='font-semibold'>
            Counseling information
          </Typography>
          <div className='flex flex-col gap-8 mt-8'>
            <div>
              {/* Psychological and Health Status */}
              <Accordion className="-ml-8 p-0 shadow-0" defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Psychological and Health Status</Typography>
                  <Divider />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Introduction:</strong> {student?.counselingProfile?.introduction || `N/A`}</Typography>
                  <Typography><strong>Current Health Status:</strong> {student?.counselingProfile?.currentHealthStatus || `N/A`}</Typography>
                  <Typography><strong>Psychological Status:</strong> {student?.counselingProfile?.psychologicalStatus || `N/A`}</Typography>
                  <Typography><strong>Stress Factors:</strong> {student?.counselingProfile?.stressFactors || `N/A`}</Typography>
                </AccordionDetails>
              </Accordion>

              {/* Academic Information */}
              <Accordion className="-ml-8 p-0 shadow-0" defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Academic Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Academic Difficulties:</strong> {student?.counselingProfile?.academicDifficulties || `N/A`}</Typography>
                  <Typography><strong>Study Plan:</strong> {student?.counselingProfile?.studyPlan || `N/A`}</Typography>
                </AccordionDetails>
              </Accordion>

              {/* Career Information */}
              <Accordion className="-ml-8 p-0 shadow-0" defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Career Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Career Goals:</strong> {student?.counselingProfile?.careerGoals || `N/A`}</Typography>
                  <Typography><strong>Part-Time Experience:</strong> {student?.counselingProfile?.partTimeExperience || `N/A`}</Typography>
                  <Typography><strong>Internship Program:</strong> {student?.counselingProfile?.internshipProgram || `N/A`}</Typography>
                </AccordionDetails>
              </Accordion>

              {/* Activities and Lifestyle */}
              <Accordion className="-ml-8 p-0 shadow-0" defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Activities and Lifestyle</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Extracurricular Activities:</strong> {student?.counselingProfile?.extracurricularActivities || `N/A`}</Typography>
                  <Typography><strong>Personal Interests:</strong> {student?.counselingProfile?.personalInterests || `N/A`}</Typography>
                  <Typography><strong>Social Relationships:</strong> {student?.counselingProfile?.socialRelationships || `N/A`}</Typography>
                </AccordionDetails>
              </Accordion>

              {/* Financial Support */}
              <Accordion className="-ml-8 p-0 shadow-0" defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Financial Support</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Financial Situation:</strong> {student?.counselingProfile?.financialSituation || `N/A`}</Typography>
                  <Typography><strong>Financial Support:</strong> {student?.counselingProfile?.financialSupport || `N/A`}</Typography>
                </AccordionDetails>
              </Accordion>

              {/* Counseling Requests */}
              <Accordion className="-ml-8 p-0 shadow-0" defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Counseling Requests</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Desired Counseling Fields:</strong> {student?.counselingProfile?.desiredCounselingFields || `N/A`}</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>

        </div>
      </div>


    </Paper>
  );
}

export default GeneralInformation;
