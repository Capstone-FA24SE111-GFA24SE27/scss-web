import { UserListItem } from '@/shared/components';
import { priorityColor } from '@/shared/constants';
import {
  Avatar,
  Box,
  Chip,
  Rating,
  Typography,
  Link,
} from '@mui/material';
import dayjs from 'dayjs';

const DemandDetail = ({ id }: { id?: string }) => {
  const appointment = {
    "id": 1,
    "status": "PROCESSING",
    "student": {
      "id": 44,
      "profile": {
        "id": 44,
        "fullName": "John Doe",
        "phoneNumber": "1234567890",
        "dateOfBirth": 946684800000,
        "avatarLink": "https://png.pngtree.com/png-vector/20240204/ourlarge/pngtree-avatar-job-student-flat-portrait-of-man-png-image_11606889.png",
        "gender": "MALE"
      },
      "studentCode": "SE1001",
      "email": "sm1",
      "specialization": null,
      "department": {
        "id": 1,
        "name": "Information Technology",
        "code": "IT"
      },
      "major": {
        "id": 1,
        "name": "Software Engineering",
        "code": "SE",
        "departmentId": 1
      }
    },
    "supportStaff": {
      "id": 3,
      "profile": {
        "id": 3,
        "fullName": "Support staff",
        "phoneNumber": "0987654321",
        "dateOfBirth": 631152000000,
        "avatarLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbcgVPXa2ROdMbYfGCTKjcL6KE9p-So1BaxQ&s",
        "gender": "FEMALE"
      },
      "status": "AVAILABLE"
    },
    "contactNote": "string",
    "summarizeNote": null,
    "counselor": {
      "id": 12,
      "profile": {
        "id": 12,
        "fullName": "Nguyễn Văn A1 1",
        "phoneNumber": "1234567890",
        "dateOfBirth": 315532800000,
        "avatarLink": "https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-man-avatar-isolated-png-image_9935819.png",
        "gender": "MALE"
      },
      "rating": 4,
      "email": "acm1",
      "gender": "MALE",
      "status": "AVAILABLE",
      "specialization": {
        "id": 1,
        "name": "Bridge Engineer",
        "majorId": null,
        "code": null
      },
      "academicDegree": "Thạc sĩ",
      "department": {
        "id": 1,
        "name": "Information Technology",
        "code": "IT"
      },
      "major": {
        "id": 1,
        "name": "Software Engineering",
        "code": "SE",
        "departmentId": 1
      }
    },
    "startDateTime": "2024-11-19T13:12:47.221948427",
    "endDateTime": null,
    "appointments": [],
    "priorityLevel": "LOW",
    "additionalInformation": "string",
    "issueDescription": "string",
    "causeDescription": "string",
    "demandType": "ACADEMIC"
  }
  if (!appointment) {
    return (
      <Typography variant="h5" color="textSecondary">
        No appointment
      </Typography>
    );
  }

  return (
    <Box className="p-36 flex flex-col gap-16 w-md">
      <Typography className="font-extrabold leading-none tracking-tight text-20 md:text-24">
        Detailed Appointment
      </Typography>

      {/* Appointment Status */}
      <div className="flex gap-24 pb-8">
        <Chip
          label={appointment.status}
          variant="filled"
          color="warning"
          size="small"
        />
        {/* <Chip
          label={appointment.priorityLevel}
          variant="outlined"
          color="secondary"
          size="small"
        /> */}
        <Chip
          label={appointment.demandType}
          variant="filled"
          color="info"
          size="small"
        />
      </div>

      {/* Appointment Time */}
      <div className="flex gap-24 pb-8">
        <div className="flex items-center gap-8">
          <Typography>
            {dayjs(appointment.startDateTime).format('YYYY-MM-DD HH:mm')}
          </Typography>
        </div>
      </div>

      <div className='flex items-center gap-8'>
        <Typography className='text-sm text-text-secondary w-64'>Priority:</Typography>
        <Typography className='text-sm font-bold' color={priorityColor[appointment.priorityLevel]}>{appointment.priorityLevel}</Typography>
      </div>

      {/* Student Information */}
      <div className="flex flex-col flex-1 gap-8 rounded">
        <UserListItem
          fullName={appointment.student.profile.fullName}
          avatarLink={appointment.student.profile.avatarLink}
          phoneNumber={appointment.student.profile.phoneNumber}
          email={appointment.student.email}
        />
      </div>

      {/* Support Staff Information */}
      <div className="flex flex-col flex-1 gap-8 rounded">
        <Typography className="text-lg font-semibold text-primary-light">
          Support Staff
        </Typography>
        <div className="flex items-center gap-16">
          <Avatar src={appointment.supportStaff.profile.avatarLink} />
          <Typography>{appointment.supportStaff.profile.fullName}</Typography>
        </div>
        <Typography>Phone: {appointment.supportStaff.profile.phoneNumber}</Typography>
        <Typography>Status: {appointment.supportStaff.status}</Typography>
      </div>

      {/* Counselor Information */}
      <div className="flex flex-col flex-1 gap-8 rounded">
        <Typography className="text-lg font-semibold text-primary-light">
          Counselor
        </Typography>
        <div className="flex items-center gap-16">
          <Avatar src={appointment.counselor.profile.avatarLink} />
          <Typography>{appointment.counselor.profile.fullName}</Typography>
        </div>
        <Typography>Phone: {appointment.counselor.profile.phoneNumber}</Typography>
        <Typography>Email: {appointment.counselor.email}</Typography>
        <Typography>
          Specialization: {appointment.counselor.specialization.name}
        </Typography>
        <Typography>Academic Degree: {appointment.counselor.academicDegree}</Typography>
        <Rating value={appointment.counselor.rating} readOnly />
      </div>

      {/* Additional Information */}
      <div className="flex flex-col gap-8">
        <Typography className="text-lg font-semibold text-primary-light">
          Additional Information
        </Typography>
        <Typography>Contact Note: {appointment.contactNote || 'N/A'}</Typography>
        <Typography>Issue Description: {appointment.issueDescription || 'N/A'}</Typography>
        <Typography>Cause Description: {appointment.causeDescription || 'N/A'}</Typography>
        <Typography>
          Additional Information: {appointment.additionalInformation || 'N/A'}
        </Typography>
      </div>

      {/* Meeting Location */}
      {/* <div className="flex flex-col gap-8">
        <Typography className="text-lg font-semibold text-primary-light">
          Meeting Details
        </Typography>
        {appointment.meetingType === 'ONLINE' && appointment.meetUrl ? (
          <Link
            href={appointment.meetUrl}
            target="_blank"
            rel="noopener"
            className="underline text-secondary-main"
          >
            {appointment.meetUrl}
          </Link>
        ) : (
          <Typography>Address: {appointment.address || 'N/A'}</Typography>
        )}
      </div> */}
    </Box>
  );
};

export default DemandDetail;
