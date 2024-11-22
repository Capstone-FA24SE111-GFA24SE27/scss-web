import {
  BackdropLoading,
	Breadcrumbs,
	closeDialog,
	ContentLoading,
	Gender,
	openDialog,
	SelectField,
} from '@/shared/components';
import {
	StudentAppointmentList,
	useGetStudentBehaviorAssessmentMutation,
	useGetStudentDocumentDetailQuery,
	useGetStudentProblemTagDetailsQuery,
	useGetStudentStudyDetailQuery,
} from '@/shared/pages';
import AcademicTranscript from '@/shared/pages/student/AcademicTranscript';
import AttendanceReport from '@/shared/pages/student/AttendanceReport';
import { useGetSemestersQuery } from '@/shared/services';
import { calculateGPA } from '@/shared/utils';
import {
	CakeOutlined,
	Checklist,
	Description,
	EmailOutlined,
	EventNote,
	LocalPhoneOutlined,
} from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Button,
	Chip,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Tab,
	Tabs,
	Typography,
} from '@mui/material';
import { useAppDispatch } from '@shared/store';
import dayjs from 'dayjs';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StudentGradeChart from '@/shared/pages/student/StudentGradeChart';
import ReactMarkdown from 'react-markdown';

type Props = {};

const StudentDetails = (props: Props) => {
	const { id: studentId } = useParams();
	const { data, isLoading } = useGetStudentDocumentDetailQuery(studentId);
	const { data: academicTranscriptData } =
		useGetStudentStudyDetailQuery(studentId);
	const [displayView, setDisplayView] = useState<
		'' | 'academic_transcrip' | 'attendance_report'
	>('');
	const [selectedSemester, setSelectedSemester] = useState('');

	const handleSelectSemester = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedSemester(event.target.value);
	};
	const student = data?.content;
	const navigate = useNavigate();
	const location = useLocation();

	const studentGpa = calculateGPA(academicTranscriptData?.content);

	const dispatch = useAppDispatch();
  const [tabValue, setTabValue] = useState(0);


	const { data: semesterData } = useGetSemestersQuery();
	const semesterOptions =
		semesterData?.map((semester) => ({
			label: semester.name,
			value: semester.name,
		})) || [];

	const { data: studentProblemTagsData } =
		useGetStudentProblemTagDetailsQuery(
			{
				studentId,
				semesterName: selectedSemester,
			},
			{
				skip: !selectedSemester,
			}
		);
	const studentProblemTags = studentProblemTagsData?.content || [];

	useEffect(() => {
		if (semesterData?.length) {
			setSelectedSemester(semesterData.at(-1).name);
		}
	}, [semesterData]);

  const [generateGeneralAssessment, { isLoading: isLoadingGeneralAssessment }] = useGetStudentBehaviorAssessmentMutation()

  const handleChangeTab = (event: React.SyntheticEvent, value: number) => {
    setTabValue(value);
  }

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
              // components={{
              //   ul: ({ node, ...props }) => (
              //     <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }} {...props} />
              //   ),
              //   li: ({ node, ...props }) => (
              //     <li style={{ marginBottom: '10px', fontSize: '16px' }} {...props} />
              //   ),
              // }}
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

	if (isLoading) {
		return <ContentLoading className='m-32 w-md' />;
	}

	if (!student) {
		return (
			<div className='relative p-48 w-md'>
				<Typography color='text.secondary' variant='h5'>
					Invalid student!
				</Typography>
			</div>
		);
	}

	return (
		<div className='p-16 px-32'>
			<Breadcrumbs
				parents={[
					{
						label: 'Admin',
						url: `/`,
					},
					{
						label: 'Students',
						url: `/profiles/students`,
					},
				]}
				currentPage={student.studentProfile.profile.fullName}
			/>
			<div className="relative flex flex-col items-center flex-auto px-24 sm:p-36">
        <div className="w-full max-w-3xl">
          <div className="flex items-end flex-auto pl-16">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary'
              }}
              className="font-bold w-128 h-128 text-64"
              src={student?.studentProfile.profile.avatarLink}
              alt={student?.studentProfile.profile.fullName}
            >
              {student?.studentProfile.profile.fullName?.charAt(0)}
            </Avatar>
            <Gender gender={student?.studentProfile.profile.gender} />
           
          </div>
          <div className='pl-16'>

            <Typography className="mt-12 text-4xl font-bold truncate">{student?.studentProfile.profile.fullName}</Typography>

            <Typography className="mt-4 text-xl">{student?.studentProfile.studentCode}</Typography>
          </div>

          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: 'w-full h-32 border-b mb-16 mt-8' }}
          >
            <Tab
              className="text-lg font-semibold min-h-40"
              label="General Information"
            />
            <Tab
              className="text-lg font-semibold min-h-40"
              label="Learning process"
            />
          </Tabs>

          <section className='flex flex-col pl-16'>
            {
              tabValue === 0 && (
                <div className="flex flex-col space-y-16">
                  <div className='flex flex-col px-8 space-y-16'>

                    {student?.studentProfile.email && (
                      <div className="flex items-center">
                        <EmailOutlined />
                        <div className="ml-24 leading-6">{student?.studentProfile.email}</div>
                      </div>
                    )}

                    {student?.studentProfile.profile.phoneNumber && (
                      <div className="flex items-center">
                        <LocalPhoneOutlined />
                        <div className="ml-24 leading-6">{student?.studentProfile.profile.phoneNumber}</div>
                      </div>
                    )}


                    {student?.studentProfile.profile.dateOfBirth && (
                      <div className="flex items-center">
                        <CakeOutlined />
                        <div className="ml-24 leading-6">{dayjs(student?.studentProfile.profile.dateOfBirth).format('DD-MM-YYYY')}</div>
                      </div>
                    )}

                  </div>


                  <Divider />
                  <div>
                    <Typography className='font-semibold'>
                      Field of study
                    </Typography>
                    <Box className="p-8 mt-8 rounded">

                      {/* Department Section */}
                      <div className="grid grid-cols-3 mb-4 gap-y-2">
                        <div className="col-span-1 font-medium text-text-secondary">Department:</div>
                        <div className="col-span-2">
                          <span>{student?.studentProfile.department.name}</span>
                          {student?.studentProfile.department.code && (
                            <span className="ml-2 text-text-disabled"> ({student?.studentProfile.department.code})</span>
                          )}
                        </div>
                      </div>

                      {/* Major Section */}
                      <div className="grid grid-cols-3 gap-y-2">
                        <div className="col-span-1 font-medium text-text-secondary">Major:</div>
                        <div className="col-span-2">
                          <span>{student?.studentProfile.major.name}</span>
                          {student?.studentProfile.major.code && (
                            <span className="ml-2 text-text-disabled"> ({student?.studentProfile.major.code})</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 mb-4 gap-y-2">
                        <div className="col-span-1 font-medium text-text-secondary">Specialization:</div>
                        <div className="col-span-2">{student?.studentProfile?.specialization?.name || `N/A`}</div>
                      </div>
                    </Box>
                  </div>

                  <Divider />
                  <div>
                    <Typography className='font-semibold'>
                      Counseling information
                    </Typography>
                    <div className='flex flex-col gap-8 mt-8'>
                      <div>
                        {/* Psychological and Health Status */}
                        <Accordion className="p-0 -ml-8 shadow-0">
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Psychological and Health Status</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography><strong>Introduction:</strong> {student?.counselingProfile?.introduction || `N/A`}</Typography>
                            <Typography><strong>Current Health Status:</strong> {student?.counselingProfile?.currentHealthStatus || `N/A`}</Typography>
                            <Typography><strong>Psychological Status:</strong> {student?.counselingProfile?.psychologicalStatus || `N/A`}</Typography>
                            <Typography><strong>Stress Factors:</strong> {student?.counselingProfile?.stressFactors || `N/A`}</Typography>
                          </AccordionDetails>
                        </Accordion>

                        {/* Academic Information */}
                        <Accordion className="p-0 -ml-8 shadow-0">
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Academic Information</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography><strong>Academic Difficulties:</strong> {student?.counselingProfile?.academicDifficulties || `N/A`}</Typography>
                            <Typography><strong>Study Plan:</strong> {student?.counselingProfile?.studyPlan || `N/A`}</Typography>
                          </AccordionDetails>
                        </Accordion>

                        {/* Career Information */}
                        <Accordion className="p-0 -ml-8 shadow-0">
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Career Information</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography><strong>Career Goals:</strong> {student?.counselingProfile?.careerGoals || `N/A`}</Typography>
                            <Typography><strong>Part-Time Experience:</strong> {student?.counselingProfile?.partTimeExperience || `N/A`}</Typography>
                            <Typography><strong>Internship Program:</strong> {student?.counselingProfile?.internshipProgram || `N/A`}</Typography>
                          </AccordionDetails>
                        </Accordion>

                        {/* Activities and Lifestyle */}
                        <Accordion className="p-0 -ml-8 shadow-0">
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Activities and Lifestyle</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography><strong>Extracurricular Activities:</strong> {student?.counselingProfile?.extracurricularActivities || `N/A`}</Typography>
                            <Typography><strong>Personal Interests:</strong> {student?.counselingProfile?.personalInterests || `N/A`}</Typography>
                            <Typography><strong>Social Relationships:</strong> {student?.counselingProfile?.socialRelationships || `N/A`}</Typography>
                          </AccordionDetails>
                        </Accordion>

                        {/* Financial Support */}
                        <Accordion className="p-0 -ml-8 shadow-0">
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Financial Support</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography><strong>Financial Situation:</strong> {student?.counselingProfile?.financialSituation || `N/A`}</Typography>
                            <Typography><strong>Financial Support:</strong> {student?.counselingProfile?.financialSupport || `N/A`}</Typography>
                          </AccordionDetails>
                        </Accordion>

                        {/* Counseling Requests */}
                        <Accordion className="p-0 -ml-8 shadow-0">
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                    <StudentAppointmentList id={studentId} />
                  </div>
                </div>
              )
            }
            {
              tabValue === 1 && (
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
                    </div>
                  </div>

                  <Divider />
                  <div>
                    <Typography className='font-semibold'>
                      Behavior Tags
                    </Typography>
                    <div className='flex items-center justify-between'>
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

                    <Box className="flex-1 w-full">
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
              )
            }
          </section>

        </div >
      </div >
		</div>
	);
};

export default StudentDetails;
