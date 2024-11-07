import { AppLayout } from '@shared/layouts';
import { useState } from 'react';
import Counselors from './Counselors';
const CounselorsLayout = () => {
  return (
    <AppLayout>
      <Counselors />
    </AppLayout>
  );
}

export default CounselorsLayout