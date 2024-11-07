import { PageSimple } from '@/shared/components';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import DemandList from './DemandList';
import DemandSidebarContent from './DemandSidebarContent';
import DemandHeader from './DemandHeader';

type Props = {}

const Demand = (props: Props) => {
    const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const navigate = useNavigate()

	

	useEffect(() => {
		if (routeParams.id || routeParams.date) {
			setRightSidebarOpen(true);
		} else {
			setRightSidebarOpen(false)
		}
	}, [routeParams]);

	const handleCloseRightSideBar = () => {
		navigate('')
	}

	const isMobile = false;

	return (
		<PageSimple
			rightSidebarContent={<DemandSidebarContent />}
			header={<DemandHeader />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={handleCloseRightSideBar}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
			ref={pageLayout}
			rightSidebarWidth={640}
			content={<DemandList />}
		/>
	);
}

export default Demand