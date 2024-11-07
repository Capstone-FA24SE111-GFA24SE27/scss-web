import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
	counselorId: z.string().min(1, 'Counselor ID is required'),
	contactNote: z.string().min(1, 'Please enter contact note'),
	summarizeNote: z.string().min(2, 'Please enter summarize note'),
    role: z.string()
});

type FormType = Required<z.infer<typeof schema>>;

const CreateProblemTagForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const defaultValues = {
		counselorId: '',
		summarizeNote: '',
		contactNote: '',
	};

	const { control, formState, watch, handleSubmit, setValue } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	return <div>CreateProblemTagForm</div>;
};

export default CreateProblemTagForm;
