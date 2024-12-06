import { Account } from '@/shared/types';
import { Autocomplete, TextField } from '@mui/material';
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

    console.log(methods)

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
						fullWidth
					/>
				)}
			/>
		</div>
	) : (
		<div>no edit</div>
	);
};

export default AccountInfoTab;
