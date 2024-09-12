// import FuseMessage from '@fuse/core/FuseMessage';
// import Configurator from 'app/theme-layouts/shared-components/configurator/Configurator';
import { memo, ReactNode } from 'react';
import FooterLayout1 from './components/FooterLayout1';
import NavbarWrapperLayout1 from './components/NavbarWrapperLayout1';
import RightSideLayout1 from './components/RightSideLayout1';
// import ToolbarLayout1 from './components/ToolbarLayout1';



type Layout1Props = {
	children?: ReactNode;
};

/**
 * The layout 1.
 */
export function Layout1(props: Layout1Props) {
	const { children } = props;
	// const config = useAppSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType;
	// const appContext = useContext(AppContext);
  let config = {
    navbar: {
      display: true,
      position: 'left',
    },
    toolbar: {
      display: true,
      style: 'fixed',
    },
    footer: {
      display: true,
      style: 'fixed',
    },
    leftSidePanel: {
      display: true,
      position: 'right',
    },
    rightSidePanel: {
      display: true,
      position: 'left',
    },
  }
	return (
		<div className="flex w-full">
			{/* {config.leftSidePanel.display && <LeftSideLayout1 />} */}

			<div className="flex min-w-0 flex-auto">
				{/* {config?.navbar.display && config.navbar.position === 'left' && <NavbarWrapperLayout1 />} */}

				<main
					id="fuse-main"
					className="relative z-10 flex min-h-full min-w-0 flex-auto flex-col"
				>
					{/* {config.toolbar.display && (
						<ToolbarLayout1 className={config.toolbar.style === 'fixed' ? 'sticky top-0' : ''} />
					)} */}

					{/* <div className="sticky top-0 z-99">
						<Configurator />
					</div> */}

					<div className="relative z-10 flex min-h-0 flex-auto flex-col">
						{/* <FuseSuspense>{useRoutes(routes)}</FuseSuspense> */}

						{/* <Suspense>
							<FuseDialog />
						</Suspense> */}
						{children}
					</div>

					{/* {config.footer.display && (
						<FooterLayout1 className={config.footer.style === 'fixed' ? 'sticky bottom-0' : ''} />
					)} */}
				</main>

				{/* {config.navbar.display && config.navbar.position === 'right' && <NavbarWrapperLayout1 />} */}
			</div>

			{/* {config.rightSidePanel.display && <RightSideLayout1 />} */}
			{/* <FuseMessage /> */}
		</div>
	);
}

