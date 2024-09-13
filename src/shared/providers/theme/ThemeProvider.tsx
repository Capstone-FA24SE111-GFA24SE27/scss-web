import { alpha, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { memo, ReactNode, useEffect, useLayoutEffect } from 'react';
import { Theme, ThemeOptions } from '@mui/material/styles/createTheme';
import GlobalStyles from '@mui/material/GlobalStyles';
import { createTheme, getContrastRatio } from '@mui/material/styles';
import { useAppSelector } from '@shared/store/hooks';
import { defaultThemeOptions, mustHaveThemeOptions } from './themeOptions';
import _ from 'lodash'

// const useEnhancedEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type ThemeProviderProps = {
	children: ReactNode;
	root?: boolean;
};

const inputGlobalStyles = (
	<GlobalStyles
		styles={(theme) => ({
			html: {
				backgroundColor: `${theme.palette.background.default}!important`,
				color: `${theme.palette.text.primary}!important`
			},
			body: {
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary
			},

			'table.simple tbody tr th': {
				borderColor: theme.palette.divider
			},
			'table.simple thead tr th': {
				borderColor: theme.palette.divider
			},
			'a:not([role=button]):not(.MuiButtonBase-root)': {
				color: theme.palette.secondary.main,
				textDecoration: 'underline',
				'&:hover': {}
			},
			'a.link, a:not([role=button])[target=_blank]': {
				background: alpha(theme.palette.secondary.main, 0.2),
				color: 'inherit',
				borderBottom: `1px solid ${theme.palette.divider}`,
				textDecoration: 'none',
				'&:hover': {
					background: alpha(theme.palette.secondary.main, 0.3),
					textDecoration: 'none'
				}
			},
			'[class^="border"]': {
				borderColor: theme.palette.divider
			},
			'[class*="border"]': {
				borderColor: theme.palette.divider
			},
			'[class*="divide-"] > :not([hidden]) ~ :not([hidden])': {
				borderColor: theme.palette.divider
			},
			hr: {
				borderColor: theme.palette.divider
			},

			'::-webkit-scrollbar-thumb': {
				boxShadow: `inset 0 0 0 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
					}`
			},
			'::-webkit-scrollbar-thumb:active': {
				boxShadow: `inset 0 0 0 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
					}`
			}
		})}
	/>
);

export function ThemeProvider(props: ThemeProviderProps) {
	const { children, root = false } = props;


	// const theme = createTheme(defaultThemeOptions as ThemeOptions)

	const theme = createTheme(_.merge(
		{},
		defaultThemeOptions,
		mustHaveThemeOptions
	) as ThemeOptions)
	const { mode } = theme.palette;

	// const langDirection = useAppSelector(selectCurrentLanguageDirection);

	// useEnhancedEffect(() => {
	// 	if (root) {
	// 		document.body.dir = langDirection;
	// 	}
	// }, [langDirection]);

	useEffect(() => {
		if (root) {
			document.body.classList.add(mode === 'light' ? 'light' : 'dark');
			document.body.classList.remove(mode === 'light' ? 'dark' : 'light');
		}
	}, [mode, root]);

	return (
		<MuiThemeProvider theme={theme}>
			{children}
			{root && inputGlobalStyles}
		</MuiThemeProvider>
	);
}

