import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';
import { Skeleton, Typography } from '@mui/material';

type Props = {
	src: string;
	alt: string;
	className?: string;
};

const ImageLoading = (props: Props) => {
	const { src, alt, className } = props;

	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	return (
		<>
			{/* Display loading or error state */}
			{isLoading && !hasError && (
				<Skeleton variant="rectangular" width={210} height={118} />
			)}
			{hasError && <Typography color='error'>Error loading image</Typography>}

			{/* Display the image */}
			<img
				src={src}
				alt={alt}
				onLoad={() => setIsLoading(false)}
				onError={(err) => {
					setIsLoading(false);
					setHasError(true);
				}}
				className={clsx(
					isLoading || hasError ? 'hidden' : 'block',
					className
				)}
			/>
		</>
	);
};

export default ImageLoading;
