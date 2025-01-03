import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

const AcademicDataLayout = lazy(() => import('./AcademicDataLayout'));
const CreateUpdateDepartmentForm = lazy(
	() => import('./departments/CreateUpdateDepartmentForm')
);
const CreateUpdateMajorForm = lazy(
	() => import('./majors/CreateUpdateMajorForm')
);
const CreateUpdateSpecializationForm = lazy(
	() => import('./specializations/CreateUpdateSpecializationForm')
);
export const adminAcademicRoutes: RouteObject[] = [
	{
		path: 'academic',
		element: <AcademicDataLayout />,
		children: [],
	},
	// {
	// 	path: 'academic/department/form/:id?',
	// 	element: <CreateUpdateDepartmentForm />,
	// },
	// {
	// 	path: 'academic/major/form/:id?',
	// 	element: <CreateUpdateMajorForm />,
	// },
	// {
	// 	path: 'academic/specialization/form/:id?',
	// 	element: <CreateUpdateSpecializationForm />,
	// },
];
