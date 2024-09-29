import { selectAccount } from '@shared/store';
import { useAppSelector } from '@shared/store';
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const account = useAppSelector(selectAccount);

	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (account) {
			if (!socket) setSocket(io('http://localhost:4000'));
		} else {
			if (socket) {
				socket.disconnect();
			}
			setSocket(null);
		}
		return () => {
			if (socket) {
				socket.disconnect();
			}
			setSocket(null);
		};
	}, [account]);
	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};
