// import FuseMessage from '@fuse/core/FuseMessage';
// import Configurator from 'app/theme-layouts/shared-components/configurator/Configurator';
import { memo, ReactNode, Suspense } from 'react';
import { NavbarLayout } from './layout-components/navbar';
// import RightSideLayout1 from './components/RightSideLayout1';
import { ToolbarLayout } from './layout-components/toolbar';
import { FooterLayout } from './layout-components/footer';



type AppLayoutProps = {
	children?: ReactNode;
	config?: Config
};


type NavbarConfig = {
	display: boolean;
	position: 'left' | 'right';
};

// Define the type for Toolbar configuration
type ToolbarConfig = {
	display: boolean;
	style: 'fixed' | 'absolute' | 'static';
};

// Define the type for Footer configuration
type FooterConfig = {
	display: boolean;
	style: 'fixed' | 'absolute' | 'static';
};

type SidePanelConfig = {
	display: boolean;
	position: 'left' | 'right';
};

// Define the main configuration type
export type Config = {
	navbar: NavbarConfig;
	toolbar: ToolbarConfig;
	footer: FooterConfig;
	leftSidePanel: SidePanelConfig;
	rightSidePanel: SidePanelConfig;
};

const defaultConfig: Config = {
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
/**
 * The layout 1.
 */
export function AppLayout(props: AppLayoutProps) {
	const { children, config = defaultConfig } = props;
	// const config = useAppSelector(selectFuseCurrentLayoutConfig) as AppLayoutConfigDefaultsType;
	// const appContext = useContext(AppContext);

	return (
		<div className="flex w-full">
			<div className="flex min-w-0 flex-auto">
				{config.navbar.display && config.navbar.position === 'left' && <NavbarLayout />}
				<main
					className="relative z-10 flex min-h-full min-w-0 flex-auto flex-col"
				>
					{config.toolbar.display && (
						<ToolbarLayout className={config.toolbar.style === 'fixed' ? 'sticky top-0' : ''} />
					)}

					{/* <div className="sticky top-0 z-99">
						<Configurator />
					</div> */}

					<div className="relative z-10 flex min-h-0 flex-auto flex-col">
						{/* <FuseSuspense>{useRoutes(routes)}</FuseSuspense> */}

						{/* <Suspense>
							<FuseDialog />
						</Suspense> */}
						<Suspense fallback={<div>Dad is buying milk...</div>}>
							{children}
						</Suspense>
					</div>

					{config.footer.display && (
						<FooterLayout className={config.footer.style === 'fixed' ? 'sticky bottom-0' : ''} />
					)}
				</main>

				{config.navbar.display && config.navbar.position === 'right' && <NavbarLayout />}
			</div>

			{/* {config.rightSidePanel.display && <RightSideAppLayout />} */}
		</div>
	);
}

