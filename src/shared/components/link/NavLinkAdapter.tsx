import { NavLink, NavLinkProps, useNavigate } from 'react-router-dom';
import { CSSProperties, forwardRef, ReactNode } from 'react';

export type NavLinkAdapterPropsType = NavLinkProps & {
	activeClassName?: string;
	activeStyle?: CSSProperties;
	children?: ReactNode;
};

const NavLinkAdapter = forwardRef<HTMLAnchorElement, NavLinkAdapterPropsType>((props, ref) => {
	const { activeClassName = 'active', activeStyle, role = 'button', ..._props } = props;
	const navigate = useNavigate();

	return (
		<NavLink
			ref={ref}
			role={role}
			{..._props}
			onClick={(e) => {
				e.preventDefault();
				navigate(_props.to);
			}}
			className={({ isActive }) =>
				[_props.className, isActive ? activeClassName : null].filter(Boolean).join(' ')
			}
			style={({ isActive }) => ({
				..._props.style,
				...(isActive ? activeStyle : null)
			})}
		>
			{props.children}
		</NavLink>
	);
});

export default NavLinkAdapter;
