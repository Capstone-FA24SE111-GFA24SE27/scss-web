import { useGetSemestersQuery } from '@/shared/services';
import { calculateGPA } from '@/shared/utils';
import { Add, CakeOutlined, Checklist, Description, EmailOutlined, EventNote, Grade, LocalPhoneOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
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

interface CounselingProfileProps {
  id?: string,
  actionButton?: ReactNode,
}
function CounselingProfile({ id, actionButton }: CounselingProfileProps) {
  const { id: studentRouteId } = useParams();
  const studentId = id || studentRouteId
  const { data, isLoading } = useGetStudentDocumentDetailQuery(studentId);
  const { data: academicTranscriptData } = useGetStudentStudyDetailQuery(studentId);
  const [tabValue, setTabValue] = useState(0);


  const [displayView, setDisplayView] = useState<'' | 'academic_transcrip' | 'attendance_report'>('')
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleSelectSemester = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedSemester(event.target.value);
  };
  const student = data?.content
  const navigate = useNavigate();
  const location = useLocation()

  const studentGpa = calculateGPA(academicTranscriptData?.content)
  const dispatch = useAppDispatch()

  const { data: semesterData } = useGetSemestersQuery()
  const semesterOptions = semesterData?.map(semester => (
    { label: semester.name, value: semester.name }
  )) || []

  const [generateGeneralAssessment, { isLoading: isLoadingGeneralAssessment }] = useGetStudentBehaviorAssessmentMutation()
  // const { data: generalAssessment, isFetching: isLoadingGeneralAssessment } = useGetStudentBehaviorAssessmentQuery({
  //   studentId,
  //   semesterName: selectedSemester
  // }, {
  //   skip: !selectedSemester,
  // });

  const handleAssessment = () => {
    generateGeneralAssessment({
      studentId,
      semesterName: selectedSemester,
    }).unwrap().then((res) => {
      dispatch(openDialog({
        children: isLoadingGeneralAssessment
          ? <ContentLoading />
          : <div>
            <DialogTitle>Student General Assesssment</DialogTitle>
            <DialogContent>
              <ReactMarkdown
                components={{
                  ul: ({ node, ...props }) => (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '16px' }} {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li style={{ marginBottom: '8px' }} {...props} />
                  ),
                }}
              >
                {/* {formatMarkdown(res?.message) || ``} */}
                {`${res?.message}`}
              </ReactMarkdown>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(closeDialog())} color="primary">
                Close
              </Button>
            </DialogActions>
          </div>
      }))
      // setGeneralAssessment(res?.message || ``)
    })
  }

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
    <section className='flex flex-col pl-16'>
      <div className="flex flex-col space-y-16">
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

        <Divider />
        <div>
          <Box>
            <Typography className='font-semibold'>
              History of couseling
            </Typography>
          </Box>
          <StudentDetailAppointmentList id={studentId} />
        </div>
      </div>


    </section>
  );
}

export default CounselingProfile;
function formatMarkdown(data) {
  // Clean up any extra spaces and commas
  data = data.replace(/\n\s*\n/g, '\n'); // Remove extra empty lines

  // Add bullet points before each item that needs them
  data = data.replace(/^\s*-\s*/gm, '  - ');  // Ensure proper spacing with bullet points
  data = data.replace(/^\s*([^\n\-].+)/gm, '  - $1'); // Add bullet point where it's missing

  // Process each section header (e.g., Behavioral Performance Overview, Overall Assessment, Conclusion)
  data = data.replace(/###/g, '\n###'); // Add newline before each section header

  // Clean up any unnecessary spaces after section headers
  data = data.replace(/\n{2,}/g, '\n\n'); // Remove redundant blank lines

  return data.trim();
}
