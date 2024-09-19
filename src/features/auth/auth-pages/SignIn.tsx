import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { SignInForm } from '../auth-components';
import { CalendarMonth, SentimentSatisfied, Summarize, SupportAgent } from '@mui/icons-material';

function SignInPage() {

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-[10rem]"
						src="assets/images/logo/FPT-education.png"
						alt="logo"
					/>
					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>

					<div className="w-full">
						<div className="mt-32 flex flex-col items-center gap-8">
							<Button
								variant="outlined"
								color='primary'
								className="w-full flex items-center text-base font-semibold gap-16"
							>
								<img
									className="w-24"
									src="assets/icons/google-icon.svg"
									alt="logo"
								/>
								Sign in with Google
							</Button>
							<Button
								variant="outlined"
								color='primary'
								className="w-full flex items-center text-base font-semibold gap-8"
							>
								<img
									className="w-72"
									src="assets/images/logo/FPT-education.png"
									alt="logo"
								/>
								Sign in FeID
							</Button>
						</div>

						<div className="mt-32 flex items-center">
							<div className="mt-px flex-auto border-t" />
							<Typography
								className="mx-8"
								color="text.secondary"
							>
								Or continue with
							</Typography>
							<div className="mt-px flex-auto border-t" />
						</div>

						<SignInForm />
					</div>
				</CardContent>
			</Paper>

			<Box
				className="relative hidden h-full flex-1 items-center justify-center overflow-hidden p-64 md:flex lg:px-96"
				// sx={{backgroundImage: "url(/assets/images/fptu-cover.png)", backgroundSize: 'cover', opacity: 0.7}}
				sx={{ backgroundColor: 'primary.main' }}
			>
				<svg
					className="pointer-events-none absolute inset-0"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						sx={{ color: 'primary.light' }}
						className="opacity-20"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="234"
							cx="196"
							cy="23"
						/>
						<circle
							r="234"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>
				<Box
					component="svg"
					className="absolute -right-64 -top-64 opacity-20"
					sx={{ color: 'secondary.dark' }}
					viewBox="0 0 220 192"
					width="220px"
					height="192px"
					fill="none"
				>
					<defs>
						<pattern
							id="837c3e70-6c3a-44e6-8854-cc48c737b659"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect
								x="0"
								y="0"
								width="4"
								height="4"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width="220"
						height="192"
						fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
					/>
				</Box>

				<div className="relative z-10 w-full max-w-2xl">
					<div className="text-7xl font-bold leading-none text-gray-100">
						<div>Student Counseling and Support System</div>
					</div>
					<div className="mt-24 text-lg leading-6 tracking-tight text-gray-300">
						The Student Counseling and Support System (SCSS) is designed to offer comprehensive support services to students at FPT University HCM Campus, including academic counseling service and easy to access event.
					</div>
					<div className='flex justify-between mt-32'>
						<SupportAgent className='size-96 rounded-full p-8 text-primary-light'/>
						<CalendarMonth className='size-96 rounded-full p-8 text-primary-light'/>
						<Summarize className='size-96 rounded-full p-8 text-primary-light'/>
						<SentimentSatisfied className='size-96 rounded-full p-8 text-primary-light'/>
					</div>
				</div>
			</Box>
		</div>
	);
}

export default SignInPage;
