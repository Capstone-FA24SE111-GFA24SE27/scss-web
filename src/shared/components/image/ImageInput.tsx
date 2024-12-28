import { useAlertDialog } from '@/shared/hooks';
import {
	isValidImage,
	MAX_FILE_SIZE,
	validImageTypes,
} from '@/shared/services';
import { useAppDispatch } from '@shared/store';
import React, {
	ChangeEvent,
	DragEvent,
	useEffect,
	useRef,
	useState,
} from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import clsx from 'clsx';
import ImageIcon from '@mui/icons-material/Image';
import { IconButton, Tooltip } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { fetchImageAsFile } from '@/shared/utils';

type Props = {
	onFileChange: (file: File) => void;
	file?: File;
	url?: string;
	error?: boolean;
};

const ImageInput = (props: Props) => {
	const { onFileChange, file: initialFile, error = false, url } = props;

	const [file, setFile] = useState(initialFile);
	const [dragActive, setDragActive] = useState(false);
	const dispatch = useAppDispatch();

	const fileInputRef = useRef(null);

	useEffect(() => {
		if (url && url.trim() !== '') {
			fetchImageAsFile(url, `downloaded-image-${url}`)
				.then((file) => {
					if (file) {
						handleFileChange(file);
					}
				})
				.catch((err) => console.log(err));
		}
	}, []);

	const handleFileChange = (file: File) => {
		if (onFileChange) {
			setFile(file);
			onFileChange(file);
		}
	};

	const handleDrag = (e: DragEvent<HTMLDivElement>) => {
		console.log(e.type);
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			if (!file) {
				const files = Array.from(e.dataTransfer.files);

				// files.forEach((file) => {
				if (!isValidImage(files[0])) {
					useAlertDialog({
						title: 'You cannot send anything other than an image',
						dispatch,
						color: 'warning',
					});
					return;
				}
				if (files[0].size > MAX_FILE_SIZE) {
					useAlertDialog({
						title: 'You cannot send an iamge that is larger than 5MB',
						dispatch,
						color: 'warning',
					});
				} else {
					handleFileChange(files[0]);
				}
				// });
			} else {
				useAlertDialog({
					title: 'You cannot send more than 1 file',
					dispatch,
					color: 'warning',
				});
			}
		} else {
			handleFileChange(null);
		}
	};

	const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const files = Array.from(event.target.files);
			if (!isValidImage(files[0])) {
				useAlertDialog({
					title: 'You cannot send anything other than an image',
					dispatch,
					color: 'warning',
				});
				return;
			} else {
				handleFileChange(files[0]);
			}
			// files.forEach((file) => {
			//     if (!isValidImage(file)) {
			//         useAlertDialog({
			//             title: 'You cannot send anything other than an image',
			//             dispatch,
			//             color: 'warning'
			//        } )
			//         return
			//     } else {
			//         handleFileChange(file)
			//     }
			// })
			event.target.value = '';
		}
	};

	const removeFile = () => {
		handleFileChange(null);
	};

	return (
		<div className='w-full h-full '>
			<div
				onDragEnter={handleDrag}
				onDragOver={handleDrag}
				onDragLeave={handleDrag}
				onDrop={handleDrop}
				className={clsx(
					'relative w-full p-2 h-full transition-colors',
					dragActive ? 'bg-[#d7c9c3]' : ''
				)}
			>
				<div className='flex w-full h-full border-2 border-dashed border-secondary-dark text-primary-light'>
					{!file && !url ? (
						<div
							className={clsx(
								'flex flex-col items-center justify-center w-full h-full px-4',
								error && 'bg-red-300/20 '
							)}
						>
							<UploadIcon className='w-32 h-32 mb-2' />
							<p className='text-sm'>Drag your image here.</p>
							<p className='text-sm'>
								Or click on this area to select an image.
							</p>
						</div>
					) : (
						<Tooltip title={file?.name}>
							<div
								className={clsx(
									'relative flex flex-col items-center justify-center w-full h-full px-2 overflow-hidden ',
									error && 'bg-red-300/20 '
								)}
							>
								<img
									src={file ? URL.createObjectURL(file) : url}
									className='object-contain w-2/3 h-2/3'
								/>
								<span className='w-full text-ellipsis'>
									{file?.name}
								</span>
								<IconButton
									onClick={removeFile}
									type='button'
									className='absolute z-10 right-1 top-1'
								>
									<Clear />
								</IconButton>
							</div>
						</Tooltip>
					)}
				</div>
				<input
					ref={fileInputRef}
					type='file'
					accept={validImageTypes.map((type) => type).join(', ')}
					multiple={false}
					onChange={handleFileInput}
					name='file'
					className='absolute inset-0 z-0 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer'
				/>
			</div>
		</div>
	);
};

export default ImageInput;
