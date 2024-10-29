import Button from '@mui/material/Button';
import { ContentLoading, Gender, NavLinkAdapter } from '@shared/components';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/system/Box';
import _ from 'lodash';
import { AccessTime, CakeOutlined, CalendarMonth, EmailOutlined, LocalPhoneOutlined, NotesOutlined, Summarize, SchoolOutlined } from '@mui/icons-material';
import { ListItemButton, Paper, Rating } from '@mui/material';
import dayjs from 'dayjs';
import { useGetStudentDocumentViewQuery, useGetStudentViewQuery } from './student-api';
import { useEffect } from 'react';
import { appointmentsApi } from '../appointments/appointments-api';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
/**
 * The contact view.
 */

interface StudentViewProps {
}
function StudentView({ }: StudentViewProps) {
  const routeParams = useParams();
  const { id: studentId } = routeParams as { id: string };
  const { data, isLoading } = useGetStudentDocumentViewQuery(studentId);
  // const { data, isLoading } = useGetStudentQuery(studentId);
  const student = data?.content
  const navigate = useNavigate();
  const location = useLocation()

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
    <div className='w-lg'>
      <Box
        className="relative w-full px-32 h-160 sm:h-192 sm:px-48"
        sx={{
          backgroundColor: 'background.default'
        }}
      >
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src={'/assets/images/fptu-cover.jpeg'}
          alt="user background"
        />
      </Box>
      <div className="relative flex flex-col items-center flex-auto p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl">
          <div className="flex items-end flex-auto -mt-64">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary'
              }}
              className="font-bold w-128 h-128 text-64"
              src={student.studentProfile.profile.avatarLink}
              alt={student?.studentProfile.profile.fullName}
            >
              {student?.studentProfile.profile.fullName?.charAt(0)}
            </Avatar>
            <Gender gender={student?.studentProfile.profile.gender} />

            <div className="flex items-center mb-4 ml-auto">
              <Button
                variant="contained"
                color="secondary"
                sx={{ color: 'white' }}
                component={NavLinkAdapter}
                to="booking"
              >
                <span className="mx-8">Create an appointment</span>
              </Button>
            </div>


          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">{student?.studentProfile.profile.fullName}</Typography>

          {/* <div className='flex items-end gap-8 text-lg text-text-disabled'>
                    <Rating
                        name="simple-controlled"
                        value={4.6}
                        readOnly
                        precision={0.5}
                    />
                    <div>(116)</div>
                </div> */}

          <div className="flex items-center gap-8 mt-8 ">
            <Chip
              label={student?.studentProfile.studentCode}
              size="medium"
              className='px-16 text-lg'
            />
          </div>


          <Divider className="mt-16 mb-24" />

          <div className="flex flex-col space-y-16">
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

            {student?.studentProfile.profile.phoneNumber && (
              <div className="flex items-center">
                {/* <SchoolOutlined /> */}
                <span className='font-semibold'>GPA</span>
                <div className="flex items-center justify-between w-full ml-24 leading-6">
                  6.9/10
                  <Button variant='outlined' color='secondary' onClick={() => navigate('academic-transcript')}>View academic transcript</Button>
                </div>
              </div>
            )}
            <Divider />
            <div>
              <Typography className='font-semibold'>
                History of couseling
              </Typography>
              <div className='flex flex-col gap-8 mt-8'>
                {
                  !student?.counselingAppointment?.length
                    ? <Typography color='textSecondary'>No counseling history</Typography>
                    : student?.counselingAppointment?.map(appointment =>
                      <Paper className='flex justify-between px-8 py-4 rounded shadow' key={appointment.id}>
                        <div className='flex gap-8'>
                          <div className='flex items-center gap-8 '>
                            <CalendarMonth fontSize='small' />
                            <Typography className=''>{dayjs(appointment.requireDate).format('YYYY-MM-DD')}</Typography>
                          </div>
                          <div className='flex items-center gap-8'>
                            <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
                          </div>
                        </div>
                        <Button
                          size='small'
                          className='flex gap-8 px-8'
                          color='secondary'
                          disabled={!appointment.havingReport}
                          onClick={() => navigate(`report/${appointment.id}`)}
                        >
                          View report
                        </Button>
                      </Paper>
                    )
                }

              </div>
            </div>

            <Divider />
            <div>
              <Typography className='font-semibold'>
                Academic details
              </Typography>
              <Paper className="rounded p-8 shadow mt-8">

                <div className="grid grid-cols-3 gap-y-2 mb-4">
                  <div className="col-span-1 font-medium text-text-secondary">Specialization:</div>
                  <div className="col-span-2">{student.studentProfile.specialization.name}</div>
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
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Psychological and Health Status</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Introduction:</strong> {student.counselingProfile?.introduction}</Typography>
                      <Typography><strong>Current Health Status:</strong> {student.counselingProfile?.currentHealthStatus}</Typography>
                      <Typography><strong>Psychological Status:</strong> {student.counselingProfile?.psychologicalStatus}</Typography>
                      <Typography><strong>Stress Factors:</strong> {student.counselingProfile?.stressFactors}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Academic Information */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Academic Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Academic Difficulties:</strong> {student.counselingProfile?.academicDifficulties}</Typography>
                      <Typography><strong>Study Plan:</strong> {student.counselingProfile?.studyPlan}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Career Information */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Career Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Career Goals:</strong> {student.counselingProfile?.careerGoals}</Typography>
                      <Typography><strong>Part-Time Experience:</strong> {student.counselingProfile?.partTimeExperience}</Typography>
                      <Typography><strong>Internship Program:</strong> {student.counselingProfile?.internshipProgram}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Activities and Lifestyle */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Activities and Lifestyle</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Extracurricular Activities:</strong> {student.counselingProfile?.extracurricularActivities}</Typography>
                      <Typography><strong>Personal Interests:</strong> {student.counselingProfile?.personalInterests}</Typography>
                      <Typography><strong>Social Relationships:</strong> {student.counselingProfile?.socialRelationships}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Financial Support */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Financial Support</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Financial Situation:</strong> {student.counselingProfile?.financialSituation}</Typography>
                      <Typography><strong>Financial Support:</strong> {student.counselingProfile?.financialSupport}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Counseling Requests */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Counseling Requests</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Desired Counseling Fields:</strong> {student.counselingProfile?.desiredCounselingFields}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default StudentView;
