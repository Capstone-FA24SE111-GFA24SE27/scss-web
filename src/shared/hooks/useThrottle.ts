import React, { useCallback, useState } from 'react';

const useThrottle = <T extends (...args: any[]) => void>(
	cb: T,
	delay: number
) => {
	const [shouldWait, setShouldWait] = useState(false);

	return (...args: Parameters<T>) => {
		if (shouldWait) return;
		cb(...args);

		setShouldWait(true);

		setTimeout(() => {
			setShouldWait(false);
		}, delay);
	};
};

export default useThrottle;
