import { useGetSemestersQuery } from '@/shared/services';
import {  Checklist, Description, EventNote, Grade } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { BackdropLoading, ContentLoading, Gender, NavLinkAdapter, SelectField, closeDialog, openDialog } from '@shared/components';
import { useAppDispatch } from '@shared/store';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import {useGetStudentBehaviorAssessmentMutation, useGetStudentDocumentDetailQuery, useGetStudentProblemTagDetailsQuery, useGetStudentStudyDetailQuery } from '@shared/pages/student';
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

interface LearningProcessProps {
  id?: string,
  actionButton?: ReactNode,
}
function LearningProcess({ id, actionButton }: LearningProcessProps) {
  const { id: studentRouteId } = useParams();
  const studentId = id || studentRouteId
  const { data, isLoading } = useGetStudentDocumentDetailQuery(studentId);
  const { data: academicTranscriptData } = useGetStudentStudyDetailQuery(studentId);
  const [tabValue, setTabValue] = useState(0);


  // const [displayView, setDisplayView] = useState<'' | 'academic_transcrip' | 'attendance_report'>('')
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleSelectSemester = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedSemester(event.target.value);
  };
  const student = data?.content
  // const navigate = useNavigate();
  // const location = useLocation()

  // const studentGpa = calculateGPA(academicTranscriptData?.content)
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
            Overview
          </Typography>
        </div>
        {academicTranscriptData && (
          <StudentGradeChart data={academicTranscriptData?.content} />
        )}

        <Divider />
        <div>
          <Typography className='font-semibold'>
            Academic details
          </Typography>
          <div className='flex gap-16 mt-16'>
            <Button
              startIcon={<Description />}
              variant='outlined'
              color='secondary'
              size='small'
              className={`w-216`}
              // onClick={(event) => {
              //   studentRouteId
              //     ? navigate('academic-transcript')
              //     : dispatch(openDialog({
              //       children: <AcademicTranscript id={studentId} />
              //     }));
              // }}
              onClick={(event) => {
                dispatch(openDialog({
                  children: <AcademicTranscript id={studentId} />
                }));
              }}
            >
              View academic transcript
            </Button>
            <Button
              startIcon={<Checklist />}
              variant='outlined' color='secondary' size='small' className={`w-216`}
              // onClick={(event) => {
              //   studentRouteId
              //     ? navigate('attendance-report')
              //     : dispatch(openDialog({
              //       children: <AttendanceReport id={studentId} />
              //     }));
              // }}
              onClick={(event) => {
                dispatch(openDialog({
                  children: <AttendanceReport id={studentId} />
                }));
              }}
            >
              View attendance report
            </Button>
            <Button
              startIcon={<Grade />}
              variant='outlined'
              color='secondary'
              size='small'
              className={`w-216`}
              // onClick={(event) => {
              //   studentRouteId
              //     ? navigate('academic-transcript')
              //     : dispatch(openDialog({
              //       children: <AcademicTranscript id={studentId} />
              //     }));
              // }}
              onClick={(event) => {
                dispatch(openDialog({
                  children: <MarkReport id={studentId} />
                }));
              }}
            >
              View mark report
            </Button>
          </div>
        </div>

        <Divider />
        <div>
          <Typography className='font-semibold'>
            Behavior Tags
          </Typography>
          <div className='flex justify-between items-center'>
            <Box className='mt-16'>
              <SelectField
                label="Semester"
                options={semesterOptions}
                value={selectedSemester}
                onChange={handleSelectSemester}
                className='w-192'
                size='small'
                showClearOptions
              />
            </Box>
            {
              isLoadingGeneralAssessment
                ? <BackdropLoading />
                : <Button size='small' color='secondary' variant='contained'
                  startIcon={<EventNote fontSize='small' />}
                  disabled={isLoadingGeneralAssessment}
                  onClick={handleAssessment}
                >
                  Generate general assessment
                </Button>
            }
          </div>

          <Box className="w-full flex-1">
            {Object.keys(studentProblemTags).map((subject) => (
              <Accordion key={subject} className="p-0 shadow-0" defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className=''>{subject}</Typography>
                </AccordionSummary>
                <AccordionDetails className="flex flex-wrap gap-4 !my-0 !py-0">
                  {/* Group tags by category */}
                  {Object.keys(studentProblemTags[subject].isNotExcluded.concat(studentProblemTags[subject].isExcluded).reduce((acc, tag) => {
                    // Group tags by category
                    const { category, problemTagName, number, source, excluded } = tag;
                    if (!acc[category]) {
                      acc[category] = [];
                    }
                    acc[category].push({ problemTagName, number, source, excluded });
                    return acc;
                  }, {})).map((category) => (
                    <Box key={category} className="w-full mb-4">
                      <Typography variant="subtitle2" className="font-medium text-text-secondary">
                        {category}
                      </Typography>
                      <div className="flex flex-wrap gap-4">
                        {/* Render tags under each category */}
                        {studentProblemTags[subject].isNotExcluded.concat(studentProblemTags[subject].isExcluded)
                          .filter((tag) => tag.category === category)
                          .map((tag, index) => (
                            <Chip
                              key={`${category}-${index}`}
                              label={`${tag.problemTagName} x ${tag.number}`}
                              variant={tag.excluded ? 'outlined' : 'filled'}
                              disabled={tag.excluded}
                            />
                          ))}
                      </div>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </div>
      </div>
    </section>
  );
}

export default LearningProcess;
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
