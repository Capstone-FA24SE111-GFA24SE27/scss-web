import { ThemeOptions } from "@mui/material";


const defaultPalette = {
	mode: "light",
	text: {
		primary: "#111827",  // rgb(17, 24, 39)
		secondary: "#6b7280", // rgb(107, 114, 128)
		disabled: "#959ca9"   // rgb(149, 156, 169)
	},
	common: {
		black: "#111827",     // rgb(17, 24, 39)
		white: "#ffffff"      // rgb(255, 255, 255)
	},
	primary: {
		light: "#64748b",
		main: "#1e293b",
		dark: "#0f172a",
		contrastDefaultColor: "light",
		contrastText: "#ffffff" // rgb(255, 255, 255)
	},
	secondary: {
		light: "#fca311",
		main: "#e67e22",
		dark: "#c65d14",
		contrastText: "#ffffff" // rgb(255, 255, 255)
	},
	background: {
		paper: "#FFFFFF",
		default: "#f1f5f9"
	},
	error: {
		light: "#ffcdd2",
		main: "#f44336",
		dark: "#b71c1c",
		contrastText: "#ffffff" // rgb(255, 255, 255)
	},
	divider: "#e2e8f0"
}

export const defaultThemeOptions = {
	typography: {
		fontFamily: ['Inter var', 'Roboto', '"Helvetica"', 'Arial', 'sans-serif'].join(','),
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		htmlFontSize: 10,
		fontSize: 14,
		body1: {
			fontSize: '1.4rem'
		},
		body2: {
			fontSize: '1.4rem'
		}
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
				color: 'inherit',
			},
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 600, 
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
					color: `${defaultPalette.primary.contrastText} !important`,
					'&:hover, &:focus': {
						boxShadow: 'none'
					}
				},
			}
		},
		MuiButtonGroup: {
			defaultProps: {
				color: 'secondary'
			},
			styleOverrides: {
				contained: {
					borderRadius: 18,
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
				color: 'primary'
				// color: 'secondary'
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
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					// borderRadius: 8,
					'&.Mui-selected': {
						backgroundColor: 'primary.dark',
						// boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
						'&:hover': {
							backgroundColor: 'primary.light', // Customize background color on hover when selected
						},
					},
					'&:hover': {
						backgroundColor: 'primary.light', // Customize background color on hover when not selected
					},
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					display: 'flex',
					width: '100%',
					flexDirection: 'column',
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					borderRadius: 4,
					marginBottom: 16,
					boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
				},
			},
		},
		MuiPickersDay: {
			styleOverrides: {
				root: {
					'&.Mui-selected': {
						backgroundColor: 'secondary.main', // Change this to your desired color
					},
					'&:hover, &:focus': {
						backgroundColor: 'secondary.light',
					}
				},
			},
		},
	},
	palette: defaultPalette
} as ThemeOptions;


