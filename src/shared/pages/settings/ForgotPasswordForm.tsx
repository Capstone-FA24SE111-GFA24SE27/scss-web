import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForgotPasswordMutation } from './settings-api';
import { getApiErrorMessage, selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { Typography } from '@mui/material';
import { closeDialog } from '@/shared/components';

// Define the Zod schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
});

type ForgotPasswordFormData = Required<z.infer<typeof forgotPasswordSchema>>

const ForgotPasswordForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const dispatch = useAppDispatch()

  const account = useAppSelector(selectAccount)

  useEffect(() => {
    if (account?.email) {
      reset({
        email: account?.email || '',
      })
    }
  }, [account]);

  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data).unwrap().then(() => {
      dispatch(closeDialog())
    })
  };

  return (
    <div className='p-16 space-y-16 w-sm'>
      <Typography className='font-bold text-2xl'>Reset Password</Typography>
      <Typography color='textSecondary' className=''>We will send reset link to the email below.</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-4"
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors?.email?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

        <div className="flex justify-end gap-16">
          <Button variant="outlined" color="primary"
            onClick={() => {
              dispatch(closeDialog())
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-112"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
        {isError && <Typography color='error'>{getApiErrorMessage(error)}</Typography>}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
