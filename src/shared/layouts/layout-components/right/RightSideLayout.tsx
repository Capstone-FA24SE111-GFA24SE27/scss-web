import { lazy, memo, Suspense } from "react";


const NotificationPanel = lazy(() => import("@/shared/components/notifications/NotificationPanel"));

function RightSideLayout () {
    return (
        <Suspense>
            <NotificationPanel />
        </Suspense>
    )
}

export default memo(RightSideLayout)