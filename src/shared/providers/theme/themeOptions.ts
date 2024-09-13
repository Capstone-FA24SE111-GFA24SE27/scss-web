export const defaultThemeOptions = {
	typography: {
		fontFamily: ['Inter var', 'Roboto', '"Helvetica"', 'Arial', 'sans-serif'].join(','),
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500
	},
	components: {
		MuiAppBar: {
			defaultProps: {
				enableColorOnDark: true
			},
			styleOverrides: {
				root: {
					backgroundImage: 'none'
				}
			}
		},
		MuiPickersPopper: {
			styleOverrides: {
				root: {
					zIndex: 99999
				}
			}
		},
		MuiAutocomplete: {
			styleOverrides: {
				popper: {
					zIndex: 99999
				}
			}
		},
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true
			}
		},
		MuiButton: {
			defaultProps: {
				variant: 'text',
				color: 'inherit'
			},
			styleOverrides: {
				root: {
					textTransform: 'none'

					// lineHeight: 1,
				},
				sizeMedium: {
					borderRadius: 20,
					height: 40,
					minHeight: 40,
					maxHeight: 40
				},
				sizeSmall: {
					borderRadius: '15px'
				},
				sizeLarge: {
					borderRadius: '28px'
				},
				contained: {
					boxShadow: 'none',
					'&:hover, &:focus': {
						boxShadow: 'none'
					}
				}
			}
		},
		MuiButtonGroup: {
			defaultProps: {
				color: 'secondary'
			},
			styleOverrides: {
				contained: {
					borderRadius: 18
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				root: {
					textTransform: 'none'
				}
			}
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: 16
				}
			}
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none'
				},
				rounded: {
					borderRadius: 16
				}
			}
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					borderRadius: 8
				}
			}
		},
		MuiTextField: {
			defaultProps: {
				color: 'secondary'
			}
		},
		MuiInputLabel: {
			defaultProps: {
				color: 'secondary'
			}
		},
		MuiSelect: {
			defaultProps: {
				color: 'secondary'
			}
		},
		MuiOutlinedInput: {
			defaultProps: {
				color: 'secondary'
			}
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					minHeight: 40,
					lineHeight: 1
				}
			}
		},
		MuiFilledInput: {
			styleOverrides: {
				root: {
					borderRadius: 4,
					'&:before, &:after': {
						display: 'none'
					}
				}
			}
		},
		MuiSlider: {
			defaultProps: {
				color: 'secondary'
			}
		},
		MuiCheckbox: {
			defaultProps: {
				color: 'secondary'
			}
		},
		MuiRadio: {
			defaultProps: {
				color: 'secondary'
			}
		},
		MuiSwitch: {
			defaultProps: {
				color: 'secondary'
			}
		},
		MuiTypography: {
			variants: [
				{
					props: { color: 'text.secondary' },
					style: {
						color: 'text.secondary'
					}
				}
			]
		}
	}
};


export const mustHaveThemeOptions = {
	typography: {
		htmlFontSize: 10,
		fontSize: 12,
		body1: {
			fontSize: '1.4rem'
		},
		body2: {
			fontSize: '1.4rem'
		}
	}
};