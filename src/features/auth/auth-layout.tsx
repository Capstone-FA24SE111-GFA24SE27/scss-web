import { Outlet } from 'react-router-dom'
import { AppLayout, Config } from '@/shared/layouts'
const AuthLayout = () => {
    const config: Config = {
        navbar: {
            display: false,
            position: 'left',
        },
        toolbar: {
            display: false,
            style: 'fixed',
        },
        footer: {
            display: false,
            style: 'fixed',
        },
        leftSidePanel: {
            display: false,
            position: 'right',
        },
        rightSidePanel: {
            display: false,
            position: 'left',
        },
    }
    return (
        <AppLayout config={config}>
            <Outlet />
        </AppLayout>
    )
}

export default AuthLayout