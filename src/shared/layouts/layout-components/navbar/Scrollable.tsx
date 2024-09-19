import PerfectScrollbar from "perfect-scrollbar";
import { useEffect, useRef } from "react";

const ScrollableComponent = ({ children }: { children: any }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Initialize Perfect Scrollbar
        const ps = new PerfectScrollbar(containerRef.current!);

        // Cleanup on unmount
        return () => {
            ps.destroy();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
            {children}
        </div>
    );
};

export default ScrollableComponent;