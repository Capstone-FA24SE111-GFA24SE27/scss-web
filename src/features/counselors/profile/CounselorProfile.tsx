import { CakeOutlined, CalendarMonth, Edit, EmailOutlined, LocalPhoneOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Paper, Rating } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { ContentLoading, Gender, NavLinkAdapter, WeeklySlots, openDialog } from '@shared/components';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useGetCounselorProfileQuery, useGetWeeklySlotsQuery } from '@/shared/pages';
/**
 * The contact view.
 */

function CounselorProfile() {
  const routeParams = useParams();
  const { data, isLoading } = useGetCounselorProfileQuery();
  //@ts-ignore
  const counselor = data?.content?.body?.content
  const navigate = useNavigate();
  const location = useLocation()
  const account = useAppSelector(selectAccount)
  const role = account?.role
  const dispatch = useAppDispatch();

  const { data: counselorCounselingSlotsData, isLoading: isLoadingCounselorCounselingSlotsData } = useGetWeeklySlotsQuery(account.profile.id)
  const counselorCounselingSlots = counselorCounselingSlotsData?.content
  const isAcademicCounselor = counselor?.major

  if (isLoading) {
    return <ContentLoading className='m-32 w-md' />
  }
  console.log(counselor)
  if (!counselor) {
    return <div className='relative p-48 w-md'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid counselor!
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
      <div className="relative flex flex-col items-center flex-auto p-24 pt-0 sm:p-48 sm:pt-0 bg-white">
        <div className="w-full max-w-3xl space-y-16">
          <div className="flex flex-col space-y-16">
            <div className="w-full">
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
                  src={counselor?.profile?.avatarLink}
                  alt={counselor?.profile?.fullName}
                >
                  {counselor?.profile.fullName?.charAt(0)}
                </Avatar>
                <Gender gender={counselor?.profile.gender} />
              </div>

              <Typography className="mt-12 text-4xl font-bold truncate">{counselor?.profile.fullName}</Typography>
              <Typography className="mt-4 text-xl">{counselor?.expertise?.name || counselor?.specialization?.name}</Typography>

              <div className='flex items-end gap-8 text-lg text-text-secondary mt-8'>
                <Rating
                  name="simple-controlled"
                  value={counselor?.rating}
                  readOnly
                  precision={0.5}
                />
                ({counselor?.rating}/5)
              </div>

              <Divider className="mt-16 mb-24" />

              <div className="flex flex-col space-y-16 pl-8">
                {counselor.email && (
                  <div className="flex items-center">
                    <EmailOutlined />
                    <div className="ml-24 leading-6">{counselor.email}</div>
                  </div>
                )}

                {counselor.profile.phoneNumber && (
                  <div className="flex items-center">
                    <LocalPhoneOutlined />
                    <div className="ml-24 leading-6">{counselor.profile.phoneNumber}</div>
                  </div>
                )}


                {counselor.profile.dateOfBirth && (
                  <div className="flex items-center">
                    <CakeOutlined />
                    <div className="ml-24 leading-6">{dayjs(counselor.profile.dateOfBirth).format('DD-MM-YYYY')}</div>
                  </div>
                )}


              </div>

              {
                isAcademicCounselor && <div>
                  <Divider className="mt-16 mb-24" />
                  <Typography className='font-semibold'>
                    Field of study
                  </Typography>
                  <Box className="p-8 mt-8">

                    <div className="grid grid-cols-3 gap-y-2 mb-4">
                      <div className="col-span-1 font-medium text-text-secondary">Academic Degree:</div>
                      <div className="col-span-2">{counselor?.academicDegree}</div>
                    </div>

                    {/* <div className="grid grid-cols-3 mb-4 gap-y-2">
                                        <div className="col-span-1 font-medium text-text-secondary">Specialization:</div>
                                        <div className="col-span-2">{counselor?.specialization?.name}</div>
                                    </div> */}

                    {/* Department Section */}
                    <div className="grid grid-cols-3 mb-4 gap-y-2">
                      <div className="col-span-1 font-medium text-text-secondary">Department:</div>
                      <div className="col-span-2">
                        <span>{counselor?.department.name}</span>
                        {counselor?.department.code && (
                          <span className="ml-2 text-text-disabled"> ({counselor?.department.code})</span>
                        )}
                      </div>
                    </div>

                    {/* Major Section */}
                    <div className="grid grid-cols-3 gap-y-2">
                      <div className="col-span-1 font-medium text-text-secondary">Major:</div>
                      <div className="col-span-2">
                        <span>{counselor?.major.name}</span>
                        {counselor?.major.code && (
                          <span className="ml-2 text-text-disabled"> ({counselor?.major.code})</span>
                        )}
                      </div>
                    </div>
                  </Box>
                </div>
              }
              {
                counselor?.expertise && <div>
                  <Divider className="mt-16 mb-24" />
                  <Typography className='font-semibold'>
                    Expertise
                  </Typography>
                  <Box className="mt-8 px-8">
                    <div >{counselor?.expertise?.name}</div>
                  </Box>
                </div>
              }

              <Divider className="mt-16 mb-24" />

              <div className="flex flex-col gap-16">
                <Typography className='font-semibold'>
                  Weekly Schedule
                </Typography>
                <WeeklySlots slots={counselorCounselingSlots} />
              </div>

              <Divider className="mt-16 mb-24" />

              <div className="flex flex-col gap-16">
                <Typography className='font-semibold'>
                  Specialized skills
                </Typography>

                <Box className="flex flex-wrap gap-8">
                  {
                    counselor.specializedSkills?.split(`\n`).map(item => <Chip
                      key={item}
                      label={item}
                      size="small"
                    />)
                  }
                </Box>
              </div>

              <Divider className="mt-16 mb-24" />

              <div className="flex flex-col gap-16">
                <Typography className='font-semibold'>
                  Other skills
                </Typography>

                <Box className="flex flex-wrap gap-8">
                  {
                    counselor.otherSkills?.split(`\n`).map(item => <Chip
                      key={item}
                      label={item}
                      size="small"
                    />)
                  }
                </Box>
              </div>

              <Divider className="mt-16 mb-24" />

              <div className="flex flex-col gap-16">
                <Typography className='font-semibold'>
                  Achievements
                </Typography>
                <Box className="flex flex-col gap-8">
                  {
                    counselor.achievements?.split(`\n`).map(item => (
                      <div>- {item}</div>
                    ))
                  }
                </Box>
              </div>

              <Divider className="mt-16 mb-24" />

              <div className="flex flex-col gap-16">
                <Typography className='font-semibold'>
                  Work history
                </Typography>
                <Box className="flex flex-col gap-8">
                  {
                    counselor.workHistory?.split(`\n`).map(item => (
                      <div>{item}</div>
                    ))
                  }
                </Box>
              </div>

              <Divider className="mt-16 mb-24" />

              <div className="flex flex-col gap-16">
                <Typography className='font-semibold'>
                  Qualifications
                </Typography>
                <Box className="flex flex-col gap-8">
                  {counselor.qualifications?.map((qualification) => (
                    <div key={qualification.id} className="flex items-start p-8 rounded shadow gap-16">
                      <img
                        onClick={() => {
                          dispatch(openDialog({
                            children: (
                              <img
                                className='min-h-sm min-w-sm'
                                src={qualification.imageUrl}
                                alt={qualification.institution}
                              />
                            )
                          }))
                        }}
                        src={qualification.imageUrl}
                        alt={qualification.institution}
                        className="size-72 object-cover border hover:opacity-90 cursor-pointer rounded"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold">{qualification.institution}</p>
                        <p className="">{qualification.degree} • {qualification.fieldOfStudy}</p>
                        <p className="text-text-secondary">Graduated: {qualification.yearOfGraduation}</p>
                      </div>
                    </div>
                  ))}
                </Box>
              </div>

              <Divider className="mt-16 mb-24" />

              <div className="flex flex-col gap-16">
                <Typography className='font-semibold'>
                  Certifications
                </Typography>
                <Box className="flex flex-col gap-8">
                  {counselor.certifications?.map((certification) => (
                    <div key={certification.id} className="flex items-start p-8 rounded shadow gap-16">
                      <img
                        src={certification.imageUrl}
                        alt={certification.organization}
                        onClick={() => {
                          dispatch(openDialog({
                            children: (
                              <img
                                className='min-h-sm min-w-sm'
                                src={certification.imageUrl}
                                alt={certification.organization}
                              />
                            )
                          }))
                        }}
                        className="size-72 object-cover border hover:opacity-90 cursor-pointer rounded"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold">{certification.name}</p>
                        <p className="">{certification.organization}</p>
                      </div>
                    </div>
                  ))}
                </Box>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div >
  );
}

export default CounselorProfile;
