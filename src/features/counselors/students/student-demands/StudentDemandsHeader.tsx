import { Heading } from '@shared/components';

/**
 * The contacts header.
 */
function DemandHeader() {
  return (
    <div className='px-32 py-24 flex justify-between bg-background-paper'>
      <Heading
        title='Counseling Demands'
        description='List counseling demands assigned to the counselor'
      />
    </div>
  );
}

export default DemandHeader;
