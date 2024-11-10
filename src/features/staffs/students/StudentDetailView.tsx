import {
	Add,
	CakeOutlined,
	CalendarMonth,
	Checklist,
	Description,
	EmailOutlined,
	LocalPhoneOutlined,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Paper,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import {
	ContentLoading,
	Gender,
	NavLinkAdapter,
	StudentAppointmentList,
	useGetStudentDocumentViewQuery,
	useGetStudentStudyViewQuery,
} from '@shared/components';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { calculateGPA } from '@/shared/utils';
import { ReactNode } from 'react';
import { useAppSelector } from '@shared/store';
import { selectFilter } from './student-list-slice';
import CreateDemandButton from '../CreateDemandButton';
/**
 * The contact view.
 */

interface StudentViewProps {
	actionButton?: (props: any) => JSX.Element;
	children?: ReactNode;
}
function StudentDetailView({ actionButton, children }: StudentViewProps) {
	const routeParams = useParams();
	const filter = useAppSelector(selectFilter);
	const { id: studentId } = routeParams as { id: string };
	const { data, isLoading } = useGetStudentDocumentViewQuery(studentId);
	const { data: academicTranscriptData } =
		useGetStudentStudyViewQuery(studentId);

	const student = data?.content;
	const navigate = useNavigate();
	const location = useLocation();

	const studentGpa = calculateGPA(academicTranscriptData?.content);

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
		<div className='w-md'>
			<Box
				className='relative w-full px-32 h-160 sm:h-192 sm:px-48'
				sx={{
					backgroundColor: 'background.default',
				}}
			>
				<img
					className='absolute inset-0 object-cover w-full h-full'
					src={'/assets/images/fptu-cover.jpeg'}
					alt='user background'
				/>
			</Box>
			<div className='relative flex flex-col items-center flex-auto p-24 pt-0 sm:p-48 sm:pt-0'>
				<div className='w-full max-w-3xl'>
					<div className='flex items-end flex-auto -mt-64'>
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary',
							}}
							className='font-bold w-128 h-128 text-64'
							src={student.studentProfile.profile.avatarLink}
							alt={student?.studentProfile.profile.fullName}
						>
							{student?.studentProfile.profile.fullName?.charAt(
								0
							)}
						</Avatar>
						<Gender
							gender={student?.studentProfile.profile.gender}
						/>

						<div className='flex items-center mb-4 ml-auto'>
							{/* <Button
                    variant="contained"
                    color="secondary"
                    sx={{ color: 'white' }}
                    component={NavLinkAdapter}
                    to="booking"
                    startIcon={<Add />}
                  >
                    Create an appointment
                  </Button> */}
							{filter.tab === 'RECOMMENDED' ? (
								<CreateDemandButton />
							) : (
								<CreateDemandButton />
							)}
						</div>
					</div>

					<Typography className='mt-12 text-4xl font-bold truncate'>
						{student?.studentProfile.profile.fullName}
					</Typography>

					{/* <div className='flex items-end gap-8 text-lg text-text-disabled'>
                    <Rating
                        name="simple-controlled"
                        value={4.6}
                        readOnly
                        precision={0.5}
                    />
                    <div>(116)</div>
                </div> */}

					<div className='flex items-center gap-8 mt-8 '>
						<Chip
							label={student?.studentProfile.studentCode}
							size='medium'
							className='px-16 text-lg'
						/>
					</div>

					<Divider className='mt-16 mb-24' />

					<div className='flex flex-col space-y-16'>
						{student?.studentProfile.email && (
							<div className='flex items-center'>
								<EmailOutlined />
								<div className='ml-24 leading-6'>
									{student?.studentProfile.email}
								</div>
							</div>
						)}

						{student?.studentProfile.profile.phoneNumber && (
							<div className='flex items-center'>
								<LocalPhoneOutlined />
								<div className='ml-24 leading-6'>
									{
										student?.studentProfile.profile
											.phoneNumber
									}
								</div>
							</div>
						)}

						{student?.studentProfile.profile.dateOfBirth && (
							<div className='flex items-center'>
								<CakeOutlined />
								<div className='ml-24 leading-6'>
									{dayjs(
										student?.studentProfile.profile
											.dateOfBirth
									).format('DD-MM-YYYY')}
								</div>
							</div>
						)}

						{academicTranscriptData && (
							<div className='flex items-center'>
								{/* <SchoolOutlined /> */}
								<span className='font-semibold'>GPA</span>
								<div className='flex items-center justify-between w-full ml-24 leading-6'>
									{studentGpa}
									<Button
										startIcon={<Description />}
										variant='outlined'
										color='secondary'
										size='small'
										className={`w-216`}
										onClick={() =>
											navigate('academic-transcript')
										}
									>
										View academic transcript
									</Button>
								</div>
							</div>
						)}

						{student?.studentProfile && (
							<div className='flex items-center'>
								<div className='flex items-center justify-end w-full ml-24 leading-6'>
									<Button
										startIcon={<Checklist />}
										variant='outlined'
										color='secondary'
										size='small'
										className={`w-216`}
										onClick={() =>
											navigate('attendance-report')
										}
									>
										View attendance report
									</Button>
								</div>
							</div>
						)}

						<Divider />
						<div>
							<Typography className='font-semibold'>
								Academic details
							</Typography>
							<Paper className='p-8 mt-8 rounded shadow'>
								<div className='grid grid-cols-3 mb-4 gap-y-2'>
									<div className='col-span-1 font-medium text-text-secondary'>
										Specialization:
									</div>
									<div className='col-span-2'>
										{
											student.studentProfile
												?.specialization?.name
										}
									</div>
								</div>

								{/* Department Section */}
								<div className='grid grid-cols-3 mb-4 gap-y-2'>
									<div className='col-span-1 font-medium text-text-secondary'>
										Department:
									</div>
									<div className='col-span-2'>
										<span>
											{
												student.studentProfile
													.department.name
											}
										</span>
										{student.studentProfile.department
											.code && (
											<span className='ml-2 text-text-disabled'>
												{' '}
												(
												{
													student.studentProfile
														.department.code
												}
												)
											</span>
										)}
									</div>
								</div>

								{/* Major Section */}
								<div className='grid grid-cols-3 gap-y-2'>
									<div className='col-span-1 font-medium text-text-secondary'>
										Major:
									</div>
									<div className='col-span-2'>
										<span>
											{student.studentProfile.major.name}
										</span>
										{student.studentProfile.major.code && (
											<span className='ml-2 text-text-disabled'>
												{' '}
												(
												{
													student.studentProfile.major
														.code
												}
												)
											</span>
										)}
									</div>
								</div>
							</Paper>
						</div>

						<Divider />
						<div>
							<Typography className='font-semibold'>
								Counseling infomation
							</Typography>
							<div className='flex flex-col gap-8 mt-8'>
								<div>
									{/* Psychological and Health Status */}
									<Accordion className='shadow'>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
										>
											<Typography>
												Psychological and Health Status
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography>
												<strong>Introduction:</strong>{' '}
												{student.counselingProfile
													?.introduction || `N/A`}
											</Typography>
											<Typography>
												<strong>
													Current Health Status:
												</strong>{' '}
												{student.counselingProfile
													?.currentHealthStatus ||
													`N/A`}
											</Typography>
											<Typography>
												<strong>
													Psychological Status:
												</strong>{' '}
												{student.counselingProfile
													?.psychologicalStatus ||
													`N/A`}
											</Typography>
											<Typography>
												<strong>Stress Factors:</strong>{' '}
												{student.counselingProfile
													?.stressFactors || `N/A`}
											</Typography>
										</AccordionDetails>
									</Accordion>

									{/* Academic Information */}
									<Accordion className='shadow'>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
										>
											<Typography>
												Academic Information
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography>
												<strong>
													Academic Difficulties:
												</strong>{' '}
												{student.counselingProfile
													?.academicDifficulties ||
													`N/A`}
											</Typography>
											<Typography>
												<strong>Study Plan:</strong>{' '}
												{student.counselingProfile
													?.studyPlan || `N/A`}
											</Typography>
										</AccordionDetails>
									</Accordion>

									{/* Career Information */}
									<Accordion className='shadow'>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
										>
											<Typography>
												Career Information
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography>
												<strong>Career Goals:</strong>{' '}
												{student.counselingProfile
													?.careerGoals || `N/A`}
											</Typography>
											<Typography>
												<strong>
													Part-Time Experience:
												</strong>{' '}
												{student.counselingProfile
													?.partTimeExperience ||
													`N/A`}
											</Typography>
											<Typography>
												<strong>
													Internship Program:
												</strong>{' '}
												{student.counselingProfile
													?.internshipProgram ||
													`N/A`}
											</Typography>
										</AccordionDetails>
									</Accordion>

									{/* Activities and Lifestyle */}
									<Accordion className='shadow'>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
										>
											<Typography>
												Activities and Lifestyle
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography>
												<strong>
													Extracurricular Activities:
												</strong>{' '}
												{student.counselingProfile
													?.extracurricularActivities ||
													`N/A`}
											</Typography>
											<Typography>
												<strong>
													Personal Interests:
												</strong>{' '}
												{student.counselingProfile
													?.personalInterests ||
													`N/A`}
											</Typography>
											<Typography>
												<strong>
													Social Relationships:
												</strong>{' '}
												{student.counselingProfile
													?.socialRelationships ||
													`N/A`}
											</Typography>
										</AccordionDetails>
									</Accordion>

									{/* Financial Support */}
									<Accordion className='shadow'>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
										>
											<Typography>
												Financial Support
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography>
												<strong>
													Financial Situation:
												</strong>{' '}
												{student.counselingProfile
													?.financialSituation ||
													`N/A`}
											</Typography>
											<Typography>
												<strong>
													Financial Support:
												</strong>{' '}
												{student.counselingProfile
													?.financialSupport || `N/A`}
											</Typography>
										</AccordionDetails>
									</Accordion>

									{/* Counseling Requests */}
									<Accordion className='shadow'>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
										>
											<Typography>
												Counseling Requests
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography>
												<strong>
													Desired Counseling Fields:
												</strong>{' '}
												{student.counselingProfile
													?.desiredCounselingFields ||
													`N/A`}
											</Typography>
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
							<StudentAppointmentList />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StudentDetailView;
