import { Heading } from '@shared/components';

/**
 * The contacts header.
 */
function DemandHeader() {
  return (
    <div className='p-32 flex justify-between bg-background-paper'>
      <Heading
        title='Counseling Demands'
        description='List counseling demands assigned to the counselor'
      />
    </div>
  );
}

export default DemandHeader;
