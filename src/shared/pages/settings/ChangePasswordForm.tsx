import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Typography } from '@mui/material';
import { getApiErrorMessage, useAppDispatch } from '@shared/store';
import { closeDialog, openDialog } from '@/shared/components';
import { useChangePasswordMutation } from './settings-api';

// Define the Zod schema for validation
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).superRefine((data, ctx) => {
  if (data.currentPassword === data.newPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["newPassword"],
      message: "New password must be different from the current password",
    });
  }

  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords don't match",
    });
  }
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const dispatch = useAppDispatch()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleClickShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [changePassword, { isLoading, error }] = useChangePasswordMutation()


  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
      .unwrap()
      .then(() => {
        dispatch(closeDialog())
      })
  };

  return (
    <div className='p-16 space-y-16'>
      <Typography className='text-2xl font-bold'>Update Password</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        <Controller
          name="currentPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-4"
              label="Current Password"
              type={showPassword.currentPassword ? "text" : "password"}
              error={!!errors.currentPassword}
              helperText={errors?.currentPassword?.message}
              variant="outlined"
              required
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("currentPassword")}
                        edge="end"
                      >
                        {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-4"
              label="New Password"
              type={showPassword.newPassword ? "text" : "password"}
              error={!!errors.newPassword}
              helperText={errors?.newPassword?.message}
              variant="outlined"
              required
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("newPassword")}
                        edge="end"
                      >
                        {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-4"
              label="Confirm New Password"
              type={showPassword.confirmPassword ? "text" : "password"}
              error={!!errors.confirmPassword}
              helperText={errors?.confirmPassword?.message}
              variant="outlined"
              required
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("confirmPassword")}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
          )}
        />
        <Typography color='error'>{getApiErrorMessage(error)}</Typography>
        <div className="flex justify-end gap-16">
          <Button variant="outlined" color="primary"
            onClick={() => {
              dispatch(closeDialog())
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary" className='w-112' disabled={isLoading}>
            Save
          </Button>
        </div>
      </form>
    </div>

  );
};

export default ChangePasswordForm;
