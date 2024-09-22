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
import { Rating } from '@mui/material';
/**
 * The contact view.
 */
function CounselorView() {
    // const { data: countries } = useGetContactsCountriesQuery();
    // const { data: tags } = useGetContactsTagsQuery();
    // const routeParams = useParams();
    // const { id: contactId } = routeParams as { id: string };
    // const {
    //     data: contact,
    //     isLoading,
    //     isError
    // } = useGetContactsItemQuery(contactId, {
    //     skip: !contactId
    // });
    // const dispatch = useAppDispatch();
    // const navigate = useNavigate();

    // function getCountryByIso(iso: string) {
    //     return countries?.find((country) => country.iso === iso);
    // }

    // if (isLoading) {
    //     return <FuseLoading className="min-h-screen" />;
    // }

    // if (isError) {
    //     setTimeout(() => {
    //         navigate('/apps/contacts');
    //         dispatch(showMessage({ message: 'NOT FOUND' }));
    //     }, 0);

    //     return null;
    // }

    // if (!contact) {
    //     return null;
    // }
    const counselor = {
        "id": 4,
        "email": "counselor@example.com",
        "avatarLink": "https://arknights.wiki.gg/images/0/02/Ho%27olheyak_icon.png",
        "rating": 4.6,
        "fullName": "Counselor",
        "phoneNumber": "1234567890",
        "dateOfBirth": 315532800000
    }

    return (
        <>
            <Box
                className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
                sx={{
                    backgroundColor: 'background.default'
                }}
            >
                <img
                    className="absolute inset-0 object-cover w-full h-full"
                    src={'/assets/images/fptu-cover.png'}
                    alt="user background"
                />
            </Box>
            <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
                <div className="w-full max-w-3xl">
                    <div className="flex flex-auto items-end -mt-64">
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
                        <div className="flex items-center ml-auto mb-4 text-white">
                            <Button
                                variant="contained"
                                color="secondary"
                                component={NavLinkAdapter}
                                to="booking"
                            >
                                <span className="mx-8">Book Appointment</span>
                            </Button>
                        </div>
                    </div>

                    <Typography className="mt-12 text-4xl font-bold truncate">{counselor.fullName}</Typography>

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
                        {/* {contact?.tags?.map((id) => (
                            <Chip
                                key={id}
                                label={_.find(tags, { id })?.title}
                                className="mr-12 mb-12"
                                size="small"
                            />
                        ))} */}
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

                    <Divider className="mt-16 mb-24" />

                    <div className="flex flex-col space-y-32">
                        {counselor.email && (
                            <div className="flex items-center">
                                <EmailOutlined />
                                <div className="ml-24 leading-6">{counselor.email}</div>
                            </div>
                        )}

                        {counselor.phoneNumber && (
                            <div className="flex items-center">
                                <LocalPhoneOutlined />
                                <div className="ml-24 leading-6">{counselor.phoneNumber}</div>
                            </div>
                        )}


                        {counselor.dateOfBirth && (
                            <div className="flex items-center">
                                <CakeOutlined />
                                <div className="ml-24 leading-6">{counselor.dateOfBirth}</div>
                            </div>
                        )}

                        {counselor.dateOfBirth && (
                            <div className="flex items-center">
                                <NotesOutlined />
                                <div className="ml-24 leading-6">
                                    Adipisicing exercitation dolor nisi ipsum nostrud anim dolore sint veniam consequat lorem sit ex commodo nostrud occaecat elit magna magna commodo incididunt laborum ad irure pariatur et sit ullamco adipisicing.

                                    Ullamco in dolore amet est quis consectetur fugiat non nisi incididunt id laborum adipisicing dolor proident velit ut quis aliquip dolore id anim sit adipisicing nisi incididunt enim amet pariatur.
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default CounselorView;
