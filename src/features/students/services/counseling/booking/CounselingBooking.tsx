import Button from '@mui/material/Button';
import { NavLinkAdapter } from '@shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/system/Box';
import { format } from 'date-fns/format';
import _ from 'lodash';
import { CakeOutlined, EmailOutlined, LocalPhoneOutlined, NotesOutlined } from '@mui/icons-material';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Rating, TextField } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

/**
 * The contact view.
 */
function CounselingBooking() {
    const counselor = {
        "id": 4,
        "email": "counselor@example.com",
        "avatarLink": "https://arknights.wiki.gg/images/0/02/Ho%27olheyak_icon.png",
        "rating": 4.6,
        "fullName": "Counselor",
        "phoneNumber": "1234567890",
        "dateOfBirth": 315532800000
    }

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(new Date()));

    return (
        <>
            <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
                <div className="w-full max-w-3xl">
                    <div className="flex flex-auto items-end gap-32">
                        <Avatar
                            sx={{
                                borderWidth: 4,
                                borderStyle: 'solid',
                                borderColor: 'background.paper',
                                backgroundColor: 'background.default',
                                color: 'text.secondary'
                            }}
                            className="w-128 h-128 text-64 font-bold"
                            src={counselor.avatarLink}
                            alt={counselor.fullName}
                        >
                            {counselor?.fullName?.charAt(0)}
                        </Avatar>
                        <div >
                            <Typography className="mt-32 text-4xl font-bold truncate">{counselor.fullName}</Typography>
                            <div className='flex items-end gap-8 text-lg text-gray-500'>
                                <Rating
                                    name="simple-controlled"
                                    value={4.6}
                                    readOnly
                                    precision={0.5}
                                />
                                <div>(116)</div>
                            </div>

                            <div className="flex flex-wrap items-center mt-16">
                                <Chip
                                    label={'Technology'}
                                    className="mr-12 mb-12"
                                    size="small"
                                />
                                <Chip
                                    label={'Academic'}
                                    className="mr-12 mb-12"
                                    size="small"
                                />
                            </div>
                        </div>
                    </div>



                    <Divider className="mt-16 mb-24" />

                    <div>
                        <Typography className='font-semibold text-primary px-24 text-lg'>Counseling Date</Typography>

                        <DateCalendar
                            views={['day']}
                            className='w-full'
                            disablePast
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#e67e22'
                                },
                            }}
                            value={selectedDate} onChange={(newValue) => setSelectedDate(newValue)}
                        />
                    </div>

                    <Divider className="mt-16 mb-24" />

                    <div className='px-32'>
                        <Typography className='font-semibold text-primary text-lg' >Available slots</Typography>
                        <div className='flex flex-wrap gap-16 mt-8'>
                            <Button variant='outlined' color='primary' disabled >8:00 AM - 9:00 AM</Button>
                            <Button variant='outlined' color='primary' >8:00 AM - 9:00 AM</Button>
                            <Button variant='contained' color='primary' >8:00 AM - 9:00 AM</Button>
                            <Button variant='outlined' color='primary' >8:00 AM - 9:00 AM</Button>
                            <Button variant='outlined' color='primary'>8:00 AM - 9:00 AM</Button>
                        </div>
                    </div>

                    <Divider className="mt-16 mb-24" />

                    <div className='px-32'>
                        <Typography className='font-semibold text-primary text-lg'>Meeting Type</Typography>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <div className='flex gap-16'>
                                    <FormControlLabel value="female" control={<Radio />} label="Online" />
                                    <FormControlLabel value="male" control={<Radio />} label="Offline" />
                                </div>
                            </RadioGroup>
                        </FormControl>
                    </div>

                    <Divider className="mt-16 mb-24" />

                    <div className='px-32'>
                        <Typography className='font-semibold text-primary text-lg'>Reasons</Typography>
                        <TextField
                            label="Reasons for counseling"
                            multiline
                            rows={4}
                            defaultValue=""
                            className='mt-16 w-full'
                        />
                    </div>

                    <div className='flex justify-center mt-24 px-32'>
                        <Button variant='contained' color='secondary' className='w-full'>Confirm booking</Button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default CounselingBooking;
