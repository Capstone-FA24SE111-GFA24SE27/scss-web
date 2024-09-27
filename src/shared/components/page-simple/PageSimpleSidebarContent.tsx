import { ReactNode } from 'react';
import { Scrollbar } from '@shared/components';

/**
 * Props for the FusePageSimpleSidebarContent component.
 */
type PageSimple = {
	innerScroll?: boolean;
	children?: ReactNode;
};

/**
 * The FusePageSimpleSidebarContent component is a content container for the FusePageSimpleSidebar component.
 */
function FusePageSimpleSidebarContent(props: PageSimple) {
	const { innerScroll, children } = props;

	if (!children) {
		return null;
	}

	return (
		<Scrollbar>
			<div className="FusePageSimple-sidebarContent">{children}</div>
		</Scrollbar>
	);
}

export default FusePageSimpleSidebarContent;
