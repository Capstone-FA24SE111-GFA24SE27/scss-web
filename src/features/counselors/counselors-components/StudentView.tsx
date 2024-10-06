import Button from '@mui/material/Button';
import { ContentLoading, NavLinkAdapter } from '@shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/system/Box';
import _ from 'lodash';
import { CakeOutlined, EmailOutlined, LocalPhoneOutlined, NotesOutlined } from '@mui/icons-material';
import { Rating } from '@mui/material';
import { useGetCounselorQuery } from '@features/students/services/counseling/counseling-api';
import dayjs from 'dayjs';
/**
 * The contact view.
 */

interface StudentViewProps {
}
function StudentView({}: StudentViewProps) {
  const routeParams = useParams();
  const { id: counselorId } = routeParams as { id: string };
  const { data, isLoading } = useGetCounselorQuery(counselorId);
  const counselor = data?.content

  if (isLoading) {
    return <ContentLoading className='m-32 w-md' />
  }

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
    <div className='w-md'>
      
    </div>
  );
}

export default StudentView;
