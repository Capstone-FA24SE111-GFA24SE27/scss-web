import { Account } from '@/shared/types';
import { Autocomplete, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
	account: Account;
	allowEdit?: boolean;
};

const AccountInfoTab = (props: Props) => {
	const { account, allowEdit = true } = props;

	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return allowEdit ? (
		<div>
			<Controller
				name='fullName'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className='mt-8 mb-16'
						required
						label='Full name'
						autoFocus
						id='full name'
						variant='outlined'
						fullWidth
						error={!!errors.fullName}
						helperText={errors?.fullName?.message as string}
					/>
				)}
			/>

			<Controller
				name='email'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className='mt-8 mb-16'
						id='email'
						label='Email'
						type='email'
						variant='outlined'
						error={!!errors.email}
						helperText={errors?.email?.message as string}
						fullWidth
					/>
				)}
			/>

			<Controller
				control={control}
				name='phoneNumber'
				render={({ field }) => (
					<TextField
						{...field}
						className='mt-8 mb-16'
						label='Phone number'
						type='tel'
						fullWidth
						variant='outlined'
						error={!!errors.phoneNumber}
						helperText={errors.phoneNumber?.message as string}
					/>
				)}
			/>

			<Controller
				control={control}
				name='dateOfBirth'
				render={({ field }) => (
					<DatePicker
						className='w-full mt-8 mb-16'
						label='Date of birth'
						value={field.value ? dayjs(field.value) : null}
						minDate={dayjs('1900-01-01')}
						disableFuture
						format='YYYY-MM-DD'
						slotProps={{
							textField: {
								helperText: errors.dateOfBirth
									?.message as string,
							},
						}}
						views={['year', 'month', 'day']}
						onChange={(date) => {
							field.onChange(dayjs(date).format('YYYY-MM-DD'));
						}}
					/>
				)}
			/>

			<Controller
				control={control}
				name='gender'
				render={({ field }) => (
					<TextField
						{...field}
						select
						className='mt-8 mb-16'
						label='Gender'
						variant='outlined'
						fullWidth
						error={!!errors.gender}
						helperText={errors.gender?.message as string}
					>
						<MenuItem key={'Male'} value={'MALE'}>
							{'Male'}
						</MenuItem>

						<MenuItem key={'Female'} value={'FEMALE'}>
							{'Female'}
						</MenuItem>
					</TextField>
				)}
			/>
		</div>
	) : (
		<div>no edit</div>
	);
};

export default AccountInfoTab;
