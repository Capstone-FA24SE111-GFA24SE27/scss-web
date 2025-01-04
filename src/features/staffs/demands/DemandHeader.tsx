import { Heading, NavLinkAdapter } from '@/shared/components';
import { Button } from '@mui/material';
import React from 'react';
import CreateDemandButton from '../students/CreateDemandButton';

type Props = {};

const DemandHeader = (props: Props) => {
	return (
		<div className='flex items-center justify-between p-32 border-b bg-background-paper'>
			<Heading title='Demand List' description='Manage your demands' />
			<CreateDemandButton color={'primary'} />
		</div>
	);
};

export default DemandHeader;
