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

  const handleLocalNavigate = (route: string) => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    console.log('segment', pathSegments)
    // Create a new path using the first two segments
    const newPath = `/${pathSegments[0]}/${pathSegments[1]}/${route}`;

    // Navigate to the new path
    navigate(newPath);
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

          {/* <div className='flex items-end gap-8 text-lg text-gray-500'>
                    <Rating
                        name="simple-controlled"
                        value={4.6}
                        readOnly
                        precision={0.5}
                    />
                    <div>(116)</div>
                </div> */}

          <div className="flex items-center gap-8 mt-16 ">
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
                  student?.counselingAppointment?.map(appointment =>
                    <Paper className='flex justify-between px-8 py-4 rounded shadow' key={appointment.id}>
                      <div className='flex gap-8'>
                        <div className='flex items-center gap-8'>
                          <CalendarMonth fontSize='small' />
                          <Typography className='' fontSize='small' >2024-10-08</Typography>
                        </div>
                        <div className='flex items-center gap-8'>
                          {/* <AccessTime fontSize='small' /> */}
                          <Typography fontSize='small'>09:15 - 10:15</Typography>
                        </div>
                      </div>
                      <Button size='small' className='flex gap-8 px-8' color='secondary' disabled={!appointment.havingReport}>
                        {/* <Summarize /> */}
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
                More infomation
              </Typography>
              <div className='flex flex-col gap-8 mt-8'>
                {/* <div className="flex flex-col gap-8 mt-8">
                  {student?.counselingProfile && (
                    <>
                      <div className="flex flex-col">
                        <Typography>Introduction:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.introduction}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Current Health Status:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.currentHealthStatus}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Psychological Status:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.psychologicalStatus}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Stress Factors:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.stressFactors}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Academic Difficulties:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.academicDifficulties}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Study Plan:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.studyPlan}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Career Goals:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.careerGoals}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Part-Time Experience:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.partTimeExperience}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Internship Program:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.internshipProgram}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Extracurricular Activities:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.extracurricularActivities}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Personal Interests:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.personalInterests}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Social Relationships:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.socialRelationships}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Financial Situation:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.financialSituation}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Financial Support:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.financialSupport}</Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography>Desired Counseling Fields:</Typography>
                        <Typography color='textSecondary' className="">{student.counselingProfile.desiredCounselingFields}</Typography>
                      </div>
                    </>
                  )}
                </div> */}
                <div>
                  {/* Tình trạng tâm lý và sức khỏe */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Tình trạng tâm lý và sức khỏe</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Giới thiệu:</strong> {student.counselingProfile.introduction}</Typography>
                      <Typography><strong>Tình trạng sức khỏe hiện tại:</strong> {student.counselingProfile.currentHealthStatus}</Typography>
                      <Typography><strong>Tình trạng tâm lý:</strong> {student.counselingProfile.psychologicalStatus}</Typography>
                      <Typography><strong>Các yếu tố gây căng thẳng:</strong> {student.counselingProfile.stressFactors}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Thông tin học tập */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Thông tin học tập</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Khó khăn học tập:</strong> {student.counselingProfile.academicDifficulties}</Typography>
                      <Typography><strong>Kế hoạch học tập:</strong> {student.counselingProfile.studyPlan}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Thông tin hướng nghiệp */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Thông tin hướng nghiệp</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Mục tiêu nghề nghiệp:</strong> {student.counselingProfile.careerGoals}</Typography>
                      <Typography><strong>Kinh nghiệm làm việc part-time:</strong> {student.counselingProfile.partTimeExperience}</Typography>
                      <Typography><strong>Chương trình thực tập:</strong> {student.counselingProfile.internshipProgram}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Hoạt động và đời sống */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Hoạt động và đời sống</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Hoạt động ngoại khóa:</strong> {student.counselingProfile.extracurricularActivities}</Typography>
                      <Typography><strong>Sở thích cá nhân:</strong> {student.counselingProfile.personalInterests}</Typography>
                      <Typography><strong>Quan hệ xã hội:</strong> {student.counselingProfile.socialRelationships}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Hỗ trợ tài chính */}
                  <Accordion >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Hỗ trợ tài chính</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Tình hình tài chính:</strong> {student.counselingProfile.financialSituation}</Typography>
                      <Typography><strong>Hỗ trợ tài chính:</strong> {student.counselingProfile.financialSupport}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  {/* Yêu cầu tư vấn */}
                  <Accordion className='shadow'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Yêu cầu tư vấn</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography><strong>Lĩnh vực tư vấn mong muốn:</strong> {student.counselingProfile.desiredCounselingFields}</Typography>
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
