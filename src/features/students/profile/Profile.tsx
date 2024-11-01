import { CakeOutlined, CalendarMonth, EmailOutlined, LocalPhoneOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { ContentLoading, Gender, NavLinkAdapter } from '@shared/components';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetStudentDocumentQuery } from '../students-api';
/**
 * The contact view.
 */

interface StudentProfileProps {
}
function StudentProfile({ }: StudentProfileProps) {
  const routeParams = useParams();
  const { id: studentId } = routeParams as { id: string };
  const { data, isLoading } = useGetStudentDocumentQuery();
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
    <div className='w-full'>
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
        <div className="w-full max-w-3xl space-y-16">
          <div className="flex items-end flex-auto -mt-52 gap-8">
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
            <div className=''>
              <Typography className="mt-12 text-4xl font-bold truncate">{student?.studentProfile.profile.fullName}</Typography>
              <Typography className="text-xl truncate">{student?.studentProfile.studentCode}</Typography>
            </div>
          </div>


          <Divider />


          <div className="flex flex-col space-y-16">
            <div>
              <Typography className='font-semibold'>
                General Infomation
              </Typography>
              <Paper className="shadow p-16 rounded mt-8">
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

              </Paper>
            </div>



            <Divider />
            <div>
              <Typography className='font-semibold'>
                Academic details
              </Typography>
              <Paper className="shadow p-16 rounded mt-8">

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
              </Paper>
            </div>

            <Divider />
            <div>
              <Typography className='font-semibold'>
                Counseling infomation
              </Typography>

              <Paper className='shadow rounded p-8 flex flex-col gap-8 mt-8'>

                {/* Psychological and Health Status */}
                <div className="p-8 rounded">
                  <Typography className="font-medium mb-4 text-lg">Psychological and Health Status</Typography>
                  <div className="grid grid-cols-3 gap-y-2">
                    <div className="col-span-1 font-medium text-gray-600">Introduction:</div>
                    <div className="col-span-2">{student.counselingProfile?.introduction || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Current Health Status:</div>
                    <div className="col-span-2">{student.counselingProfile?.currentHealthStatus || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Psychological Status:</div>
                    <div className="col-span-2">{student.counselingProfile?.psychologicalStatus || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Stress Factors:</div>
                    <div className="col-span-2">{student.counselingProfile?.stressFactors || 'N/A'}</div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="p-8 rounded">
                  <Typography className="font-medium mb-4 text-lg">Academic Information</Typography>
                  <div className="grid grid-cols-3 gap-y-2">
                    <div className="col-span-1 font-medium text-gray-600">Academic Difficulties:</div>
                    <div className="col-span-2">{student.counselingProfile?.academicDifficulties || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Study Plan:</div>
                    <div className="col-span-2">{student.counselingProfile?.studyPlan || 'N/A'}</div>
                  </div>
                </div>

                {/* Career Information */}
                <div className="p-8 rounded">
                  <Typography className="font-medium mb-4 text-lg">Career Information</Typography>
                  <div className="grid grid-cols-3 gap-y-2">
                    <div className="col-span-1 font-medium text-gray-600">Career Goals:</div>
                    <div className="col-span-2">{student.counselingProfile?.careerGoals || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Part-Time Experience:</div>
                    <div className="col-span-2">{student.counselingProfile?.partTimeExperience || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Internship Program:</div>
                    <div className="col-span-2">{student.counselingProfile?.internshipProgram || 'N/A'}</div>
                  </div>
                </div>

                {/* Activities and Lifestyle */}
                <div className="p-8 rounded">
                  <Typography className="font-medium mb-4 text-lg">Activities and Lifestyle</Typography>
                  <div className="grid grid-cols-3 gap-y-2">
                    <div className="col-span-1 font-medium text-gray-600">Extracurricular Activities:</div>
                    <div className="col-span-2">{student.counselingProfile?.extracurricularActivities || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Personal Interests:</div>
                    <div className="col-span-2">{student.counselingProfile?.personalInterests || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Social Relationships:</div>
                    <div className="col-span-2">{student.counselingProfile?.socialRelationships || 'N/A'}</div>
                  </div>
                </div>

                {/* Financial Support */}
                <div className="p-8 rounded">
                  <Typography className="font-medium mb-4 text-lg">Financial Support</Typography>
                  <div className="grid grid-cols-3 gap-y-2">
                    <div className="col-span-1 font-medium text-gray-600">Financial Situation:</div>
                    <div className="col-span-2">{student.counselingProfile?.financialSituation || 'N/A'}</div>

                    <div className="col-span-1 font-medium text-gray-600">Financial Support:</div>
                    <div className="col-span-2">{student.counselingProfile?.financialSupport || 'N/A'}</div>
                  </div>
                </div>

                {/* Counseling Requests */}
                <div className="p-8 rounded">
                  <Typography className="font-medium mb-4 text-lg">Counseling Requests</Typography>
                  <div className="grid grid-cols-3 gap-y-2">
                    <div className="col-span-1 font-medium text-gray-600">Desired Counseling Fields:</div>
                    <div className="col-span-2">{student.counselingProfile?.desiredCounselingFields || 'N/A'}</div>
                  </div>
                </div>

              </Paper>

            </div>

          </div>
        </div>
      </div>
    </div >
  );
}

export default StudentProfile;
