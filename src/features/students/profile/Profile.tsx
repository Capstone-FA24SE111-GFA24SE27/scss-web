import React from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography, Divider } from '@mui/material';
import { useGetStudentDocumentQuery } from '../students-api';

interface ProfileProps {
  studentProfile: {
    id: number;
    profile: {
      id: number;
      fullName: string;
      phoneNumber: string;
      dateOfBirth: number;
      avatarLink: string;
      gender: string;
    };
    studentCode: string;
    email: string;
    specialization: {
      id: number;
      name: string;
    };
  };
  counselingProfile: {
    introduction: string;
    currentHealthStatus: string;
    psychologicalStatus: string;
    stressFactors: string;
    academicDifficulties: string;
    studyPlan: string;
    careerGoals: string;
    partTimeExperience: string;
    internshipProgram: string;
    extracurricularActivities: string;
    personalInterests: string;
    socialRelationships: string;
    financialSituation: string;
    financialSupport: string;
    desiredCounselingFields: string;
    status: string;
  };
}


const Profile = () => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // const studentProfile = {
  //   "id": 53,
  //   "profile": {
  //     "id": 53,
  //     "fullName": "Michael",
  //     "phoneNumber": "1234567890",
  //     "dateOfBirth": 946684800000,
  //     "avatarLink": "https://png.pngtree.com/png-vector/20240204/ourlarge/pngtree-avatar-job-student-flat-portrait-of-man-png-image_11606889.png",
  //     "gender": "MALE"
  //   },
  //   "studentCode": "SE110002",
  //   "email": "sm2",
  //   "specialization": {
  //     "id": 1,
  //     "name": "Khoa học tâm lý"
  //   }
  // }
  // const counselingProfile = {
  //   "introduction": "AAA",
  //   "currentHealthStatus": "BBB",
  //   "psychologicalStatus": "CC",
  //   "stressFactors": "DD",
  //   "academicDifficulties": "aaa",
  //   "studyPlan": "aaaa",
  //   "careerGoals": "asd",
  //   "partTimeExperience": "asd",
  //   "internshipProgram": "asd",
  //   "extracurricularActivities": "fd",
  //   "personalInterests": "fd",
  //   "socialRelationships": "fd",
  //   "financialSituation": "fdfd",
  //   "financialSupport": "fdfd",
  //   "desiredCounselingFields": "fdfdfdfd",
  //   "status": "UNVERIFIED"
  // }

  const { data: studentDocumentData } = useGetStudentDocumentQuery()
  const counselingProfile = studentDocumentData?.content?.counselingProfile
  const studentProfile = studentDocumentData?.content?.studentProfile
  if(!studentProfile || !counselingProfile){
    return <div>No</div>
  }
  return (
    <Box className="p-8 bg-gray-100 min-h-screen">
      <Card className="max-w-3xl mx-auto">
        <CardContent>
          <Box className="flex flex-col items-center">
            <Avatar src={studentProfile.profile.avatarLink} className="w-32 h-32" />
            <Typography variant="h5" className="mt-4">
              {studentProfile.profile.fullName}
            </Typography>
            {/* <Typography variant="body1" className="text-gray-500">
              {studentProfile.specialization.name}
            </Typography> */}
            <Typography variant="body2" className="text-gray-500">
              Student Code: {studentProfile.studentCode}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Gender: {studentProfile.profile.gender}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Date of Birth: {formatDate(studentProfile.profile.dateOfBirth)}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Email: {studentProfile.email}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Phone: {studentProfile.profile.phoneNumber}
            </Typography>
          </Box>
          <Divider className="my-4" />
          <Box className="space-y-4">
            <Typography variant="h6" className="text-gray-700">Counseling Profile</Typography>
            <Box>
              <Typography variant="subtitle1">Introduction</Typography>
              <Typography variant="body2">{counselingProfile.introduction}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Current Health Status</Typography>
              <Typography variant="body2">{counselingProfile.currentHealthStatus}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Psychological Status</Typography>
              <Typography variant="body2">{counselingProfile.psychologicalStatus}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Stress Factors</Typography>
              <Typography variant="body2">{counselingProfile.stressFactors}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Academic Difficulties</Typography>
              <Typography variant="body2">{counselingProfile.academicDifficulties}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Study Plan</Typography>
              <Typography variant="body2">{counselingProfile.studyPlan}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Career Goals</Typography>
              <Typography variant="body2">{counselingProfile.careerGoals}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Part-Time Experience</Typography>
              <Typography variant="body2">{counselingProfile.partTimeExperience}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Internship Program</Typography>
              <Typography variant="body2">{counselingProfile.internshipProgram}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Extracurricular Activities</Typography>
              <Typography variant="body2">{counselingProfile.extracurricularActivities}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Personal Interests</Typography>
              <Typography variant="body2">{counselingProfile.personalInterests}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Social Relationships</Typography>
              <Typography variant="body2">{counselingProfile.socialRelationships}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Financial Situation</Typography>
              <Typography variant="body2">{counselingProfile.financialSituation}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Financial Support</Typography>
              <Typography variant="body2">{counselingProfile.financialSupport}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Desired Counseling Fields</Typography>
              <Typography variant="body2">{counselingProfile.desiredCounselingFields}</Typography>
            </Box>
            {/* <Box>
              <Typography variant="subtitle1">Status</Typography>
              <Typography variant="body2">{counselingProfile.status}</Typography>
            </Box> */}
          </Box>
          <Button variant="contained" color="primary" className="mt-6 w-full">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;