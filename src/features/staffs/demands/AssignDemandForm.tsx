import React, { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useGetCounselorByIdQuery, usePutAssignDemandByDemandIdMutation } from './demand-api';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { NavLinkAdapter, UserLabel } from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ArrowBack } from '@mui/icons-material';
import { debounce } from 'lodash';


const schema = z.object({
    counselorId: z.string().min(1, "Counselor ID is required"),
    contactNote: z.string().min(1, "Please enter contact note"),
    // summarizeNote: z.string().min(2, "Please enter summarize note"),
  });

type FormType = Required<z.infer<typeof schema>>;


const AssignDemandForm = () => {

    const {id: demandId} = useParams()
    const navigate = useNavigate()

    const [showCounselorsList, setShowCounselorsList] = useState(false)

    const defaultValues = {
        counselorId: "",
        // summarizeNote: "",
        contactNote: ""
      }

    const { control, formState, watch, handleSubmit, setValue } = useForm<FormType>({
        // @ts-ignore
        defaultValues,
        resolver: zodResolver(schema)
      });
    const formData = watch();
    
    const { isValid, dirtyFields, errors } = formState;

    const [assignDemand] = usePutAssignDemandByDemandIdMutation()

    const [debouncedCounselorId, setDebouncedCounselorId] = useState('')

    const { data: counselorData, isFetching: isGettingCounselor,  isError: isErrorGetCounselorById } = useGetCounselorByIdQuery(debouncedCounselorId, {
        skip: !formData.counselorId || formData.counselorId.length < 1
      })

      const counselor = counselorData?.content

    

    const onSubmit = () => {
        assignDemand({
          counselingDemandId: demandId,
          body: {
            ...formData
          }
        })
          .unwrap()
          .then(() => navigate(-1))
      }

      const toggleShowCounselorsList = () => {
        setShowCounselorsList(prev => !prev)
      }

    

    const handleDebouncedCounselorId = useCallback(
        debounce((value) => {
          setDebouncedCounselorId(value);
        }, 1000),
        []
      );

  return (
    <div className="container flex items-center p-32">
      { showCounselorsList ? (
          <div onClick={toggleShowCounselorsList}>
          asdawdasdwdasdawdad
          </div>
      ) :

      <div className="flex flex-col w-full max-w-4xl">
       
        <div className="mt-32 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Assign a Counselor to a Demand
        </div>
        <div onClick={toggleShowCounselorsList}>
          asdawdasdwdasdawdad
          </div>
        <Paper className="container flex flex-col flex-auto gap-32 p-32 mt-32">
          <div className="">
            <Typography className="text-2xl font-bold tracking-tight">Submit your appointment</Typography>
            <Typography color="text.secondary">
              The appointment will be automatically added to your schedule
            </Typography>
          </div>
          <div className="flex flex-col w-full gap-16">
            <div className='flex flex-col items-center gap-16'>
              <Controller
                control={control}
                name="counselorId"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Counselor ID"
                    placeholder="Counselor ID"
                    id="counselorId"
                    error={!!errors.counselorId}
                    helperText={errors?.counselorId?.message}
                    fullWidth
                    onChange={(event) => {
                      field.onChange(event);
                      handleDebouncedCounselorId(event.target.value);
                    }}
                  />
                )}
              />
              <div className='w-full'>
                {
                  isGettingCounselor
                    ? <Typography>Loading...</Typography>
                    : counselor && formData.counselorId && !isErrorGetCounselorById
                      ? <UserLabel
                        label='Found counselor:  '
                        avatarLink={counselor?.profile.avatarLink}
                        fullName={counselor?.profile.fullName}
                      />
                      : <Typography color='textSecondary' className='text-sm'>Counselor not found</Typography>
                }

              </div>
            </div>


            {/* <div className=''>
              <Controller
                name="summarizeNote"
                control={control}
                render={({ field }) => (
                    <Controller
                    control={control}
                    name="summarizeNote"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Summarize Note"
                        placeholder="Summarize note..."
                        multiline
                        rows={5}
                        id="Reason"
                        error={!!errors.summarizeNote}
                        helperText={errors?.summarizeNote?.message}
                        fullWidth
    
                      />
                    )}
                  />
                )}
              />
             
            </div> */}

            <div className=''>
              <Controller
                control={control}
                name="contactNote"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Note"
                    placeholder="Contact Note..."
                    multiline
                    rows={5}
                    id="Reason"
                    error={!!errors.contactNote}
                    helperText={errors?.contactNote?.message}
                    fullWidth

                  />
                )}
              />
            </div>

            <div className="flex items-center justify-end mt-32">
              <Button className="mx-8" component={NavLinkAdapter} to="." >Cancel</Button>
              <Button
                variant='contained'
                color='secondary'
                disabled={isGettingCounselor  || !counselor}
                onClick={handleSubmit(onSubmit)}>
                Confirm
              </Button>
            </div>
          </div>
        </Paper>
      </div >
      }

    </div >
  )
}

export default AssignDemandForm